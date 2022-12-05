from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

def home(request):
    return render(request, 'WebApp/home.html', {})


def map1(request):
    return render(request, 'WebApp/map_fixedsize.html', {})


def login(request):
    return render(request, 'WebApp/login.html', {})


def map2(request):
    return render(request, 'WebApp/map_from_GEE.html', {})


def map3(request):
    return render(request, 'WebApp/map_fullscreen.html', {})


def chart1(request):
    return render(request, 'WebApp/chart_from_netCDF.html', {})


def chart2(request):
    return render(request, 'WebApp/chart_from_ClimateSERV.html', {})


def chart3(request):
    return render(request, 'WebApp/chart_from_SQLite.html', {})


def about(request):
    return render(request, 'WebApp/about.html', {})


def feedback(request):
    return render(request, 'WebApp/feedback.html', {})


@csrf_exempt
def updates(request):
    return render(request, 'WebApp/update_datamodel.html', {})
