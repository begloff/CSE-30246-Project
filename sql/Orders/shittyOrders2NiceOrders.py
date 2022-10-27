#!/usr/bin//env python3

import json

j           = open('orders.json')
orderWeeks  = json.load(j)['data']

out = []

for week in orderWeeks:
    for orderDays in orderWeeks[week]['__collections__']:
        for orderNum in orderWeeks[week]['__collections__'][orderDays]:
            temp = []
            for thing in orderWeeks[week]['__collections__'][orderDays][orderNum]:
                temp.append(orderWeeks[week]['__collections__'][orderDays][orderNum][thing])
            out.append(temp)


with open("hours.json", "w") as outfile:
    json.dump(out, outfile)