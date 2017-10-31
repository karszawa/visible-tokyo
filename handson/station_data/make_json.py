import json

stations_json = {}

with open('11302.json', 'r') as f:
    json_dict = json.load(f)
    stations = json_dict["station_l"]
    for station in stations:
        stations_json[station['station_name']] = [station['lon'], station['lat'], station['station_name']]

print(stations_json)

with open('test.json', 'w') as f:
    json.dump(stations_json, f)
