import { createStore } from 'vuex'
import router from '../router'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, collection, onSnapshot, query, orderBy, setDoc, getDocs, getDoc, } from "firebase/firestore"
import { ordersCollection, viewCollection, operationCollection, weeklyPrefix, db} from "../firebase"
import axios from 'axios';

function onlyLettersAndNumbers(str) {
    return str.replace(/[^a-z0-9A-Z ]+/gi, " ");
}

const setCustId = async (context) => {
    await context.dispatch('getCustomerBase')
    context.commit('SET_CUST_ID', Number(context.state.customerBase.filter((cust) => cust[1] == context.state.user.email)[0][0]))
}

const login = async (context, details) => {
    const { email, password } = details

    try{

        await signInWithEmailAndPassword(auth, email, password)
        context.commit('SET_CUST_ID', Number(context.state.customerBase.filter((cust) => cust[1] == email)[0][0]))

    } catch(error) {

        switch(error.code){
            case "auth/invalid-email":
                alert("Invalid email");
                break;
            case "auth/user-not-found":
                alert("You are not an authorized user");
                break;
            case "auth/wrong-password":
                alert("Incorrect password or email");
                break;
        }

        return

    }
    
    await context.dispatch('getRole')

    if(context.state.employeeRole){

        context.commit('SET_LOGGED_IN', auth.currentUser)
        router.push('/finances')

    } else {
        context.commit('SET_LOGGED_IN', auth.currentUser)
        router.push('/customer')
    }
}
const register = async (context, details) => {
    const { name, email, password } = details

    var n

    n = name.replace(";","")
    n = name.replace("\"","")

    const na = n


    try{

        await createUserWithEmailAndPassword(auth, email, password)

    } catch(error) {

        switch(error.code){
            case "auth/email-already-in-use":
                alert("Email already in use!");
                break;
            case "auth/invalid-email":
                alert("Invalid email");
                break;
            case "auth/weak-password":
                alert("Weak password");
                break;
        }

        return

    }

    //Need to add user to db
    var sql = `Insert into customers (email, cust_name, employee) values ('${email}', '${na}', 0);`
    var adduser = axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: sql})
    
    context.commit('SET_LOGGED_IN', auth.currentUser)
    router.push('/customer')

    await setDoc(doc(db,"auth",context.state.user.email),{ //Auth collection is to verify employees and load email/name when someone makes an order
        name: name
    })
    await setDoc(doc(db,"customers",na),{ //Customers Collection is to load autofill within Employee Orders and to send emails out
        email: context.state.user.email
    })

    context.dispatch('setCustId')
}

const logout = async (context) => {
    await signOut(auth)

    context.commit('CLEAR_USER')

    router.push('/')
}

const fetchUser = async (context, user) => {

    auth.onAuthStateChanged( async user => {
        if (user == null ){
            context.commit('CLEAR_USER')
        } else {

            context.commit('SET_LOGGED_IN',user)

            await context.dispatch('getRole')
            if(context.state.employeeRole){

                await context.dispatch('getWeeksSQL')
                await context.dispatch('getCustomerBase')

                router.push('/finances')
            } else {
                router.push('/customer')
            }
        }
    })
}

const getRole = async (context) => {
//Need to query by email and check for employee
    const person = await getDoc(doc(db,"auth",context.state.user.email));
    if(person.exists() && person.data().employee){
        context.commit("SET_EMPLOYEE_ROLE",{s: true, n: person.data().name})
    } else {
        context.commit("SET_EMPLOYEE_ROLE", {s: false, n: person.data().name})
    }
}

const getEmployees = async (context) => {
    const employees = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: 'SELECT * from customers where employee = 1;'})
    context.commit("SET_EMPLOYEES", employees.data);
}

const logHours = async (context, payload) => {
    let id = payload.id;
    let hours = payload.hours;
    await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: `INSERT INTO hours values(${context.state.currWeek}, ${id}, ${hours});`})
}

