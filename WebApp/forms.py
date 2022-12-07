from django import forms
from django.forms import widgets
from WebApp.models import Measurement, Station


class MeasurementForm(forms.Form):
    # #
    measurement_date = forms.DateField(label="Measurement Date", widget=widgets.DateInput(attrs={'type': 'date'}))
    measurement_temp = forms.FloatField()
    measurement_precip = forms.FloatField()
    stations = forms.ModelChoiceField(queryset=Station.objects.all(), initial=Station.objects.first())