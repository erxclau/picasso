import os
import json
from urllib.parse import quote

import requests

filepath = os.path.dirname(os.path.abspath(__file__))

readfile = filepath + '/../data/raw/wikiart.json'
data = json.load(open(readfile))

imaggafile = filepath + '/../imagga_client.json'
imagga = json.load(open(imaggafile))

writefile = filepath + '/../data/raw/imagga.json'

BASE_URL = 'https://api.imagga.com/v2'
ENDPOINT = 'colors'
HEADERS = {'Authorization': imagga['AUTHORIZATION']}

colors = dict()


def writeToFile(colors):
    with open(writefile, 'w', encoding='utf-8') as file:
        json.dump(colors, file, ensure_ascii=False)


for key in data.keys():
    work = data[key]
    img = quote(work['image'], safe="/!:")
    params = {'image_url': img}
    try:
        req = requests.get(f"{BASE_URL}/{ENDPOINT}",
                           params=params, headers=HEADERS)
        print(req.status_code, work['title'], work['year'])
        if(req.status_code == 200):
            res = req.json()
            colors[key] = {
                'colors': res['result']['colors'],
                'image': work['image'],
                'title': work['title'],
                'year': work['year']
            }
    except:
        writeToFile(colors)
        continue

writeToFile(colors)
