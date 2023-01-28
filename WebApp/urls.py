from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
import WebApp.views as views
from WebApp import controllers
urlpatterns = [
    path('', views.home, name='home'),
    path('map_fixed_size/', views.map_fixed_size, name='map_fixed_size'),
    path('map_from_gee/', views.map_from_gee, name='map_from_gee'),
    path('map_full_screen/', views.map_full_screen, name='map_full_screen'),
    path('chart_from_netcdf/', views.chart_from_netcdf, name='chart_from_netcdf'),
    path('chart_climateserv/', views.chart_climateserv, name='chart_climateserv'),
    path('chart_sqlite/', views.chart_sqlite, name='chart_sqlite'),
    path('about/', views.about, name='about'),
    path('login/', views.login, name='login'),
    path('setup/', views.setup, name='setup'),
    path('feedback/', views.feedback, name='feedback'),
    path('updates/', views.updates, name='updates'),
    path('chart_sqlite/stations/', controllers.stations, name='stations'),
    path('chart_from_netcdf/get-timeseries-netcdf/', controllers.get_timeseries_netcdf, name='get-timeseries-netcdf'),
    path('chart_climateserv/get-timeseries-climateserv/', controllers.get_timeseries_climateserv,
         name='get-timeseries-climateserv'),
    path('chart_sqlite/get-timeseries-sqlite/', controllers.get_timeseries_sqlite, name='get-timeseries-sqlite'),
    path('map_from_gee/get-gee-layer/', controllers.get_gee_layer, name='get-gee-layer'),
    path('map_from_gee/get-gee-user-layer/', controllers.get_gee_user_layer, name='get-gee-user-layer'),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
