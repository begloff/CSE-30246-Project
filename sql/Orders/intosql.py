import json

j           = open('sorterOrter.json')
orderWeeks  = json.load(j)

out = []

for order in orderWeeks:
    o = {}
    o['cash'] = order[0]
    o['comments'] = order[1]
    o['datetime'] = order[2]["__time__"]
    o['done'] = order[3]
    o['email'] = order[4]
    o['items'] = order[5]
    o['online'] = order[7]
    o['price'] = order[8]
    o['time'] = order[9]
    out.append(o)

with open("ordersql.json", "w") as outfile:
    json.dump(out, outfile)
