import calendar
import json
import os
import warnings
from datetime import datetime, timedelta
from pathlib import Path

import climateserv.api
import ee
import netCDF4 as netCDF4
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from shapely.errors import ShapelyDeprecationWarning
from shapely.geometry import Polygon

from WebApp.models import Measurement
from WebApp.utils import get_stations

warnings.filterwarnings("ignore", category=ShapelyDeprecationWarning)

BASE_DIR = Path(__file__).resolve().parent.parent
f = open(str(BASE_DIR) + '/data.json', )  # Get the data from the data.json file
data = json.load(f)


# Get the time series data from the netCDF file
@csrf_exempt
def get_timeseries_netcdf(request):
    json_obj = {}

    if request.method == 'POST':
        variable = request.POST["variable"]  # Get the variable from the request
        interaction = request.POST["interaction"]  # Get the interaction from the request
        platform = request.POST["dataset"]  # Get the dataset from the request
        run_date = request.POST["date"]  # Get the date from the request
        geom_data = request.POST["geom_data"]  # Get the geom_data from the user uploaded file
        ts_plot = []
        # Get the coordinates from the geom_data
        if geom_data[0] == '{':
            geom = json.loads(geom_data)['features'][0]['geometry']['coordinates'][0]
            poly_geojson = Polygon(geom)
        else:
            poly_geojson = Polygon(json.loads(geom_data))
        bounds = poly_geojson.bounds
        miny = float(bounds[0])
        minx = float(bounds[1])
        maxy = float(bounds[2])
        maxx = float(bounds[3])
        infile = os.path.join(data['DATA_DIR'], platform, run_date) + ".nc"  # Get the netCDF file path
        nc_fid = netCDF4.Dataset(infile, 'r')
        lis_var = nc_fid.variables
        field = nc_fid.variables[variable][:]
        lats = nc_fid.variables['lat'][:]
        lons = nc_fid.variables['lon'][:]
        time = nc_fid.variables['time'][:]
        latli = np.argmin(np.abs(lats - minx))
        latui = np.argmin(np.abs(lats - maxx))
        lonli = np.argmin(np.abs(lons - miny))
        lonui = np.argmin(np.abs(lons - maxy))
        for timestep, v in enumerate(time):
            val = field[latli:latui, lonli:lonui, timestep]
            val = np.mean(val)
            if not np.isnan(
                    val) and val != 'Nan':  # Check if the value is a number and add it to the ts_plot, the resultant array
                dt_str = netCDF4.num2date(lis_var['time'][timestep], units=lis_var['time'].units,
                                          calendar=lis_var['time'].calendar)
                test = dt_str + timedelta(hours=5)  # local time hour
                test = test + timedelta(minutes=30)  # local time min
                dtt = test.strftime('%Y-%m-%dT%H:%M:%SZ')
                dt = datetime.strptime(dtt, '%Y-%m-%dT%H:%M:%SZ')
                time_stamp = calendar.timegm(dt.timetuple()) * 1000
                ts_plot.append([time_stamp, float(val)])

        ts_plot.sort()
        geom = [round(minx, 2), round(miny, 2), round(maxx, 2), round(maxy, 2)]  # Get the geometry bounds
        json_obj['plot'] = ts_plot
        json_obj['geom'] = geom
        return JsonResponse(json_obj)


# Get the time series data from the ClimateServ API
@csrf_exempt
def get_timeseries_climateserv(request):
    json_obj = {}
    if request.method == 'POST':
        DatasetType = request.POST.getlist("dataset[]")  # Get the dataset type(s)
        print(DatasetType)
        for dataset in DatasetType:
            OperationType = request.POST["operation"]  # Get the operation type
            EarliestDate = request.POST["startdate"]  # Get the start date
            LatestDate = request.POST["enddate"]  # Get the end date
            GeometryCoords = request.POST["geom_data"]  # Get the geometry coordinates from user uploaded geojson file

            SeasonalEnsemble = ''  # only used for Seasonal_Forecast
            SeasonalVariable = ''  # only used for Seasonal_Forecast
            if GeometryCoords[0] == '{':
                geom = json.loads(GeometryCoords)['features'][0]['geometry']['coordinates'][0]
                result = (climateserv.api.request_data(dataset, OperationType,
                                                       EarliestDate, LatestDate, geom,
                                                       SeasonalEnsemble, SeasonalVariable,
                                                       'memory_object'))  # Get the data from the ClimateServ API
            else:

                result = (climateserv.api.request_data(dataset, OperationType,
                                                       EarliestDate, LatestDate, GeometryCoords,
                                                       SeasonalEnsemble, SeasonalVariable,
                                                       'memory_object'))  # Get the data from the ClimateServ API
            ts_plot = []
            data = result['data']
            for d in data:
                dt = datetime.strptime(d['date'], '%m/%d/%Y')
                time_stamp = calendar.timegm(dt.timetuple()) * 1000
                ts_plot.append(
                    [time_stamp, d['value']['avg']])  # Get the average value from the data along with the date
            json_obj['geom'] = GeometryCoords
            json_obj[dataset] = ts_plot
    return JsonResponse(json_obj)


