var fs = require('fs')
const orders = require('./output.json')

for(let i = 0; i < orders.length; i++){
    s=orders[i]
    s.datetime = s.datetime.slice(0, 19).replace('T', ' ')
}

const userData = JSON.stringify(orders);
fs.writeFile("output.json", userData, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("output.json has been saved with the user data");
    }})