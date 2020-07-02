import os
import json
from pprint import pprint

filepath = os.path.dirname(os.path.abspath(__file__))

readfile = filepath + '/../data/raw/imagga.json'
data = json.load(open(readfile))

colors = list()

for key in data.keys():
    year = data[key]['year']
    if not year == "?":
        image_colors = data[key]['colors']['image_colors']
        image_colors = [{
            'rgb': [color['r'], color['g'], color['b']],
            'percent': color['percent'],
        } for color in image_colors]

        colors.append({
            'year': year,
            'id': key[18:],
            'title': data[key]['title'],
            'image': data[key]['image'],
            'color': image_colors
        })

writefile = filepath + '/../data/colors.json'

with open(writefile, 'w', encoding='utf-8') as file:
    json.dump(colors, file, ensure_ascii=False)
