import json
from pathlib import Path

from django.contrib import messages
from django.shortcuts import render
from django.templatetags.static import static
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt

from WebApp.forms import MeasurementForm
from WebApp.models import Measurement
# Build paths inside the project like this: BASE_DIR / 'subdir'.
from WebApp.utils import get_stations

BASE_DIR = Path(__file__).resolve().parent.parent
f = open(str(BASE_DIR) + '/data.json', )
data = json.load(f)


def home(request):
    context = {
        "app_cards": [
            {"name": "Display WMS data (fixed-size view)", "background_image_url": static("/images/cards/fixed.PNG"),
             'url': reverse('map_fixed_size')},
            {"name": "Display GEE data (fixed-size view)", "background_image_url": static("/images/cards/gee.PNG"),
             'url': reverse('map_from_gee')},
            {"name": "Display WMS data (full-screen view)", "background_image_url": static("/images/cards/full.PNG"),
             'url': reverse('map_full_screen')},
            {"name": "Chart from NetCDF file", "background_image_url": static("/images/cards/netCDF.jpg"),
             'url': reverse('chart_from_netcdf')},
            {"name": "Chart from ClimateSERV API", "background_image_url": static("/images/cards/ClimateSERV.jpg"),
             'url': reverse('chart_climateserv')},
            {"name": "Chart from SQL Database", "background_image_url": static("/images/cards/SQLite.jpg"),
             'url': reverse('chart_sqlite')},
            {"name": "Use forms to enter data", "background_image_url": static("/images/cards/EnterData.jpg"),
             'url': reverse('updates')},
            {"name": "Select AOI on a map", "background_image_url": static("/images/cards/aoi.PNG"),
             'url': reverse('select_aoi')},
            {"name": "Map & Chart", "background_image_url": static("/images/cards/fixed.PNG"),
             'url': reverse('map_chart')},
        ],
    }

    return render(request, 'WebApp/home.html', context)


@csrf_exempt
def select_aoi(request):
    return render(request, 'WebApp/select_aoi.html', {})


@csrf_exempt
def map_chart(request):
    context = {}
    return render(request, 'WebApp/map_chart.html', context)


def map_fixed_size(request):
    return render(request, 'WebApp/map_fixedsize.html', {})


def login(request):
    return render(request, 'WebApp/login.html', {})


def map_from_gee(request):
    return render(request, 'WebApp/map_from_GEE.html', {})


def map_full_screen(request):
    return render(request, 'WebApp/map_fullscreen.html', {})


def chart_from_netcdf(request):
    # url = 'https://thredds.servirglobal.net/thredds/wms/mk_aqx/geos/20191123.nc?service=WMS&version=1.3.0&request
    # =GetCapabilities' document = requests.get(url) soup = BeautifulSoup(document.content, "lxml-xml")
    # bounds=soup.find("EX_GeographicBoundingBox") children = bounds.findChildren() bounds_nc=[float(children[
    # 0].get_text()),float(children[1].get_text()),float(children[2].get_text()),float(children[3].get_text())]

    context = {
        "netcdf_path": data["sample_netCDF"],
        # "netcdf_bounds":bounds_nc
    }
    return render(request, 'WebApp/chart_from_netCDF.html', context)


def chart_climateserv(request):
    return render(request, 'WebApp/chart_from_ClimateSERV.html', {})


def chart_sqlite(request):
    return render(request, 'WebApp/chart_from_SQLite.html', get_stations())


def about(request):
    return render(request, 'WebApp/about.html', {})


@xframe_options_exempt
def feedback(request):
    return render(request, 'WebApp/feedback.html', {})


def setup(request):
    return render(request, 'WebApp/setup.html', {})


@csrf_exempt
def updates(request):
    if request.method == "POST":
        context = {}
        form = MeasurementForm(request.POST)
        context["form"] = form
        if form.is_valid():
            member = Measurement(station_id=request.POST["stations"], measurement_date=request.POST["measurement_date"],
                                 measurement_temp=request.POST["measurement_temp"],
                                 measurement_precip=request.POST["measurement_precip"])
            member.save()
            url = reverse('admin:%s_%s_change' % (member._meta.app_label, member._meta.model_name), args=[member.id])
            if request.user.is_active and request.user.is_superuser:
                messages.success(request, mark_safe(
                    'Data submitted! <a href="' + url + '">Go to this record in admin pages</a>'), extra_tags='form1')
            else:
                messages.success(request,
                                 mark_safe('Data submitted!'), extra_tags='form1')
            form = MeasurementForm()
        else:
            messages.error(request, 'Invalid form submission.')
            messages.error(request, form.errors)
    else:
        form = MeasurementForm()
    return render(request, 'WebApp/update_datamodel.html', {"form": form})
