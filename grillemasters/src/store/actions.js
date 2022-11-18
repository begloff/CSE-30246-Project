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

}

const selectWeek = (context, week) => {
    context.commit("SELECT_WEEK",week)
}

const getCustomerBase = async (context) => {

    var obj = {}

    const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: 'SELECT * from customers;'})
    const data = response.data

    for( var i = 0; i < data.length; i++){
    obj[data[i][0]] = data[i]
    }

    context.commit("SET_CUSTOMERS",obj)
}

export default{
    login,
    register,
    logout,
    fetchUser,
    getRole,
    getWeeksSQL,
    selectWeek,
    getCustomerBase
}

