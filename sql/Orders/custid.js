let mysql = require('mysql')
var fs = require('fs')
const orders = require('./ordersql.json')

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

    for(let i = 0; i < orders.length; i++){
        s = orders[i]
        x = await getCustomerIdByEmail(s.email)
        console.log(x)
        if(x.length > 0){
            s.id = x[0].id
        }
        else{
            s.id = null
        }
        console.log(orders[i].id)
    }

    const userData = JSON.stringify(orders);

    fs.writeFile("output.json", userData, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("output.json has been saved with the user data");
    }})

    await conn.end(function (err) {
        if (err) {
            return console.error('error: ' + err.message)
        }

        console.log('Connection closed');
    })

}

async function getCustomerIdByEmail(email) {
    let sql = `SELECT id FROM customers WHERE email like \"${email}%\"`
    let x = await callDB(sql)
    return x
}

async function callDB(sql) {
    var x = new Promise((res, rej) => conn.query(sql, function (err, result) {
        if (err) throw err;
        res(result)
    }));
    await x
    return x
}

q()