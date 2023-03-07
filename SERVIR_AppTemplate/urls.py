"""SERVIR_AppTemplate URL Configuration"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path('admin', RedirectView.as_view(url = '/admin/')),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('', include('WebApp.urls')),
]
