const fs = require('fs')
let mysql = require('mysql')
const schedule = require('./schedule.json')

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

        for(var day in schedule[item]){

            if(schedule[item][day].order == 0){
                d = 'SU'
            }
            if(schedule[item][day].order == 1){
                d = 'MO'
            }
            if(schedule[item][day].order == 2){
                d = 'TU'
            }
            if(schedule[item][day].order == 3){
                d = 'WE'
            }
            if(schedule[item][day].order == 4){
                d = 'TH'
            }

            iter = 0
            var shifts = []

            for( var shift in schedule[item][day].schedule ){
                
                shifts[iter] = schedule[item][day].schedule[shift]

                iter += 1

            }

            sql = `INSERT INTO schedule (week_id, day_of_week, w1, w2, w3) values (${weekId}, \'${d}\', \'${shifts[0]}\', \'${shifts[1]}\', \'${shifts[2]}\')`
            
            await callDB(sql)

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