var fs = require('fs')
const orders = require('./output.json')
test=[
    {
      "cash": false,
      "comments": "",
      "datetime": "2022-10-31T02:33:28.645Z",
      "done": true,
      "email": "jvrins@nd.edu",
      "items": 3,
      "online": false,
      "price": 5,
      "time": "12:33:38 AM",
      "id": 86
    }
]
for(let i = 0; i < orders.length; i++){
    s=orders[i]

    x = new Date(s.datetime)

    console.log(x)

    let d=x.getDay() - 1

    console.log(d)
    

    if(d==-1) d=6
    if(d==0){
        dst="SU"
    }
    if(d==1){
        dst="MO"
    }
    if(d==2){
        dst="TU"
    }
    if(d==3){
        dst="WE"
    }
    if(d==4){
        dst="TH"
    }
    if(d==5){
        dst="FR"
    }
    if(d==6){
        dst="SA"
    }
    s.dayofweek=dst
}
//console.log(test)

const userData = JSON.stringify(orders);
fs.writeFile("output.json", userData, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("output.json has been saved with the user data");
    }})