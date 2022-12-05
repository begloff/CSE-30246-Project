// Need to get week_id from table
// CREATE TABLE nightly_stats(
//     week_id int(11),
//     day_of_week char(2),
//     date datetime,
//     total_revenue decimal(5,2),
//     cash_revenue decimal(5,2),
//     venmo_revenue decimal(5,2),
//     online_fee decimal(5,2),
//     num_orders int,
//     est_cost decimal(5,2),
//     inv_used decimal(5,2),
//     PRIMARY KEY(date)
//  );
 

//Stuff to extract --> First Get Week ID PArse for rest of stuff

const fs = require('fs')
let mysql = require('mysql')
let balSheet = require('./balSheet.json')


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

    for( var week in balSheet ){
        weekId = await getWeekId(week)
        weekId = weekId[0].week_id
        for(var day in balSheet[week]){
            //Parse total into new date
            monthNum = day.split('-')[0]
            dayNum = day.split('-')[1]
            d = new Date(2022, monthNum-1, dayNum, 0,0,0,0)
            dayOfWeek = d.getDay()

            if(dayOfWeek < 5){

                if(dayOfWeek == 0){
                    dayOfWeek = 'SU'
                }
                if(dayOfWeek == 1){
                    dayOfWeek = 'MO'
                }
                if(dayOfWeek == 2){
                    dayOfWeek = 'TU'
                }
                if(dayOfWeek == 3){
                    dayOfWeek = 'WE'
                }
                if(dayOfWeek == 4){
                    dayOfWeek = 'TH'
                }

                date = d.toISOString().slice(0, 19).replace('T', ' ');
                //Have Week ID, Day of Week, and Date
                //Need Rev, Online Fee, num of Orders
                var total_revenue = balSheet[week][day]['total']
                var cash_revenue = balSheet[week][day]['cashTotal']
                var venmo_revenue = balSheet[week][day]['venmoTotal']
                var online_fee = balSheet[week][day]['onlineFee']
                var num_orders = balSheet[week][day]['totalOrders']

                await insertNightlyStats(weekId, dayOfWeek, date, total_revenue, cash_revenue, venmo_revenue, online_fee, num_orders)

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

async function getWeekId(week){ 

    month = week.split('-')[2]
    day = week.split('-')[3]

    let sql = `select week_id from weeks where month(start_date) = ${month} and day(start_date) = ${day};`

    let x = await callDB(sql)
    return x

}

async function insertNightlyStats(weekId, dayOfWeek, date, total_revenue, cash_revenue, venmo_revenue, online_fee, num_orders){


    let sql = `insert into nightly_stats (week_id, day_of_week, date, total_revenue, cash_revenue, venmo_revenue, online_fee, num_orders) values (${weekId}, '${dayOfWeek}', '${date}', ${total_revenue}, ${cash_revenue}, ${venmo_revenue}, ${online_fee}, ${num_orders})`
    console.log(sql)
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
