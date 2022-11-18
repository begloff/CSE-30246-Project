import { createStore } from 'vuex'
import actions from './actions';
import mutations from './mutations';

export default createStore({
    
  state: {

    user: null, //User
    weeks: null, //SQL
    sWeek: null, //SQL
    customerBase: {}, //SQL

  },
  mutations: mutations,

  actions: actions

});