from WebApp.models import Station


def get_stations():
    try:
        station_ids = list(Station.objects.values_list('station_id', flat=True))
        stations = []
        for s in station_ids:
            stations.append(
                {'station_name': list(Station.objects.filter(station_id=s).values_list('station_name', flat=True))[0],
                 'station_id': s})

        json_obj = {"stations": stations}
    except:
        json_obj = {"stations": {}}
    return json_obj
