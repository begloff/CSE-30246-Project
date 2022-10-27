#!/usr/bin//env python3

import json

j               = open('finances.json')
financeWeeks    = json.load(j)['data']

finances = dict()

for week in financeWeeks:
    for obj in financeWeeks[week]['__collections__']:
        i = 0
        if obj == 'daily-totals':
            financesOut = dict()
            for day in financeWeeks[week]['__collections__'][obj]:
                temp = dict()
                for thing in financeWeeks[week]['__collections__'][obj][day]:
                    if(thing != '__collections__'):
                        temp[thing] = financeWeeks[week]['__collections__'][obj][day][thing]
                financesOut[day] = temp
                i += 1

    if(financesOut):
        finances[week] = financesOut

with open("balSheet.json", "w") as outfile:
    json.dump(finances, outfile)