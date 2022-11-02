let mysql = require('mysql')
var fs = require('fs')

async function q() {
    conn = await mysql.createConnection({host:"duncangrille.mysql.database.azure.com", 
        user:"grille_admin", 
        password:"Dubbuff$5", 
        database:"duncan_grille", 
        port:3306, 
        ssl:{ca: fs.readFileSync("cert.pem")}});

    await conn.connect(function(err) {
        if (err) {
            return console.error('error' + err.message)
        }

        console.log('Connected to Mysql server');
    });

    await insertOrder(10.00, 4, 10, 'WE', 1, 0, 0, 0, "poopoo")
    await getOrdersByDate("2022-10-13")
    x = await getAllOrders()
    
    
    console.log(x)

    await conn.end(function (err) {
        if (err) {
            return console.error('error: ' + err.message)
        }

        console.log('Connection closed');
    })

}

// async function insertOrder(price, items, cust_id, day, week_id, cash, online, done, comments) {
//     let today = new Date()
//     let sql = `INSERT INTO orders (price, items, order_time, order_day, order_datetime, week_id, cust_id, cash, online, done, comments) values (${price}, ${items}, \"${today.toLocaleTimeString()}\",  \"${day}\", \"${formatDate(today)}\", ${week_id}, ${cust_id}, ${cash}, ${online}, ${done}, \"${comments}\");`
//     res = await callDB(sql)
//     return res
// }

// async function getAllOrders() {
//     var x = await callDB('select * from orders;')
//     return x
// }

// async function getOrderById(order_id) {
//     let sql = `SELECT * FROM orders WHERE id = ${order_id}`
//     let x = await callDB(sql)
//     return x
// }

// async function getOrdersByDate(date) {
//     let sql = `SELECT * FROM orders WHERE order_time like \"${date}%\"`
//     let x = await callDB(sql)
//     return x
// }

// async function deleteOrder(order_id) {
//     let sql = `DELETE FROM orders WHERE id = ${order_id}`
//     let x = await callDB(sql)
//     return x
// }

async function callDB(sql) {
    var x = new Promise((res, rej) => conn.query(sql, function (err, result) {
        if (err) throw err;
        res(result)
    }));
    await x
    return x
}

// function formatDate(date) {
//     return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}:${date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()}`
// }

// q()