# Get the time series data from the SQLite database
@csrf_exempt
def get_timeseries_sqlite(request):
    ts_plot_temp = []
    ts_plot_precip = []
    json_obj = {}
    try:
        station = request.POST["station"]  # Get the station name from the request
        startdate = request.POST["startdate"]  # Get the start date from the request
        enddate = request.POST["enddate"]  # Get the end date from the request
        print(startdate)
        print(station)
        print(enddate)
        if station != "default":
            measurement_rows = Measurement.objects.all().filter(measurement_date__range=[startdate,enddate]).filter(station__station_name=station).only("measurement_date",
                                                                                   "measurement_temp",
                                                                                   "measurement_precip")[:10]
            print(measurement_rows)
            for row in measurement_rows:
                print(row)
                dt = row.measurement_date
                time_stamp = calendar.timegm(dt.timetuple()) * 1000
                val = row.measurement_temp
                ts_plot_temp.append([time_stamp, float(val)])  # Append the temperature data to the list
                ts_plot_precip.append([time_stamp, float(row.measurement_precip)])

            ts_plot_temp.sort()
            json_obj["plot_temp"] = ts_plot_temp  # Add the temperature data to the json object
            json_obj["plot_precip"] = ts_plot_precip  # Add the precipitation data to the json object
    except Exception as e:
        print(e)
    return JsonResponse(json_obj)


# Get URL of Image Collection Layer form Google Earth Engine
@csrf_exempt
def get_gee_layer(request):
    service_account = data['service_account']  # service account from data.json file
    credentials = ee.ServiceAccountCredentials(service_account,
                                               data['private_key_json'])  # private key from data.json file
    ee.Initialize(credentials)
    params = {'min': 258, 'max': 316, 'palette': ['1303ff', '42fff6', 'f3ff40', 'ff5d0f'], }
    collection = ee.ImageCollection('NASA/GLDAS/V022/CLSM/G025/DA1D').filter(
        ee.Filter.date('2010-06-01', '2010-06-02'))  # image collection from Google Earth Engine
    image = collection.select('AvgSurfT_tavg')  # select the image from the collection
    imgId = image.getMapId(params)
    json_obj = {"url": imgId['tile_fetcher'].url_format}  # get the URL of the image
    return JsonResponse(json_obj)


# Get URL of User Asset Layer form Google Earth Engine
@csrf_exempt
def get_gee_user_layer(request):
    service_account = data['service_account']  # service account from data.json file
    credentials = ee.ServiceAccountCredentials(service_account,
                                               data['private_key_json'])  # private key from data.json file
    ee.Initialize(credentials)  # initialize the credentials
    user_asset = ee.Image(
        "projects/servir-sco-assets/assets/tmp_servir_cms/factors_t1/f2_pcp_x1k")  # user asset from Google Earth Engine
    params = {'min': 1000, 'max': 3000, 'bands': ['b1'],
              'palette': ['fcffe7', 'd2ffba', '70d7ff', '423fff'], }  # parameters for the layer
    user_img = user_asset.getMapId(params)
    json_obj = {"url": user_img['tile_fetcher'].url_format}  # get the URL of the image
    return JsonResponse(json_obj)


# Get stations list from the Data Model
@csrf_exempt
def stations(request):
    return JsonResponse(get_stations())


def get_measurements(request):
    obj = Measurement.objects.all().filter(measurement_date__range=[request.POST["startdate"],request.POST["enddate"]]).filter(station__station_name=request.POST["station"]).values("station__station_name",
                                                                                         "measurement_date","measurement_precip",
                                                                                         "measurement_temp")
    json_obj = {}
    resullt = []
    print(obj)
    for r in obj:
        temp = r["measurement_temp"]
        date=r["measurement_date"]
        precip = r["measurement_precip"]
        station = r["station__station_name"]
        resullt.append({"station": station, "date":date,"temp": temp, "precip": precip})
    print(resullt)
    json_obj["data"] = resullt
    return JsonResponse(json_obj)
