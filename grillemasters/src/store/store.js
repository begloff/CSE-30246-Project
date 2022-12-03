import { createStore } from 'vuex'
import actions from './actions';
import mutations from './mutations';

export default createStore({
    
  state: {

    user: null, //User
    weeks: null, //SQL
    sWeek: null, //SQL
    customerBase: [], //SQL
    customerBaseInd: {},
    employees: [],
    weeklyRev: 0,
    weeklyCashRev: null,
    weeklyVenmoRev: null,
    weekData: {},
    totalCost: [],
    currDay: null,
    currWeek: null,
    orders: [],
    nightTotal: null,
    nightOnlineFee: null,
    weekLabels: [],
    weekVenmo: [],
    weekCash: [],


  },
  mutations: mutations,

  actions: actions

});