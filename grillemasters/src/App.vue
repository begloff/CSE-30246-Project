<template>

  <div v-if="$store.state.user && $store.state.employeeRole">
    <AdminNavBar></AdminNavBar>
    <router-view/>
  </div>
  <div v-else-if="$store.state.user">
    <div class="banner">
      <CustomerNavBar/>
      <router-view/>
    </div>
  </div>
  <div v-else>
    <div class="banner">
      <public-nav-bar/>
      <router-view/>
    </div>
  </div>

</template>

<script>
import { onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import AdminNavBar from './components/AdminNavBar.vue'
import PublicNavBar from './components/PublicNavBar.vue'
import CustomerNavBar from './components/CustomerNavBar.vue'

import {setDoc, doc, collection} from "firebase/firestore"
import { operationCollection } from "./firebase"

export default{
  components: {
    AdminNavBar,
    PublicNavBar,
    CustomerNavBar
  },

  setup(){
    const store = useStore()

    onBeforeMount( async () => {
      await store.dispatch('getCustomerBase');
      await store.dispatch('fetchUser');
      await store.dispatch('getEmployees');
      store.dispatch('listener')
    })
  },

}


</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; 
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}


</style>
