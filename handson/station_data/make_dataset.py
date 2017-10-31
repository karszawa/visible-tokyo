import os
import json

output = {}
lines_dir = './original_data'

# add stations on all lines
for line_file in os.listdir(lines_dir):
    with open(os.path.join(lines_dir, line_file), 'r') as f:
        print(os.path.join(lines_dir, line_file))
        json_dict = json.load(f)
        line = json_dict['line_name']
        stations = json_dict['station_l']

        tmp = {}
        for station in stations:
            tmp[station['station_name']] = [station['lon'], station['lat'], station['station_name']]
        output[line] = tmp

print(output)

# add stations on one line
"""
with open(os.path.join(lines_dir, '28001.json'), 'r') as f:
    json_dict = json.load(f)
    stations = json_dict["station_l"]
    for station in stations:
        output[station['station_name']] = [station['lon'], station['lat'], station['station_name']]
"""

# with open('test.json', 'w') as f:
#     json.dump(stations_json, f)
