from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from WebApp.forms import MeasurementForm
from WebApp.models import Measurement


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
    return render(request, 'WebApp/chart_from_netCDF.html', {})


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
