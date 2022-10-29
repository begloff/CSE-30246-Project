var fs = require('fs')
const orders = require('./ordersql.json')
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

    dat=s.datetime.slice(0,10)
    end = new Date(dat)
    let d=end.getDay()
    time=s.time.slice(0,2)
    if(time=="12"){
        d--;
    }
    if(d==-1) d=6
    if(d==0){
        dst="MO"
    }
    if(d==1){
        dst="TU"
    }
    if(d==2){
        dst="WE"
    }
    if(d==3){
        dst="TH"
    }
    if(d==4){
        dst="FR"
    }
    if(d==5){
        dst="SA"
    }
    if(d==6){
        dst="SU"
    }
    s.weekofday=dst
}
//console.log(test)

const userData = JSON.stringify(orders);
fs.writeFile("output.json", userData, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("output.json has been saved with the user data");
    }})