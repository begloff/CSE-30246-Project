#!/usr/bin//env python3

primes = {
    'pizza'                 : 2,
    'dubbuff'               : 3,
    'singlebuff'            : 5,
    'cbr'                   : 7,
    'half'                  : 11,
    'cheese'                : 13,
    'chicken'               : 17,
    'soda/gatorade'         : 19,
    'ice cream'   : 23
}

import json
data    = json.load(open('ordersAdj.json'))

for order in data:
    itemList    = order[5]
    order[5] = 1
    for item in itemList:
        for k in primes.keys():
            if k in item.lower():
                order[5] = order[5] * primes[k]

with open('ordersAdj2.json', 'w') as outputfile:
    json.dump(data, outputfile)