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
  <div v-if="this.orders">
    
    <table class="table">
    <thead>
        <tr>
        <th scope="col">#</th>
        <th scope="col">$</th>
        <th scope="col">Type</th>
        <th scope="col">Time</th>
        <th scope="col">Name</th>
        <th scope="col">Order</th>
        <th scope="col">Comments</th>
        <th scope="col">Price</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(order,index) in orders">
        <th scope="row"> {{ index + 1 }}</th>
        <td>
            <fa icon="money-bill" v-if="order[8] == '1'" style="color:green;"/>
            <fa icon="v" style="color:blue;" v-else/>
        </td>
        <td>
            <fa icon="computer" v-if="order[9] == '1'" style="color: black;"/>
            <fa icon="people-arrows" v-else />
        </td>
        <td>{{ order[3] }}</td>
        <td v-if="order[7] == 'None'">Customer</td>
        <td v-else>{{ this.$store.state.customerBase[order[7]][2] }}</td>
        <td>{{ order[2] }}</td>
        <td style="word-wrap: break-word; max-width: 400px;">{{ order[11]}}</td>
        <td v-if="order[9] == '0'">${{Number(order[1]).toFixed(2)}}</td>
        <td v-else>${{Number(order[1] - .5).toFixed(2)}}</td>
        

        </tr>

    </tbody>
    </table>

  </div>
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

            console.log(this.orders)

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