const getWeeksSQL = async ( context ) => {
    const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: 'SELECT * from weeks order by start_date desc;'})
    const weeks = []

    for (let i = 0; i < response.data.length; i++){
      // Take list and build an object with each week id and the start date
      weeks.push([response.data[i][0],response.data[i][1] ])
    }

    context.commit("SET_WEEKS", weeks)

    //get week id from the database if it exists
    let date = new Date()
    let d = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}:${date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()}`
    let response2 = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: 'SELECT * from weeks where "' + d + '" between start_date and end_date;'})
    
    if(response2.data.length == 0){
      //insert new week if the week doesn't exist yet
      let start_date = new Date()
      let end_date = new Date()
      start_date.setDate(date.getDate() - date.getDay()) 
      end_date.setDate(start_date.getDate() + 6)
      start_date.setHours(-5); start_date.setMinutes(0); start_date.setSeconds(0);
      end_date.setHours(18); end_date.setMinutes(59); end_date.setSeconds(59);
      axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: `INSERT INTO weeks (start_date, end_date) values( "${start_date.toISOString().slice(0, 19).replace('T', ' ')}", "${end_date.toISOString().slice(0, 19).replace('T', ' ')}")`})
      response2 = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: 'SELECT * from weeks where "' + d + '" between start_date and end_date;'})
    }


    context.commit("SET_CURR_WEEK", Number(response2.data[0][0]))
    context.commit("SET_SEL_WEEK", Number(response2.data[0][0]))
    
    //find day of the week as a number and make it a day code
    let wkday = null;
    if(date.getHours() < 5){
      wkday = date.getDay() - 1;
    }
    else {
      wkday = date.getDay();
    }
    let daysOfWeek = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

    context.commit('SET_CURR_DAY', daysOfWeek[wkday])


}

const selectWeek = (context, week) => {
    context.commit("SELECT_WEEK",week)
}

const updateFinancePage = async (context) => {

    var revObj = {}
    var costObj = {}
    const revString         = `SELECT day_of_week, total_revenue, cash_revenue, venmo_revenue, date, online_fee FROM nightly_stats WHERE week_id = ${context.state.selWeek}`
    const costString        = `select cost, date, reason from costs where week_id = ${context.state.selWeek}`
    const workersString     = `SELECT cust_name from hours H, customers C where H.week_id = ${context.state.selWeek} and employee_id = id group by H.employee_id`
    const workerHoursString = `SELECT sum(hours_worked) from hours H, customers C where H.week_id = ${context.state.selWeek} and employee_id = id group by H.employee_id`
    const workingEString    = `select day_of_week, w1,w2,w3 from schedule where week_id = ${context.state.selWeek}`

    const revResponse           = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: revString})
    const costResponse          = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: costString})
    const workersResponse       = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: workersString})
    const workerHoursResponse   = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: workerHoursString})
    const workingEResponse      = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: workingEString})
    
    const revData           = revResponse.data
    const costData          = costResponse.data
    const workerHoursData   = workerHoursResponse.data
    const workersData       = workersResponse.data
    var workingEData      = workingEResponse.data

    var x = Array.apply(null, Array(5)).map(function () {})

    for( var i = 0; i < x.length; i++){
        x[i] = ['-','-','-']
    }


    for( var i = 0; i < workingEData.length; i++){
        var y = workingEData[i]
        if(y[0] == 'SU'){
            x[0] = y
        }
        if(y[0] == 'MO'){
            x[1] = y
        }
        if(y[0] == 'TU'){
            x[2] = y
        }
        if(y[0] == 'WE'){
            x[3] = y
        }
        if(y[0] == 'TH'){
            x[4] = y
        }
    }

    workingEData = x

    let weekLabels = []
    let venmo = []
    let cash = []

    var totalRev = 0
    var totalCashRev = 0
    var totalVenmoRev = 0
    var totalWeekFee = 0

    // prepare week revenue data for charts

    //Need a list for labels, list for cash and list for venmo
    for( var i=0; i<revData.length; i++) {
      revObj[revData[i][0]] = [revData[i][1], revData[i][2], revData[i][3]]
      totalWeekFee = totalWeekFee + Number(revData[i][5])
      weekLabels.push(revData[i][4].split(" ")[0])
      venmo.push(revData[i][3])
      cash.push(revData[i][2])
    }
    
    // prepare week cost data for table
    for( var i=0; i<costData.length; i++) {
      costObj[costData[i][1]] = [costData[i][0], costData[i][2]]
    }

    // find total weekly revenue
    for( var i = 0; i<revData.length; i++) {
      totalRev = totalRev + Number(revObj[revData[i][0]][0])
      totalCashRev = totalCashRev + Number(revObj[revData[i][0]][1])
      totalVenmoRev = totalVenmoRev + Number(revObj[revData[i][0]][2])
    }

    // find total cost
    var totalCost = 0
    for( var i= 0; i < costData.length; i++) {
      totalCost = totalCost + Number(costObj[costData[i][1]][0])
    }

    // find workers hours
    var totalHours = workerHoursData.reduce((sum, a) => sum+Number(a),0)

    var wage     = Number( ( (0.9 * (totalRev - totalCost)) / totalHours).toFixed(2) )


    var workerWages = workerHoursData.map( function(element){
        return element * wage
    })



    context.commit("SET_WEEK_DATA", revObj)
    context.commit("SET_WEEK_COSTS", costData)
    context.commit("SET_TOTAL_REV", totalRev)
    context.commit("SET_CASH_REV", totalCashRev)
    context.commit("SET_VENMO_REV", totalVenmoRev)
    context.commit("SET_COST", totalCost)
    context.commit("SET_WEEK_FEE", totalWeekFee)
    context.commit("SET_CHART_DATA", {l: weekLabels, v: venmo, c: cash})
    context.commit("SET_WORKER_HOURS", {wH: workerWages, w: workersData, tH:totalHours})
    context.commit("SET_WAGE", wage)
    context.commit("SET_WORKING_E", workingEData)
}

const getOrdersByDay = async (context) => {
    const sql = `SELECT * from orders where week_id = ${context.state.currWeek} and order_day = '${context.state.currDay}' order by order_datetime asc`
    const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: sql})
    let orders = response.data
    context.dispatch('commitOrders', { o: orders})
}

const getOrderById = async (context, payload) => {
    const id = payload.id
    const sql = `SELECT * from orders where id = ${id};`;
    const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: sql});
    let order = response.data
    context.commit('SET_EDIT_ORDER', order[0]);
} 

const commitOrders = async (context, o) => {
    let orders = o.o
    let nightTot = 0;
    let onlineTot = 0;
    for(let i = 0; i < orders.length; i++){
      nightTot += Number(orders[i][1])
      if(orders[i][9] == '1'){
        onlineTot += .5;
      }
    }
    context.commit("SET_ORDERS", {o: orders, t: nightTot, of: onlineTot})
}

const deleteOrder = async (context, payload) => {
    let id = payload.id;
    const sql = `delete from orders where id = ${id}`
    await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: sql})
    let orders = context.state.orders.filter( (item) => {
        return item[0] != id;
    });

    context.dispatch('commitOrders', { o: orders})
}

const updateOrder = async (context, payload) => {
    const id = Number(payload.order[0])
    const custId = payload.order[7]
    const items = payload.order[2]
    const comments = onlyLettersAndNumbers(payload.order[11])
    const cash = payload.order[8]
    const price = payload.order[1]
    const sql = `UPDATE orders set done = 0, cust_id = ${custId}, items = ${items}, comments = '${comments}', cash = ${cash}, price = ${price} where id = ${id}`
    await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: sql})
    context.dispatch('getOrdersByDay')
}

const completeOrder = async ( context, payload) => {
    let order = payload.order
    if (order[10] == "1"){
        order[10] = "0"
    }
    else {
        order[10] = "1"
    }
    const sql = `UPDATE orders set done = ${order[10]} where id = ${order[0]}`
    await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: sql})
}

const getCustomerBase = async (context) => {

    var arr = []
    var obj = {}

    const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: 'SELECT * from customers;'})
    const data = response.data

    for( var i = 0; i < data.length; i++){
      arr.push(data[i])
      obj[data[i][0]] = data[i]
    }
    context.commit("SET_CUSTOMERS",arr)
    context.commit("SET_CUSTOMERS_IND",obj)
}

const setProjections = async (context) => {
    const costProjectString = `select c.Tot/w.Tot from (select sum(cost) as Tot from costs) C, (select count(*) as Tot from weeks) w`
    const revProjectString  = `select r.Tot/w.Tot from (select sum(price) as Tot from orders) r, (select count(*) as Tot from weeks) w`
    const costPResponse     = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: costProjectString})
    const revPResponse      = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: revProjectString})
    const costProject       = costPResponse.data
    const revProject        = revPResponse.data
    context.commit("SET_PROJECTIONS", {r: Number(revProject[0]), c: Number(costProject[0])})
}
const onlineTrigger = async (context) => {
    axios.post('https://duncan-grille-api.azurewebsites.net/api/listener',{task: 'placeorder'})
    setTimeout(() => {
        axios.post('https://duncan-grille-api.azurewebsites.net/api/listener',{task: 'reset'})
    }, 31000);
}

const listener = async (context) => {
    const delay = async (ms = 30000) => new Promise(resolve => setTimeout(resolve, ms))
    let counter = 0;
    while(true){
        await delay();
        let response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/listener',{task: 'listen'});
        if(response.data[0] == 1){
            counter++;
            context.dispatch('getOrdersByDay');
        }
        else{
            counter = 0;
        }

        if(counter > 2){
            axios.post('https://duncan-grille-api.azurewebsites.net/api/listener',{task: 'reset'})
        }
    }

}

const updateDaily = async (context) => {
    let sql = `SELECT * FROM nightly_stats where day_of_week = "${context.state.currDay}" and week_id = ${context.state.currWeek}`
    //console.log(sql)
    const response    = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: sql})

    sql = `SELECT sum(price), count(*) FROM orders where order_day = "${context.state.currDay}" and week_id = ${context.state.currWeek} group by week_id`
    
    const tot  = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: sql})
    

    sql = `SELECT sum(price) FROM orders where order_day = "${context.state.currDay}" and week_id = ${context.state.currWeek} and cash = 1 group by week_id`
   
    const cash  = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: sql})
    

    sql = `SELECT count(*) FROM orders where order_day = "${context.state.currDay}" and week_id = ${context.state.currWeek} and online = 1 group by week_id`
   
    const online  = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: sql})
    
    await response; await tot; await cash; await online;
    

    let ordercount = tot.data[0][1]
    let totalrev = tot.data[0][0]
    let totcash = 0
    if(cash.data.length > 0){
        totcash = cash.data[0][0]
    }
    let totonline = 0
    if(online.data.length > 0) {
        totonline = online.data[0][0] 
    } 
    
    if(response.data.length == 0){
        let date = new Date()
        date.setHours(date.getHours() - 5);
        date = date.toISOString().slice(0, 19).replace('T', ' ')
        sql = `insert into nightly_stats (week_id, day_of_week, date,  total_revenue, cash_revenue, venmo_revenue, online_fee, num_orders) values(${context.state.currWeek},"${context.state.currDay}", "${date}", ${totalrev}, ${totcash}, ${totalrev - totcash}, ${totonline/2}, ${ordercount})`
        console.log(sql)
        await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: sql})
    }                               
    else {
        sql = `update nightly_stats set total_revenue = ${totalrev}, cash_revenue = ${totcash}, venmo_revenue = ${totalrev - totcash}, online_fee = ${totonline/2}, num_orders = ${ordercount} where week_id = ${context.state.currWeek} and day_of_week = "${context.state.currDay}"`
        console.log(sql)
        await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: sql})
    }
}

export default{
    login,
    register,
    logout,
    fetchUser,
    getRole,
    getWeeksSQL,
    selectWeek,
    getCustomerBase,
    updateFinancePage,
    getOrdersByDay,
    commitOrders,
    deleteOrder,
    completeOrder,
    getEmployees,
    logHours,
    getOrderById,
    updateOrder,
    setProjections,
    onlineTrigger,
    listener,
    setCustId,
    updateDaily
}

