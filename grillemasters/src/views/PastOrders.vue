<template>
  <h3>Past Orders</h3>
  <hr>
  <div style="float: left; width: 30%; margin-left: 20px">
    <p>Select Week</p>
    <div v-if="this.$store.state.weeks" class="listContainer">
        <ul style="padding-left: 0px;">
            <li v-for="weeks in this.$store.state.weeks" @click="setWeek(weeks)" :class = "{selected: isSelectedWeek(weeks)}">Week of {{weeks[1].split(" ")[0]}}</li>
        </ul>
    </div>
  </div>
  <div style="float: left; width: 20%; margin-left: 5%">
    <p>Select Day</p>
    <div class="listContainer">
        <ul style="padding-left: 0px;">
            <li v-for="days in daysOfWeek" @click="setDay(days)" :class = "{selected: isSelectedDay(days)}">{{days}}</li>
        </ul>
    </div>
  </div>
  <div style="float: left; width: 37%; margin-left: 5%">
    <p>Select Name</p>
    <div class="listContainer">
        <input type="text" class="nameInput" id="nameInput" placeholder="Name (First and Last)" v-model="name" autocomplete="off" @input="filterCustomers" @focus="modal=true">
        <div v-if="filteredCustomers && modal" class="listContainer">
            <ul style="padding-left: 0px;">
                <li class="listItem" v-for="customer in filteredCustomers" @click="setCustomer(customer)" :class = "{selected: isSelectedCustomer(customer)}">{{customer}}</li>
            </ul>
        </div>
    </div>
  </div>
  <div style="float: right; width: 100%; margin-right: 15px; margin-top: 20px;">
    <p v-if="(this.selectedWeek || this.selectedDay || this.name)">Search For: <p v-if="selectedWeek">Week of {{selectedWeek[1].split(" ")[0]}}:</p> <p v-if="selectedDay">Day: {{selectedDay}}</p> <p v-if="name">Customer: {{name}}</p></p>
    <button style="width: 80%;" @click="fetchOrders()" :disabled = "!(this.selectedWeek || this.selectedDay || this.name)" >Get Orders</button>
</div>

<table class="table" v-if="this.orders">
    <thead>
        <tr>
        <th scope="col">#</th>
        <th scope="col">$</th>
        <th scope="col">Type</th>
        <th scope="col">Date</th>
        <th scope="col">Time</th>
        <th scope="col">Name</th>
        <th scope="col">Order</th>
        <th scope="col">Comments</th>
        <th scope="col">Price</th>
        </tr>
    </thead>
    <tbody>
    <tr v-for="(order,index) in this.orders" :class="
     { online: order[9] == '1' && order[10] == '0', completed : order[10] == '1' }">
        <th scope="row"> {{ index + 1 }}</th>
        <td>
            <fa icon="money-bill" v-if="order[8] == '1'" style="color:green;"/>
            <fa icon="v" style="color:blue;" v-else/>
        </td>
        <td>
            <fa icon="computer" v-if="order[9] == '1'" style="color: black;"/>
            <fa icon="people-arrows" v-else />
        </td>
        <td>{{order[5].split(" ")[0]}}</td>
        <td>{{ order[3] }}</td>
        <td v-if="order[7] == 'None'">Customer</td>
        <td v-else>{{ this.$store.state.customerBaseInd[order[7]][2] }}</td>
        <td>{{ decodeOrder(order[2]) }}</td>
        <td style="word-wrap: break-word; max-width: 400px;">{{ order[11]}}</td>
        <td v-if="order[9] == '0'">${{Number(order[1]).toFixed(2)}}</td>
        <td v-else>${{Number(order[1] - .5).toFixed(2)}}</td>
        
        <td>
            <fa icon="check-to-slot" @click="toggleDone(order)" style="color:green; cursor:pointer;"/>
        </td>
        <td>
            <fa icon="trash-can" @click="toggleDel(order)" style="color:red; cursor:pointer;"/>
        </td>

        </tr>

    </tbody>
