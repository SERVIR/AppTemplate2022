from django.contrib import admin

# Register your models here.
from WebApp.models import Station, Measurement, Organization

admin.site.register(Station)
admin.site.register(Measurement)
admin.site.register(Organization)