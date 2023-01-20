const SET_LOGGED_IN = (state, user) => {
    state.user = user;
}

const CLEAR_USER = (state) => {
    state.user = null;
}

const SET_EMPLOYEE_ROLE = (state,payload) => {
    state.employeeRole = payload.s
    state.customer = payload.n
}

const SET_EMPLOYEES = (state, payload) => {
    state.employees = payload;
}

const SET_WEEKS = (state,payload) => {
    state.weeks = payload
}

const SELECT_WEEK = (state,payload) => {
    state.selWeek = payload
}

const SET_CUSTOMERS = (state,payload) => {
    state.customerBase = payload
}

const SET_CUSTOMERS_IND = (state,payload) => {
    state.customerBaseInd = payload
}

const SET_CUST_ID = (state, payload) => {
    state.custId = payload;
}

const SET_WEEK_DATA = (state,payload) => {
    state.weekData = payload
}

const SET_VENMO_REV = (state,payload) => {
    state.weeklyVenmoRev = payload
}

const SET_CASH_REV = (state, payload) => {
    state.weeklyCashRev = payload
}

const SET_TOTAL_REV = (state, payload) => {
    state.weeklyRev = payload
}

const SET_COST = (state, payload) => {
    state.totalCost = payload
}

const SET_ORDERS = (state,payload) => {
    state.orders = payload.o;
    state.nightTotal = payload.t;
    state.nightOnlineFee = payload.of;
}

const SET_EDIT_ORDER = (state, payload) => {
    state.editOrder = payload
}

const SET_CURR_WEEK = (state, payload) => {
    state.currWeek = payload
}

const SET_SEL_WEEK = (state, payload) => {
    state.selWeek = payload
}

const SET_CURR_DAY = (state, payload) => {
    state.currDay = payload
}

const SET_CHART_DATA = (state, payload) =>{
    state.weekLabels = payload.l;
    state.weekVenmo = payload.v;
    state.weekCash = payload.c;
}

const SET_WEEK_COSTS = (state, payload) =>{
    state.weekCosts = payload;
}

const SET_WEEK_FEE = (state, payload) => {
    state.weeklyOnlineFee = payload;
}

const SET_WORKER_HOURS = (state, payload) => {
    state.workerHours = payload.wH;
    state.workingEmployees = payload.w;
    state.totalHours  = payload.tH;
}

const SET_WAGE = (state,payload) => {
    state.wage = payload;
}

const SET_PROJECTIONS = (state, payload) => {
    state.projections = {r: payload.r, c: payload.c}
}

const SET_WORKING_E = (state, payload) => {
    state.weeklyEmployees = payload;
}

const SET_HOUR_LABELS = (state, payload) => {
    state.hourLabels = payload;
}



export default{
    SET_LOGGED_IN,
    CLEAR_USER,
    SET_EMPLOYEE_ROLE,
    SET_WEEKS,
    SELECT_WEEK,
    SET_CUSTOMERS,
    SET_WEEK_DATA,
    SET_VENMO_REV,
    SET_CASH_REV,
    SET_TOTAL_REV,
    SET_COST,
    SET_ORDERS,
    SET_CURR_WEEK,
    SET_SEL_WEEK,
    SET_CURR_DAY,
    SET_CUSTOMERS_IND,
    SET_CHART_DATA,
    SET_EMPLOYEES,
    SET_EDIT_ORDER,
    SET_WEEK_COSTS,
    SET_WEEK_FEE,
    SET_WORKER_HOURS,
    SET_WAGE,
    SET_PROJECTIONS,
    SET_WORKING_E,
    SET_CUST_ID,
    SET_HOUR_LABELS
}