</table>

<h2 v-if="this.price" style="margin-top: 20px;">Search Price Total: ${{Number(price).toFixed(2)}}</h2>

</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
            daysOfWeek: ['SU', 'MO', 'TU', 'WE', 'TH'],
            selectedDay: null,
            selectedWeek: null,
            selectedCustomer: null,
            orders: null,
            name: null,
            customers: this.$store.state.customerBase,
            filteredCustomers: null,
            modal: false,
            custId: null,
            price: null
        }
    },
    mounted(){
        //Front end --> only display the week, but have week id once selected
        this.filterCustomers()
    },
    methods:{
        filterCustomers(){
            let name = this.name;
            if(name){
                this.filteredCustomers =  this.customers.map(cust => cust[2]).filter(cust => cust.toLowerCase().includes(name.toLowerCase())) 
            }
            else{
                this.filteredCustomers =  this.customers.map(cust => cust[2]) 
            }
        },
        setCustomer(customer){
            if(this.name != customer){
                this.name = customer
            } else {
                this.name = null
            }
            this.modal = false
        },
        setDay(day){
            if(this.selectedDay != day){
                this.selectedDay = day
            } else {
                this.selectedDay = null;
            }
        },
        setWeek(week){
            if( this.selectedWeek != week){
                this.selectedWeek = week
            } else {
                this.selectedWeek = null
            }
        },
        isSelectedWeek(week){
            if(this.selectedWeek == week){
                return true
            }
        },
        isSelectedDay(day){
            if(this.selectedDay == day){
                return true
            }
        },
        isSelectedCustomer(customer){
            if(this.name == customer){
                return true
            }
        },
        async fetchOrders(){
            var q = []
            var qstring = ""

            const person = this.customers.filter((cust) => {
                return cust[2] == this.name
            })

            if(person.length != 0){
                this.custId = Number(person[0][0]);
            }
            else{
                this.custId = 155;
            }

            if(this.selectedDay){
                q.push(`order_day = '${this.selectedDay}' `)
            }
            if(this.selectedWeek){
                q.push(`week_id = ${this.selectedWeek[0]} `)
            }
            if(this.name){
                q.push(`cust_id = ${this.custId} `)
            }

            //Build query string
            for( var i = 0; i < q.length; i++){
                if( i == q.length - 1){
                    qstring += q[i]
                } else {
                    qstring += q[i] + 'and '
                }
            }

            const sql = `SELECT * from orders where ${qstring} order by order_datetime asc;`
            const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: sql})
            this.orders = response.data

            this.price = this.orders.map( (index) => {
                return Number(index[1]).toFixed(2)
            })

            this.price = this.price.reduce((total, num) => {
                return Number(total) + Number(num)
            })
        },
        decodeOrder(order){
          let primes = {
                2:'pizza'                 ,
                3:'Dubbuff'               ,
                5:'Singlebuff'            ,
                7:'CBR'                   ,
                11:'Single CBR'                 ,
                13:'Cheese Nachos'               ,
                17:'Chicken Nachos'              ,
                19:'Soda/Gatorade'        ,
                23:'Ice Cream'            
          }
          let orderlist = []
          let pizza = 0
          while(order % 2 == 0){
            order /= 2;
            pizza++;
          }
          if(pizza){
            orderlist.push(`${pizza} Pizza Rolls`)
          }
          for(const key in primes){
            if(key == 2){
              continue;
            }
            while(order % key == 0){
              orderlist.push(primes[key])
              order /= key;
            }
          } 
          return orderlist.join(', ');
        
        },
        async toggleDel(order){  
            const sql = `delete from orders where id = ${order[0]}`
            await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: sql})
            this.orders = this.orders.filter( (item) => {
                return item[0] != order[0];
            });
        },
        async toggleDone(order) {
            if (order[10] == "1"){
                order[10] = "0"
            }
            else {
                order[10] = "1"
            }
            const sql = `UPDATE orders set done = ${order[10]} where id = ${order[0]}`
            await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: sql})
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