from django.shortcuts import render


# Create your views here.
from django.views import generic
from django.views.decorators.csrf import csrf_exempt

from WebApp.models import Measurement


def home(request):
    return render(request, 'WebApp/home.html', {})

def map1(request):
    return render(request, 'WebApp/map1.html', {})

def login(request):
    return render(request, 'WebApp/login.html', {})


def map2(request):
    return render(request, 'WebApp/map2.html', {})

def map3(request):
    return render(request, 'WebApp/map3.html', {})


def chart1(request):
    return render(request, 'WebApp/chart1.html', {})


def chart2(request):
    return render(request, 'WebApp/chart2.html', {})


def chart3(request):
    return render(request, 'WebApp/chart3.html', {})


def about(request):
    return render(request, 'WebApp/about.html', {})


def feedback(request):
    return render(request, 'WebApp/feedback.html', {})


@csrf_exempt
def updates(request):
    return render(request, 'WebApp/updates.html', {})