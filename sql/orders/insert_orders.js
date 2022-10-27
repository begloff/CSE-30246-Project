const fs = require('fs')
let mysql = require('mysql')


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
    var jsonString = fs.readFileSync('./sorterOrter.json', 'utf8')

    jsonString = jsonString.replaceAll('[','{')
    jsonString = jsonString.replaceAll(']','}')
    jsonString = jsonString.replaceAll('{}','')

    var f = fs.writeFileSync('./jsOutput.json', jsonString)
    // console.log(jsonString)

    // for( var customer in data ){
    //     var email = customer
    //     var name = data[customer].name
    //     var employee = data[customer].employee

    //     let sql
        
    //     if(!employee){
    //         sql = `INSERT INTO customers (email, cust_name, employee) values (\"${email}\", \"${name}\", 0);`
    //     } else {
    //         sql = `INSERT INTO customers (email, cust_name, employee) values (\"${email}\", \"${name}\", 1);`
    //     }

    //     var x = new Promise((res, rej) => conn.query(sql, function (err, result) {
    //         if (err) throw err;
    //         res(result)
    //     }));

    //     await x
        
    // }
}

readOrders()

