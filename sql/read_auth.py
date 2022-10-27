import json

f = open('auth.json')

customers = []

data = json.load(f)

for email, items in data['data'].items():
    print(email,items)

f.close()