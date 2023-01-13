import json
import os
import urllib
from pathlib import Path

import netCDF4
import numpy as np
import requests
from django.http import HttpResponseRedirect
from django.shortcuts import render
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
    return render(request, 'WebApp/home.html', {})


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
        "netcdf_path":data["sample_netCDF"],
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


@csrf_exempt
def updates(request):
    context = {}
    form = MeasurementForm(request.POST)
    context["form"] = form
    if form.is_valid():
        member = Measurement(station_id=request.POST["stations"], measurement_date=request.POST["measurement_date"],
                             measurement_temp=request.POST["measurement_temp"],
                             measurement_precip=request.POST["measurement_precip"])
        member.save()

    return render(request, 'WebApp/update_datamodel.html', context)

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
