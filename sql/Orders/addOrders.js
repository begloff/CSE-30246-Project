const fs = require('fs')
let mysql = require('mysql')
const orders = require('./output.json')

async function q() {
    conn = await mysql.createConnection({host:"duncangrille.mysql.database.azure.com", 
        user:"grille_admin", 
        password:"Dubbuff$5", 
        database:"duncan_grille", 
        port:3306, 
        ssl:{ca: fs.readFileSync("../cert.pem")}});

    await conn.connect(function(err) {
        if (err) {
            return console.error('error' + err.message)
        }

        console.log('Connected to Mysql server');
    });

    await readOrders()

    await conn.end(function (err) {
        if (err) {
            return console.error('error: ' + err.message)
        }

        console.log('Connection closed');
    })

}
async function readOrders(){

    //Put Sunday and Thursday in as date times --> Just need to extract week of ...

    for( let i = 0; i < orders.length; i++ ){

        if(orders[i].done){
            done = 1
        } else {
            done = 0
        }

        if(orders[i].cash){
            cash = 1
        } else {
            cash = 0
        }

        if(orders[i].online){
            online = 1
        } else {
            online = 0
        }


    
        sql = `INSERT INTO orders (price, items, order_time, order_day, order_datetime, week_id, cust_id, cash, online, done, comments) values (${orders[i].price}, ${orders[i].items}, \'${orders[i].time}\', \'${orders[i].dayofweek}\', \'${orders[i].datetime}\', ${orders[i].weekId}, ${orders[i].id}, ${cash}, ${online}, ${done}, \"${orders[i].comments}\");`

        console.log(sql)

        var x = new Promise((res, rej) => conn.query(sql, function (err, result) {
            if (err) throw err;
            res(result)
        }));

        await x


    }

}

q()
