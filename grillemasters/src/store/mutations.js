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

const SET_WEEKS = (state,payload) => {
    state.weeks = payload
}

const SELECT_WEEK = (state,payload) => {
    state.sWeek = payload
}

const SET_CUSTOMERS = (state,payload) => {
    state.customerBase = payload
}

export default{
    SET_LOGGED_IN,
    CLEAR_USER,
    SET_EMPLOYEE_ROLE,
    SET_WEEKS,
    SELECT_WEEK,
    SET_CUSTOMERS
}