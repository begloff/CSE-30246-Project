const fs = require('fs')
let mysql = require('mysql')
const schedule = require('./costs.json')

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


    for( var item in schedule){
        month = item.split('-')[2]
        day = item.split('-')[3]

        weekId = await getWeekId(month,day)
        weekId = weekId[0].week_id

        //Query Weeks table for month and day to establish weekid

        for(var cost in schedule[item]){

            // console.log(schedule[item][cost]['date'])

            if(schedule[item][cost]['reason'] != null){
                var reason = schedule[item][cost]['reason']
            } else {
                var reason = null
            }

            if(schedule[item][cost]['cost'] != null){
                var c = schedule[item][cost]['cost']
            } else {
                var c = null
            }

            if(schedule[item][cost]['date'] != null){
                var d = schedule[item][cost]['date']
            } else {
                var d = null
            }

            console.log(reason, c, d)

            if(d){

                d = d.split('-')

                da = new Date(d[0],d[1]-1,d[2],0,0,0,0).toISOString().slice(0, 19).replace('T', ' ')
                //Insert

                console.log(da)

                if(!reason){
                    sql = `INSERT INTO costs (week_id, cost, date) values (${weekId}, ${c}, '${da}')`
                    await callDB(sql)

                } else {
                    sql = `INSERT INTO costs (week_id, cost, date, reason) values (${weekId}, ${c}, '${da}', '${reason}')`
                    await callDB(sql)
                }
            }
        }


    }


    // const userData = JSON.stringify(orders);

    // fs.writeFile("output.json", userData, function (err) {
    // if (err) {
    //     console.error(err);
    // } else {
    //     console.log("output.json has been saved with the user data");
    // }})

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

async function callDB(sql) {
    var x = new Promise((res, rej) => conn.query(sql, function (err, result) {
        if (err) throw err;
        res(result)
    }));
    await x
    return x
}

q()