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
    weeklyRev: 0,
    weeklyCashRev: null,
    weeklyVenmoRev: null,
    weeklyOnlineFee: 0,
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
    weekCosts: [],
    totalHours: 10,
    workerHours: [],
    totalHours: 0,
    wage: 0,
    projections: {r:0, c:0}
  },
  mutations: mutations,

  actions: actions

});