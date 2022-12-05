from django.contrib import admin

# Register your models here.
from WebApp.models import Station, Measurement, Organization
from import_export.admin import ImportExportModelAdmin

admin.site.site_header = "SERVIR Template App Administration"

admin.site.register(Station)
admin.site.register(Organization)

class MeasurementAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('station', 'measurement_date', 'measurement_temp','measurement_precip')
    list_filter = ('station__station_name',)
    search_fields = ['station__station_name',]
    date_hierarchy = 'measurement_date'

admin.site.register(Measurement, MeasurementAdmin)

class StationAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('station_id', 'station_name', 'station_location')
    list_filter = ('station_organization__organization_name', 'station_organization__organization_country')
    search_fields = ['station_organization__organization_name', 'station_organization__organization_country', 'station_organization__organization_city' ]

admin.site.register(Station, StationAdmin)

class OrganizationAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('organization_id', 'organization_name', 'organization_country')
    list_filter = ('organization_country', 'organization_city')
    search_fields = ['organization_name', 'organization_country', 'organization_city' ]

admin.site.register(Organization, OrganizationAdmin)
