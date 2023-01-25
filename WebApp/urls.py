from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
import WebApp.views as views
from WebApp import controllers
urlpatterns = [
    path('', views.home, name='home'),
    path('map_fixedSize/', views.map_fixedSize, name='map_fixedSize'),
    path('map_fromGEE/', views.map_fromGEE, name='map_fromGEE'),
    path('map_fullScreen/', views.map_fullScreen, name='map_fullScreen'),
    path('chart_fromNetcdf/', views.chart_fromNetcdf, name='chart_fromNetcdf'),
    path('chart_climateserv/', views.chart_climateserv, name='chart_climateserv'),
    path('chart_sqlite/', views.chart_sqlite, name='chart_sqlite'),
    path('about/', views.about, name='about'),
    path('login/', views.login, name='login'),
    path('setup/', views.setup, name='setup'),
    path('feedback/', views.feedback, name='feedback'),
    path('updates/', views.updates, name='updates'),
    path('chart_sqlite/stations/', controllers.stations, name='stations'),
    path('updates/update-record/', controllers.update_record, name='update-record'),
    path('chart_fromNetcdf/get-timeseries-netcdf/', controllers.get_timeseries_netcdf, name='get-timeseries-netcdf'),
    path('chart_climateserv/get-timeseries-climateserv/', controllers.get_timeseries_climateserv,
         name='get-timeseries-climateserv'),
    path('chart_sqlite/get-timeseries-sqlite/', controllers.get_timeseries_sqlite, name='get-timeseries-sqlite'),
    path('map_fromGEE/get-gee-layer/', controllers.get_gee_layer, name='get-gee-layer'),
    path('map_fromGEE/get-gee-user-layer/', controllers.get_gee_user_layer, name='get-gee-user-layer'),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
