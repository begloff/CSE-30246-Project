#!/usr/bin//env python3

import json

j               = open('finances.json')
financeWeeks    = json.load(j)['data']

finances = dict()

for week in financeWeeks:
    for obj in financeWeeks[week]['__collections__']:
        j = 0
        if obj == 'schedule':
            financesOut = dict()
            for day in financeWeeks[week]['__collections__'][obj]:
                temp = dict()
                for thing in financeWeeks[week]['__collections__'][obj][day]:
                    if(thing == 'schedule'):
                        #Need to insert all three individually --> Breaks apart list
                        temp[thing] = dict()
                        for person in financeWeeks[week]['__collections__'][obj][day][thing]:
                            temp[thing][j] = person
                            j += 1

                        j = 0

                    elif(thing != '__collections__'):
                        temp[thing] = financeWeeks[week]['__collections__'][obj][day][thing]

                financesOut[day] = temp

    finances[week] = financesOut

with open("schedule.json", "w") as outfile:
    json.dump(finances, outfile)