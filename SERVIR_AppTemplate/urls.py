"""SERVIR_AppTemplate URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

import SERVIR_AppTemplate
import WebApp.views as views
from WebApp import controllers

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('home/', views.home, name='home'),
    path('map1/', views.map1, name='map1'),
    path('map2/', views.map2, name='map2'),
    path('map3/', views.map3, name='map3'),
    path('chart1/', views.chart1, name='chart1'),
    path('chart2/', views.chart2, name='chart2'),
    path('chart3/', views.chart3, name='chart3'),
    path('about/', views.about, name='about'),
    path('login/', views.login, name='login'),
    path('feedback/', views.feedback, name='feedback'),
    path('updates/', views.updates, name='updates'),
    path('updates/update-record/', controllers.update_record, name='update-record'),
    path('chart1/get-timeseries-netcdf/', controllers.get_timeseries_netcdf, name='get-timeseries-netcdf'),
    path('chart2/get-timeseries-climateserv/', controllers.get_timeseries_climateserv, name='get-timeseries-climateserv'),
    path('chart3/get-timeseries-sqlite/', controllers.get_timeseries_sqlite, name='get-timeseries-sqlite'),
    path('map2/get-gee-layer/', controllers.get_gee_layer, name='get-gee-layer'),
    path('map2/get-gee-user-layer/', controllers.get_gee_user_layer, name='get-gee-user-layer'),
    path('accounts/', include('allauth.urls')),
]
