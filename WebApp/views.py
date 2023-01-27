import datetime
import json
import os
import urllib
from pathlib import Path

import netCDF4
import numpy as np
import requests
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.views.decorators.csrf import csrf_exempt

from WebApp.forms import MeasurementForm
from WebApp.models import Measurement
import requests
from bs4 import BeautifulSoup

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
f = open(str(BASE_DIR) + '/data.json', )
data = json.load(f)

def home(request):
    context={
        "app_cards":[
            {"name":"Display WMS data (fixed-size view)","background_image_url":"static/images/cards/fixed.PNG",'url':reverse('map_fixedSize')},
            {"name":"Display GEE data (fixed-size view)","background_image_url":"static/images/cards/gee.PNG",'url':reverse('map_fromGEE')},
            {"name":"Display WMS data (full-screen view)","background_image_url":"static/images/cards/full.PNG",'url':reverse('map_fullScreen')},
            {"name":"Chart from NetCDF file","background_image_url":"static/images/cards/netCDF.jpg",'url':reverse('chart_fromNetcdf')},
            {"name":"Chart from ClimateSERV API","background_image_url":"static/images/cards/ClimateSERV.jpg",'url':reverse('chart_climateserv')},
            {"name":"Chart from SQL Database","background_image_url":"static/images/cards/SQLite.jpg",'url':reverse('chart_sqlite')},
            {"name":"Use forms to enter data","background_image_url":"static/images/cards/EnterData.jpg",'url':reverse('updates')},
            ],
    }

    return render(request, 'WebApp/home.html', context)


def map_fixedSize(request):
    return render(request, 'WebApp/map_fixedsize.html', {})


def login(request):
    return render(request, 'WebApp/login.html', {})


def map_fromGEE(request):
    return render(request, 'WebApp/map_from_GEE.html', {})


def map_fullScreen(request):
    return render(request, 'WebApp/map_fullscreen.html', {})


def chart_fromNetcdf(request):
    # url = 'https://thredds.servirglobal.net/thredds/wms/mk_aqx/geos/20191123.nc?service=WMS&version=1.3.0&request=GetCapabilities'
    # document = requests.get(url)
    # soup = BeautifulSoup(document.content, "lxml-xml")
    # bounds=soup.find("EX_GeographicBoundingBox")
    # children = bounds.findChildren()
    # bounds_nc=[float(children[0].get_text()),float(children[1].get_text()),float(children[2].get_text()),float(children[3].get_text())]

    context = {
        "netcdf_path": data["sample_netCDF"],
        # "netcdf_bounds":bounds_nc
    }
    return render(request, 'WebApp/chart_from_netCDF.html', context)


def chart_climateserv(request):
    return render(request, 'WebApp/chart_from_ClimateSERV.html', {})


def chart_sqlite(request):
    return render(request, 'WebApp/chart_from_SQLite.html', {})


def about(request):
    return render(request, 'WebApp/about.html', {})


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
            url = reverse('admin:%s_%s_change' % (member._meta.app_label,  member._meta.model_name),  args=[member.id] )
            messages.success(request,
                             mark_safe('Data submitted! <a href="' + url + '">Go to this record in admin pages</a>'),
                             extra_tags='form1')
            form = MeasurementForm()
        else:
            messages.error(request, 'Invalid form submission.')
            messages.error(request, form.errors)
    else:
        form = MeasurementForm()
    return render(request, 'WebApp/update_datamodel.html', {"form": form})


""" @csrf_exempt
def updates2(request):
    context={}
    form = MeasurementForm(request.POST)
    context["form"]=form

    if form.is_valid():
        measurement_date = form.cleaned_data["measurement_date"]
        measurement_temp = form.cleaned_data["measurement_temp"]
        measurement_precip = form.cleaned_data["measurement_precip"]
        stations = form.cleaned_data["stations"]
        m = Measurement(measurement_date=measurement_date, measurement_temp=measurement_temp, measurement_precip=measurement_precip, stations=stations)
        m.save()
        return HttpResponseRedirect("/updates")

    return render(request, 'WebApp/update_datamodel.html', context) """
