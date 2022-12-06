import { createStore } from 'vuex'
import router from '../router'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, collection, onSnapshot, query, orderBy, setDoc, getDocs, getDoc, } from "firebase/firestore"
import { ordersCollection, viewCollection, operationCollection, weeklyPrefix, db} from "../firebase"
import axios from 'axios';


const login = async (context, details) => {
    const { email, password } = details

    try{

        await signInWithEmailAndPassword(auth, email, password)

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

        // await context.dispatch('getFinancialData')
        // await context.dispatch('getStoreData')
        // await context.dispatch('getWeeksOfOperation')
        // await context.dispatch('getSchedule')
        // await context.dispatch('getHours')
        await context.dispatch('getCustomerBase')
        await context.dispatch('getWeeksSQL')
        // context.dispatch('getOrders')
        context.commit('SET_LOGGED_IN', auth.currentUser)
        router.push('/finances')

    } else {
        context.commit('SET_LOGGED_IN', auth.currentUser)
        router.push('/customer')
    }
}
const register = async (context, details) => {
    const { name, email, password } = details

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
    
    context.commit('SET_LOGGED_IN', auth.currentUser)
    router.push('/customer')

    await setDoc(doc(db,"auth",context.state.user.email),{ //Auth collection is to verify employees and load email/name when someone makes an order
        name: name
    })
    await setDoc(doc(db,"customers",name),{ //Customers Collection is to load autofill within Employee Orders and to send emails out
        email: context.state.user.email
    })
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

            // context.dispatch('getOrders')

            if (router.isReady() && router.currentRoute.value.path == '/login'){
                router.push('/finances')
            }
            } else {
            if (router.isReady() && router.currentRoute.value.path == '/login'){
                const queue = await getDoc(doc(db,"orders","daily-queue"))
                router.push('/customer')
            }
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
      console.log(start_date, end_date)
      axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: `INSERT INTO weeks (start_date, end_date) values( "${start_date.toISOString().slice(0, 19).replace('T', ' ')}", "${end_date.toISOString().slice(0, 19).replace('T', ' ')}")`})
      response2 = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: 'SELECT * from weeks where "' + d + '" between start_date and end_date;'})
    }


    context.commit("SET_CURR_WEEK", Number(response2.data[0][0]))
    
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

const setProjections = async (context) => {
    const costProjectString = `select c.Tot/w.Tot from (select sum(cost) as Tot from costs) C, (select count(*) as Tot from weeks) w`
    const revProjectString  = `select r.Tot/w.Tot from (select sum(price) as Tot from orders) r, (select count(*) as Tot from weeks) w`
    const costPResponse     = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: costProjectString})
    const revPResponse      = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: revProjectString})
    const costProject       = costPResponse.data
    const revProject        = revPResponse.data
    context.commit("SET_PROJECTIONS", {r: Number(revProject[0]), c: Number(costProject[0])})
}


const updateFinancePage = async (context) => {

    var revObj = {}
    var costObj = {}
    const revString         = `SELECT day_of_week, total_revenue, cash_revenue, venmo_revenue, date, online_fee FROM nightly_stats WHERE week_id = ${context.state.sWeek}`
    const costString        = `select cost, date, reason from costs where week_id = ${context.state.sWeek}`
    const workersString   = `SELECT cust_name from hours H, customers C where H.week_id = ${context.state.sWeek} and employee_id = id group by H.employee_id`
    const workerHoursString   = `SELECT sum(hours_worked) from hours H, customers C where H.week_id = ${context.state.sWeek} and employee_id = id group by H.employee_id`
    

    const revResponse       = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: revString})
    const costResponse      = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: costString})
    const workersResponse = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: workersString})
    const workerHoursResponse = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: workerHoursString})
    
    
    const revData           = revResponse.data
    const costData          = costResponse.data
    const workerHoursData     = workerHoursResponse.data
    const workersData     = workersResponse.data

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
    
}

const getOrdersByDay = async (context) => {
    const sql = `SELECT * from orders where week_id = ${context.state.currWeek} and order_day = '${context.state.currDay}' order by order_datetime asc`
    const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: sql})
    let orders = response.data
    context.dispatch('commitOrders', { o: orders})
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
    console.log(payload);
    const sql = `delete from orders where id = ${id}`
    await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: sql})
    let orders = context.state.orders.filter( (item) => {
        return item[0] != id;
    });

    context.dispatch('commitOrders', { o: orders})
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
    setProjections,
}
