import os
import json
from pprint import pprint

filepath = os.path.dirname(os.path.abspath(__file__))

readfile = filepath + '/../data/raw/imagga.json'
data = json.load(open(readfile))

colors = dict()

for key in list(data.keys()):
    if not data[key]['year'] == "?":
        c = data[key]['colors']['image_colors']
        c = [
            {
                'html': color['html_code'],
                'percent': color['percent'],
                'parent': color['closest_palette_color_parent']
            } for color in c
        ]
        colors[key[18:]] = {
            'title': data[key]['title'],
            'image': data[key]['image'],
            'year': data[key]['year'],
            'color': c
        }

writefile = filepath + '/../data/colors.json'

with open(writefile, 'w', encoding='utf-8') as file:
    json.dump(colors, file, ensure_ascii=False, indent=2)
