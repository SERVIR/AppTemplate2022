import calendar
import json
import os
import sqlite3
from datetime import datetime, timedelta

import netCDF4 as netCDF4
import numpy as np
import shapely as shapely
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from shapely.geometry import Polygon
import WebApp.config as config
import climateserv.api
import ee

@csrf_exempt
def get_timeseries_netcdf(request):
    json_obj = {}

    if request.method == 'POST':
        variable = request.POST["variable"]
        interaction = request.POST["interaction"]
        platform = request.POST["dataset"]
        run_date = request.POST["date"]
        geom_data = request.POST["geom_data"]
        ts_plot = []

        # Defining the lat and lon from the coords string
        poly_geojson = Polygon(json.loads(geom_data))
        shape_obj = shapely.geometry.asShape(poly_geojson)
        bounds = poly_geojson.bounds
        miny = float(bounds[0])
        minx = float(bounds[1])
        maxy = float(bounds[2])
        maxx = float(bounds[3])
        infile = os.path.join(config.DATA_DIR, platform, run_date) + ".nc"
        print(infile)
        nc_fid = netCDF4.Dataset(infile, 'r')
        lis_var = nc_fid.variables
        field = nc_fid.variables[variable][:]
        lats = nc_fid.variables['lat'][:]
        lons = nc_fid.variables['lon'][:]  # Defining the longitude array
        time = nc_fid.variables['time'][:]
        # Defining the variable array(throws error if variable is not in combined.nc)

        latli = np.argmin(np.abs(lats - minx))
        latui = np.argmin(np.abs(lats - maxx))

        lonli = np.argmin(np.abs(lons - miny))
        lonui = np.argmin(np.abs(lons - maxy))
        for timestep, v in enumerate(time):
            val = field[latli:latui, lonli:lonui, timestep]
            val = np.mean(val)
            if not np.isnan(val):
                dt_str = netCDF4.num2date(lis_var['time'][timestep], units=lis_var['time'].units,
                                          calendar=lis_var['time'].calendar)
                test = dt_str + timedelta(hours=5)  # local time hour
                test = test + timedelta(minutes=30)  # local time min
                dtt = test.strftime('%Y-%m-%dT%H:%M:%SZ')
                dt = datetime.strptime(dtt, '%Y-%m-%dT%H:%M:%SZ')
                time_stamp = calendar.timegm(dt.timetuple()) * 1000
                ts_plot.append([time_stamp, float(val)])

        ts_plot.sort()
        geom = [round(minx, 2), round(miny, 2), round(maxx, 2), round(maxy, 2)]
        json_obj['plot']= ts_plot
        json_obj['geom']= geom
        return JsonResponse(json_obj)

@csrf_exempt
def get_timeseries_climateserv(request):
    json_obj={}
    return_obj=[]

    if request.method == 'POST':
        DatasetType =request.POST.getlist("dataset[]")
        print(DatasetType)
        for dataset in DatasetType:
            OperationType = request.POST["operation"]
            EarliestDate = request.POST["startdate"]
            LatestDate = request.POST["enddate"]
            GeometryCoords=request.POST["geom_data"]
            SeasonalEnsemble = ''  # only used for Seasonal_Forecast
            SeasonalVariable = ''  # only used for Seasonal_Forecast
            print(OperationType)
            print(GeometryCoords)

            result =(climateserv.api.request_data(dataset, OperationType,
                                         EarliestDate, LatestDate, GeometryCoords,
                                         SeasonalEnsemble, SeasonalVariable, 'memory_object'))
            ts_plot=[]
            data = result['data']
            for d in data:
                dt = datetime.strptime(d['date'], '%m/%d/%Y')
                time_stamp = calendar.timegm(dt.timetuple()) * 1000
                ts_plot.append([time_stamp, d['value']['avg']])
            json_obj['geom'] = GeometryCoords
            json_obj[dataset] = ts_plot
    return JsonResponse(json_obj)

@csrf_exempt
def get_timeseries_sqlite(request):
    conn = None
    ts_plot=[]
    ts_plot1 = []
    json_obj={}
    try:
        conn = sqlite3.connect('Chinook.db')
        cur = conn.cursor()

        cur1 = conn.cursor()
        cur.execute("SELECT InvoiceDate,total FROM Invoice LIMIT 10")
        cur1.execute("SELECT InvoiceDate,customerid FROM Invoice LIMIT 10")

        rows = cur.fetchall()
        rows1 = cur1.fetchall()


        for row in rows:
            dt = datetime.strptime(row[0], '%Y-%m-%d %H:%M:%S')
            time_stamp = calendar.timegm(dt.timetuple()) * 1000
            val=row[1]
            ts_plot.append([time_stamp,float(val)])
        for row in rows1:
            dt = datetime.strptime(row[0], '%Y-%m-%d %H:%M:%S')
            time_stamp = calendar.timegm(dt.timetuple()) * 1000
            val = row[1]

            ts_plot1.append([time_stamp,float(val)])
        ts_plot.sort()
        json_obj["plot"] = ts_plot
        json_obj["plot1"] = ts_plot1
    except Exception as e:
        print(e)
    return JsonResponse(json_obj)

@csrf_exempt
def get_gee_layer(request):
    service_account = config.service_account
    credentials = ee.ServiceAccountCredentials(service_account, config.private_key_json)
    ee.Initialize(credentials)
    params = {'min': 258, 'max': 316, 'palette': ['1303ff', '42fff6', 'f3ff40', 'ff5d0f'], }
    collection = ee.ImageCollection('NASA/GLDAS/V022/CLSM/G025/DA1D').filter(ee.Filter.date('2010-06-01', '2010-06-02'))
    image = collection.select('SoilMoist_S_tavg')
    imgId = image.getMapId(params)
    json_obj={"url":imgId['tile_fetcher'].url_format}
    return JsonResponse(json_obj)