<template>
  <h3>Past Orders</h3>
  <hr>
  <div style="float: left; width: 40%; margin-left: 10px">
    <p>Select Week</p>
    <div v-if="this.$store.state.weeks" class="listContainer">
        <ul style="padding-left: 0px;">
            <li v-for="weeks in this.$store.state.weeks" @click="setWeek(weeks)" :class = "{selected: isSelectedWeek(weeks)}">Week of {{weeks[1].split(" ")[0]}}</li>
        </ul>
    </div>
  </div>
  <div style="float: left; width: 20%; margin-left: 5%">
    <p>Select Day</p>
    <div v-if="this.$store.state.sWeek" class="listContainer">
        <ul style="padding-left: 0px;">
            <li v-for="days in daysOfWeek" @click="setDay(days)" :class = "{selected: isSelectedDay(days)}">{{days}}</li>
        </ul>
    </div>
  </div>
  <div style="float: right; width: 30%; margin-right: 15px; margin-top: 60px;">
    <button @click="fetchOrders()" :disabled = "!(this.$store.state.sWeek && this.selectedDay)" >Get Orders</button>
  </div>
  <p>{{this.orders}}</p>
</template>

<script>
import axios from 'axios';

export default {
    data(){
        return{
            daysOfWeek: ['SU', 'MO', 'TU', 'WE', 'TH'],
            selectedDay: null,
            orders: null
        }
    },

    mounted(){
        //Front end --> only display the week, but have week id once selected
    },

    methods:{
        setWeek(week){
            this.$store.dispatch("selectWeek", week)
        },

        setDay(day){
            this.selectedDay = day
        },

        isSelectedWeek(week){
            if(this.$store.state.sWeek == week){
                return true
            }
        },

        isSelectedDay(day){
            if(this.selectedDay == day){
                return true
            }
        },

        async fetchOrders(){
            const sql = `SELECT * from orders where week_id = ${this.$store.state.sWeek[0]} and order_day = '${this.selectedDay}' order by order_datetime asc`
            const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: sql})

            this.orders = response.data

        }

    }

}
</script>

<style scoped>
    li{
        width: 100%; 
        cursor: pointer; 
        border-bottom: solid 1px lightgray;
        padding: 5px;
        background: rgb(232, 233, 233);
        color: black;
    }

    li:hover{
        background: rgb(182, 248, 182);
        font-weight: bold;    
    }

    .selected{
        background: rgb(182, 248, 182);
    }
</style>