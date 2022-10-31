const fs = require('fs')
let mysql = require('mysql')
const hours = require('./hours.json')

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


    for(var week in hours){
        month = week.split('-')[2]
        day = week.split('-')[3]

        weekId = await getWeekId(month,day)
        weekId = weekId[0].week_id
        for( var h in hours[week] ){
            hoursWorked = hours[week][h].hours
            employee = hours[week][h].employee

            if(employee == 'Cameron Rodzik'){
                employee = 'Cameron  Rodzik'
            }

            if(employee != 'Will Truluck'){

                employeeId = await getEmployeeId(employee)
                employeeId = employeeId[0].id

                console.log(hoursWorked, employeeId, weekId)

                sql = `INSERT INTO hours (week_id, employee_id, hours_worked) values (${weekId}, ${employeeId}, ${hoursWorked})`

                await callDB(sql)
            }
        }
    }

    await conn.end(function (err) {
        if (err) {
            return console.error('error: ' + err.message)
        }

        console.log('Connection closed');
    })

}

async function getWeekId(month, day) {
    let sql = `select week_id from weeks where month(start_date) = ${month} and day(start_date) = ${day};`
    let x = await callDB(sql)
    return x
}
async function getEmployeeId(name) {
    let sql = `select id from customers where cust_name = \'${name}\' and employee = 1;`
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