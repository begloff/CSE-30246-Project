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
    weeks: null, //SQL
    sWeek: null, //SQL
    customerBase: {}, //SQL

  },
  mutations: {
    SET_LOGGED_IN(state, user) {
      state.user = user;
    },
    CLEAR_USER(state) {
      state.user = null;
    },
    SET_EMPLOYEE_ROLE(state,payload){
      state.employeeRole = payload.s
      state.customer = payload.n
    },
    SET_WEEKS(state,payload){
      state.weeks = payload
    },
    SELECT_WEEK(state,payload){
      state.sWeek = payload
    },
    SET_CUSTOMERS(state,payload){
      state.customerBase = payload
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

                await this.dispatch('getWeeksSQL')
                await this.dispatch('getCustomerBase')

                this.dispatch('getOrders')

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
    },

    async getCustomerBase({commit}){

      var obj = {}

      const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: 'SELECT * from customers;'})
      const data = response.data

      for( var i = 0; i < data.length; i++){
        obj[data[i][0]] = data[i]
      }

      commit("SET_CUSTOMERS",obj)
    }

  }

});