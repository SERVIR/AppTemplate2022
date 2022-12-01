from django.contrib import admin

# Register your models here.
from WebApp.models import Station, Measurement, Organization
from import_export.admin import ImportExportModelAdmin

admin.site.register(Station)
admin.site.register(Organization)

class MeasurementAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('station', 'measurement_date', 'measurement_temp','measurement_precip')
    list_filter = ('station__station_name',)
    search_fields = ['station__station_name',]

admin.site.register(Measurement, MeasurementAdmin)