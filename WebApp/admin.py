from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from WebApp.models import Station, Measurement, Organization

# Register the models to the admin site

admin.site.site_header = "SERVIR Template App Administration"


class MeasurementAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = (
        'station', 'measurement_date', 'measurement_temp', 'measurement_precip')  # list of fields to display
    list_filter = ('station__station_name',)  # filter by station name
    search_fields = ['station__station_name', ]  # search by station name
    date_hierarchy = 'measurement_date'  # filter by date


admin.site.register(Measurement, MeasurementAdmin)  # register the Measurement model


class StationAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('station_id', 'station_name', 'station_location')  # list of fields to display
    list_filter = ('station_organization__organization_name',
                   'station_organization__organization_country')  # filter by organization name and country
    search_fields = ['station_organization__organization_name', 'station_organization__organization_country',
                     'station_organization__organization_city']  # search by organization name, country, and city


admin.site.register(Station, StationAdmin)  # register the Station model to the admin site


class OrganizationAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('organization_id', 'organization_name', 'organization_country')  # list of fields to display
    list_filter = ('organization_country', 'organization_city')  # filter by country and city
    search_fields = ['organization_name', 'organization_country',
                     'organization_city']  # search by organization name, country, and city


admin.site.register(Organization, OrganizationAdmin)  # register the Organization model to the admin site
