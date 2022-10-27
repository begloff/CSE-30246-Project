const fs = require('fs')
let mysql = require('mysql')


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

    await readWeeks()

    await conn.end(function (err) {
        if (err) {
            return console.error('error: ' + err.message)
        }

        console.log('Connection closed');
    })

}
async function readWeeks(){

    //Put Sunday and Thursday in as date times --> Just need to extract week of ...

    var jsonString = fs.readFileSync('./finances.json', 'utf8')
    data = JSON.parse(jsonString).data

    console.log(data)

    for( var week in data ){
        month = week.split('-')[2]
        day = week.split('-')[3]

        start = new Date(2022,month-1,day,-4,0,0,0).toISOString().slice(0, 19).replace('T', ' ');
        end = new Date(2022,month-1,day,23-4,59,0,0)
        end.setDate(end.getDate() + 6)
        end = end.toISOString().slice(0, 19).replace('T', ' ');

        let sql
        sql = `INSERT INTO weeks (start_date, end_date) values (\'${start}\', \'${end}\');`

        console.log(sql)

        var x = new Promise((res, rej) => conn.query(sql, function (err, result) {
            if (err) throw err;
            res(result)
        }));

        await x


    }

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

        // var x = new Promise((res, rej) => conn.query(sql, function (err, result) {
        //     if (err) throw err;
        //     res(result)
        // }));

        // await x
        
    // }
}

q()
