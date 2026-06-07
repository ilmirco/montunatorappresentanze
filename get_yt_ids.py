import urllib.request
import re

def get_channel_id(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    match = re.search(r'"browseId":"(UC[a-zA-Z0-9_-]+)"', html)
    if match:
        return match.group(1)
    return "Not Found"

print("AMRA:", get_channel_id('https://www.youtube.com/@amra-chauvinarnouxgroup2838/featured'))
print("Chauvin Arnoux:", get_channel_id('https://www.youtube.com/@ChauvinArnouxUK/videos'))
print("Ortea Nuova:", get_channel_id('https://www.youtube.com/@orteas.p.a.672/featured'))
