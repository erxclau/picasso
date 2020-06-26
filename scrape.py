import os
import json
import time

import requests
from bs4 import BeautifulSoup

BASE_URL = 'https://www.wikiart.org'

page = requests.get(f'{BASE_URL}/en/pablo-picasso/all-works/text-list')
soup = BeautifulSoup(page.content, 'html.parser')

elements = soup.find_all('li', attrs={'class', 'painting-list-text-row'})

works = dict()

for element in elements:
    link = element.find('a')
    year = element.find('span').text[2:]
    print(link.text, link['href'], year)

    work = requests.get(f"{BASE_URL}{link['href']}")
    s = BeautifulSoup(work.content, 'html.parser')
    img = s.find('img', attrs={'class', 'ms-zoom-cursor'})

    works[link['href']] = {
        'image': img['src'],
        'title': link.text,
        'year': year
    }

filepath = os.path.dirname(os.path.abspath(__file__))
writefile = filepath + '/data.json'

with open(writefile, 'w', encoding='utf-8') as file:
    json.dump(works, file, ensure_ascii=False)
