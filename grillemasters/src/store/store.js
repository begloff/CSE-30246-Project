import { createStore } from 'vuex'
import router from '../router'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, collection, onSnapshot, query, orderBy, setDoc, getDocs, getDoc, } from "firebase/firestore"
import { ordersCollection, viewCollection, operationCollection, weeklyPrefix, db} from "../firebase"
import axios from 'axios';

export default createStore({
    
  state: {

    user: null,
    orders: [],
    nightTotal: null,
    venmo: null,
    cash: null,
    days: [],
    weeks: null, //SQL
    sWeek: null, //SQL
    weeklyRev: null,
    weeklyCashRev: null,
    weeklyVenmoRev: null,
    weeklyOnlineFee: null,
    nightOnlineFee: null,
    selectedWeek: weeklyPrefix,
    storeRuns: [],
    totalCost: null,
    weeksOfOperation: [],
    schedule: [],
    employees: [],
    hours: [],
    workingEmployees: [],
    totalHours: null,
    employeeWages: [],
    employeeRole: null,
    customer: null,
    customerBase: [],
    queue: [],

  },
  mutations: {
    SET_LOGGED_IN(state, user) {
      state.user = user;
    },
    CLEAR_USER(state) {
      state.user = null;
    },
    SET_ORDERS(state,payload){
      state.orders = payload.o;
      state.nightTotal = payload.t;
      state.nightOnlineFee = payload.of;
    },
    SET_CHART_DATA(state,payload){
      state.venmo = payload.v;
      state.cash = payload.c;
      state.days = payload.w;
      state.weeklyRev = payload.r;
      state.weeklyVenmoRev = payload.vr;
      state.weeklyCashRev = payload.cr;
      state.weeklyOnlineFee = payload.of;
    },
    SET_STORE_DATA( state, payload ){
      state.storeRuns = payload.s;
      state.totalCost = payload.c;
    },
    SET_WEEKS(state,payload){
      state.weeksOfOperation = payload;
    },
    SET_SCHEDULE(state,payload){
      state.schedule = payload;
    },
    ADD_STORE_RUN(state,payload){
      state.storeRuns.push(payload)
    },
    INCREMENT_COST(state,payload){
      state.totalCost += payload
    },
    DEL_STORE_RUN(state,payload){
      state.storeRuns = state.storeRuns.filter( x => x.id != payload)
    },
    CHANGE_SELECTED_WEEK(state,payload){
      state.selectedWeek = payload
    },
    SET_EMPLOYEES(state,payload){
      state.employees = payload
    },
    SET_HOURS(state,payload){
      state.hours = payload.h
      state.workingEmployees = payload.e
      state.totalHours = payload.t
      state.employeeWages = payload.p
    },
    SET_EMPLOYEE_ROLE(state,payload){
      state.employeeRole = payload.s
      state.customer = payload.n
    },
    SET_CUSTOMER_BASE(state,payload){
      state.customerBase = payload.sort();
    },
    SET_QUEUE(state,payload){
      state.queue = payload;
    },
    SET_WEEKS(state,payload){
      state.weeks = payload
    },
    SELECT_WEEK(state,payload){
      state.sWeek = payload
    }
  },

  actions: {

    async login({commit}, details){
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
        
        await this.dispatch('getRole')

        if(this.state.employeeRole){

          await this.dispatch('getFinancialData')
          await this.dispatch('getStoreData')
          await this.dispatch('getWeeksOfOperation')
          await this.dispatch('getSchedule')
          await this.dispatch('getHours')
          await this.dispatch('getCustomerBase')
          await this.dispatch('getWeeksSQL')
          this.dispatch('getOrders')
          commit('SET_LOGGED_IN', auth.currentUser)
          router.push('/finances')

        } else {
          commit('SET_LOGGED_IN', auth.currentUser)
          router.push('/customer')
        }
    },
    async register({commit}, details){
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
        
        commit('SET_LOGGED_IN', auth.currentUser)
        router.push('/customer')

        await setDoc(doc(db,"auth",this.state.user.email),{ //Auth collection is to verify employees and load email/name when someone makes an order
          name: name
        })
        await setDoc(doc(db,"customers",name),{ //Customers Collection is to load autofill within Employee Orders and to send emails out
          email: this.state.user.email
        })
    },

    async logout({commit}){
        await signOut(auth)

        commit('CLEAR_USER')

        router.push('/')
    },

    async fetchUser({ commit }, user) {

        auth.onAuthStateChanged( async user => {
            if (user == null ){
                commit('CLEAR_USER')
            } else {

              commit('SET_LOGGED_IN',user)

              await this.dispatch('getRole')
              if(this.state.employeeRole){

                await this.dispatch('getFinancialData')
                await this.dispatch('getStoreData')
                await this.dispatch('getWeeksOfOperation')
                await this.dispatch('getSchedule')
                await this.dispatch('getHours')
                await this.dispatch('getCustomerBase')
                await this.dispatch('getWeeksSQL')

                this.dispatch('getOrders')

                if (router.isReady() && router.currentRoute.value.path == '/login'){
                    router.push('/finances')
                }
              } else {
                if (router.isReady() && router.currentRoute.value.path == '/login'){
                  const queue = await getDoc(doc(db,"orders","daily-queue"))
                  commit("SET_QUEUE",queue.data().queue);
                  router.push('/customer')
              }
              }
            }
        })
     },

     async getRole({commit}){
        //Need to query by email and check for employee
        const person = await getDoc(doc(db,"auth",this.state.user.email));
        if(person.exists() && person.data().employee){
          commit("SET_EMPLOYEE_ROLE",{s: true, n: person.data().name})
        } else {
          commit("SET_EMPLOYEE_ROLE", {s: false, n: person.data().name})
        }
     },

     getOrders({ commit }){
      const q = query( ordersCollection, orderBy("date") )

      onSnapshot( q, (querySnapshot) => {
          const orders = [];
          let total = 0;
          let cashTotal = 0;
          let venmoTotal = 0;
          let onlineFee = 0;
          let queue = [];

          querySnapshot.forEach( (order) => {

              orders.push( {
                  id: order.id,
                  data: order.data()
              });

              total += order.data().price

              if( order.data().cash){
                cashTotal += order.data().price
              } else {
                if( order.data().online ){
                  venmoTotal += (order.data().price - 0.5)
                  onlineFee += 0.5
                  total -= 0.5
                } else {
                  venmoTotal += order.data().price
                }
              }
              
              if( !order.data().done ){
                queue.push(order.data().name);
              }

          })

          let d = new Date

          if(d.getHours() == 21 || d.getHours() == 22 || d.getHours() == 23 || d.getHours() == 0){ //Adjusts Minutes so totals reflect previous day rather than the next
            d.setMinutes(d.getMinutes() - 60);
          }
          
          let weekly = (d.getMonth()+ 1) + "-" + d.getDate() + "-totals"

          setDoc( doc( db, "finances",weeklyPrefix,"daily-totals",weekly ), {

            total: total,
            cashTotal: cashTotal,
            venmoTotal: venmoTotal,
            totalOrders: orders.length,
            onlineFee: onlineFee,
            date: new Date()

          });

          setDoc( doc(db,"orders","daily-queue"),{
            queue: queue,
          });

        commit('SET_ORDERS', {o: orders, t: total, of: onlineFee} )

      })

    },

    async getFinancialData( {commit} ){
      const q = query( viewCollection.view , orderBy("date") )
      const pastWeeks = query( operationCollection, orderBy("date") )

      const querySnapshot = await getDocs(q);

      const venmo = []
      const cash = []
      const week = []

      let rev = 0
      let venmoRev = 0
      let cashRev = 0
      let onlineFee = 0


      querySnapshot.forEach ((order) => {

        venmo.push(
            order.data().venmoTotal
        )

        cash.push(
            order.data().cashTotal
        )

        week.push(
            order.id.split("-totals",1)
        )
        
        rev += order.data().total
        venmoRev += order.data().venmoTotal
        cashRev += order.data().cashTotal
        if(order.data().onlineFee){
          onlineFee += order.data().onlineFee
        }

      })

      commit("SET_CHART_DATA",{v: venmo, c: cash, w: week, r: rev, vr: venmoRev, cr: cashRev, of: onlineFee})
    },

    async getStoreData({commit}){
      const storeRuns = query ( collection(db, "finances", this.state.selectedWeek, "store-runs"), orderBy("date") )

      const storeSnapshot = await getDocs( storeRuns )

      let totalCost = 0
      const store = []

      storeSnapshot.forEach((storeRun) =>{

        store.push({ 
          date: storeRun.data().date,
          cost: storeRun.data().cost,
          reason: storeRun.data().reason,
          id: storeRun.id
        })

        totalCost += storeRun.data().cost

      })

      commit( "SET_STORE_DATA",{s: store, c: totalCost})

    },

    async getWeeksOfOperation({commit}){

      const pastWeeks = query( operationCollection, orderBy("date") )
      const weeks = []

      const weeksSnapshot = await getDocs(pastWeeks);

      weeksSnapshot.forEach ((week) => {
        weeks.push(
            week.id
        )
      })

      commit("SET_WEEKS",weeks)

    },

    async getCustomerBase({commit}){

      const customerSnapshot = await getDocs(collection(db,"customers"));
      const customerBase = []

      customerSnapshot.forEach((customer) => {
        customerBase.push(
          customer.id
        )
      })

      commit("SET_CUSTOMER_BASE", customerBase)

    },

    async getSchedule( {commit} ){
      const scheduleQuery = query( collection(db,"finances",this.state.selectedWeek, "schedule"), orderBy("order") )
      const schedule = []

      const scheduleSnapshot = await getDocs(scheduleQuery)

      scheduleSnapshot.forEach( (day) => {
        schedule.push(
          day.data()
        )
      })

      commit("SET_SCHEDULE", schedule)

    },

    async getEmployees( {commit} ){
      const employees = []
      
      const employeeSnapshot = await getDocs( collection(db,"employees") )

      employeeSnapshot.forEach((employee) => {
        employees.push(
          employee.id
        )
      })

      commit("SET_EMPLOYEES",employees)

    },

    async getHours( {commit} ){
      const hours = []
      const employees = []
      let totalHours = 0
      let hourlyWage = 0

      const hoursSnapshot = await getDocs( collection(db,"finances",this.state.selectedWeek,"hours") )

      hoursSnapshot.forEach((employee) => {

        totalHours += employee.data().hours

        if( employees.includes(employee.data().employee) ){
          hours[employees.indexOf(employee.data().employee)] += employee.data().hours
        } else {

          hours.push(
            employee.data().hours
          )

          employees.push(
            employee.data().employee
          )
        }

      })

      hourlyWage = 0.9 * (this.state.weeklyRev - this.state.totalCost) / totalHours

      const hourlyPay = hours.map( function(element){
        return element * hourlyWage
      })

      commit("SET_HOURS", {h: hours,e: employees, t: totalHours, p: hourlyPay})


    },

    addStoreRun({commit}, storeRun){
      commit("ADD_STORE_RUN",storeRun)
    },

    addCost({commit}, cost){
      commit("INCREMENT_COST",cost)
    },

    deleteStoreRun({commit}, id){
      commit("DEL_STORE_RUN",id)
    },

    changeWeek({commit}, week){
      commit("CHANGE_SELECTED_WEEK",week)
    },

    async getWeeksSQL( {commit} ){
      const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: 'SELECT * from weeks order by start_date desc;'})
      const weeks = []

      for (let i = 0; i < response.data.length; i++){
        // Take list and build an object with each week id and the start date
        weeks.push([response.data[i][0],response.data[i][1] ])
      }

      commit("SET_WEEKS", weeks)

    },

    async selectWeek({commit}, week){
      commit("SELECT_WEEK",week)
    }

  }

});