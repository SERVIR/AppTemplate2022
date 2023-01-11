from django.db import models


# Organization model: This data model describes an organization that operates a monitoring station network
class Organization(models.Model):
    organization_id = models.CharField(max_length=10, primary_key=True,
                                       help_text="Organization ID, usually the Accronym")
    organization_name = models.CharField(max_length=100, help_text="Organization Name (No Accronym)")
    organization_address = models.CharField(max_length=100, help_text="Organization physical address - Optional",
                                            blank=True)
    organization_city = models.CharField(max_length=100, help_text="Organization City - Optional", blank=True)
    organization_country = models.CharField(max_length=2, help_text="Organization Country ISO Code - Optional",
                                            blank=True)


# Station model: This data model describes a monitoring station operated by one of the organizations in the system
class Station(models.Model):
    station_id = models.CharField(max_length=10, primary_key=True, help_text="Station ID, unique identifier code")
    station_name = models.CharField(max_length=100, help_text="Station Name, a human readable name")
    station_lat = models.FloatField(help_text="Station Latitude in decimal degrees")
    station_lon = models.FloatField(help_text="Station Longitude in decimal degrees")
    station_elev = models.FloatField(help_text="Station Elevation in meters above sea level - Optional", blank=True,
                                     null=True)
    station_location = models.CharField(max_length=100, help_text="Station Location - Optional", blank=True)
    station_organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    station_year_established = models.IntegerField(help_text="Year the station was established - Optional", blank=True,
                                                   null=True)

    def __str__(self):
        return self.station_id + "-" + self.station_name


# Simplified Measurement model: This data model describes the individual measurements taken at a monitoring station
# The model includes just a small sample of variables (temperature and precipitation) taken on a daily frequency, for demonstration purposes,
# but it can be easily extended to include more variables and/or more frequent measurements
class Measurement(models.Model):
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    measurement_date = models.DateField(help_text="Measurement Date")
    measurement_temp = models.FloatField(help_text="Temperature in degrees Celsius")
    measurement_precip = models.FloatField(help_text="Precipitation in millimeters")

    def __str__(self):
        return self.station.station_id + "-" + self.station.station_name + "-" + str(self.measurement_date)
