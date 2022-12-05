<template>
    <div class="new-backdrop" @click.self="$router.push({name: 'past-orders'})">
        <div class="new-modal" @click.self="modal=false, toggleQuantity=false">

            <div style="display: inline">
            <h1 style="display: inline">Update Order</h1>
            <button  @click="$router.push({name: 'orders'})" type="button" style="display: inline; float: right " class="btn-close pull-right" aria-label="Close"></button>
            </div>

            <hr>
            <input type="text" class="nameInput" id="nameInput" placeholder="Name (First and Last)" v-model="name" autocomplete="off" @input="filterCustomers" @focus="modal=true">
            <div v-if="filteredCustomers && modal" class="listContainer">
                <ul style="padding-left: 0px;">
                    <li class="listItem" v-for="customer in filteredCustomers" @click="setCustomer(customer)">{{customer}}</li>
                </ul>
            </div>
            <hr>

            <button style="background: green; margin-right: 50px; " @click="addItem('DubBuff')">DubBuff</button>
            <button style="background: red; margin-right: 50px;" @click="addItem('SingleBuff')" >SingleBuff</button>
            <button style="margin-right: 50px;" @click="addItem('CBR')" >CBR</button>
            <button style="background: black; margin-right: 50px;" @click="addItem('Single CBR')">Single CBR</button>
            <button style="background: #918e2d; margin-right: 50px;" @click="addItem('Chicken Nachos')">Chicken Nachos</button>
            <button style="background: #2d7691; margin-right: 50px;" @click="addItem('Cheese Nachos')">Cheese Nachos</button>
            <button style="background: #9b5f96; margin-right: 50px;" @click="toggleQuantity = !toggleQuantity">Pizza Rolls</button>
            <button style="background: #571e59; margin-right: 50px;" @click="addItem('Soda/Gatorade')">Soda/Gatorade</button>
            <button style="background: #1e5931; margin-right: 50px;" @click="addItem('Ice Cream Sandwich')">Ice Cream Sandwich</button>

            <hr v-if="toggleQuantity">

            <input type="number" v-if="toggleQuantity" placeholder="Quantity:" @input="addPizzaRolls" v-model="pizzaRolls" @focus="toggleQuantity=true">

            <hr>
            <p style="">Items (click to delete)</p>
            

            <div v-for="item in items" :key="item" class="pill">
                <span @click="delItem(item)" >{{item}}</span>
            </div>
            <hr>

            <input type="text" placeholder="Comments (optional)" v-model="comments">

            <hr>
            <h2>Ticket Total: ${{Number(price).toFixed(2)}}</h2>

            <hr>

            <label for="cash">Cash Order: </label>
            <input type="checkbox" id="cash" v-model="cash" style="height: 20px;">
            <label for="cash">Hall Staff Order: </label>
            <input type="checkbox" id="cash" v-model="hallStaffOrder" @click="hallStaffCheckBox" style="height: 20px;">
            <hr>

            <button :disabled="(!price && !hallStaffOrder)|| !name" @click="updateOrder">Update Order</button>

        </div>
    </div>
</template>

<script>

import { ordersCollection, db } from '../../firebase'
import { getDoc, doc, setDoc } from 'firebase/firestore'


export default {

    async mounted(){
        const orderId = this.$route.params.id
        this.orderId = orderId
        await this.getOrder()
        this.filterCustomers();
    },

    methods: {

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
            this.name = customer
            this.modal = false
        },

        closeModal(){
            this.$router.push({name:'orders'})
        },

        addItem( item ){
            this.items.push(item)

            if(!this.hallStaffOrder){
                switch(item){
                    case 'DubBuff':
                        this.price += 5
                        break
                    case 'SingleBuff':
                        this.price += 3
                        break
                    case 'CBR':
                        this.price += 5
                        break
                    case 'Cheese Nachos':
                        this.price += 2.50
                        break
                    case 'Chicken Nachos':
                        this.price += 3.50
                        break
                    case 'Single CBR':
                        this.price += 3
                        break
                    case 'Soda/Gatorade':
                        this.price += 1.50
                        break                    
                    case 'Ice Cream Sandwich':
                        this.price += 1.50
                        break

                }
            }
        },

        delItem( item ){
            
            if(!this.hallStaffOrder){
                switch(item){
                    case 'DubBuff':
                        this.price -= 5
                        break
                    case 'SingleBuff':
                        this.price -= 3
                        break
                    case 'CBR':
                        this.price -= 5
                        break
                    case 'Cheese Nachos':
                        this.price -= 2.50
                        break
                    case 'Chicken Nachos':
                        this.price -= 3.50
                        break
                    case 'Single CBR':
                        this.price -= 3
                        break
                    case 'Soda/Gatorade':
                        this.price -= 1.50
                        break                    
                    case 'Ice Cream Sandwich':
                        this.price -= 1.50
                        break
                    default: //Pizza Rolls
                        this.price -= (0.25 * this.pizzaRolls)
                        this.pizzaRolls = 0
                        this.toggleQuantity = 0
                        break
                }
            } else {
                //Still Need to check if pizza rolls were deleted
                let check = item.includes("Pizza Rolls")
                if(check){
                    this.pizzaRolls = 0
                    this.toggleQuantity = 0
                }
            }

            const index = this.items.indexOf(item)
            
            this.items.splice(index,1)
        },

        addPizzaRolls(){

            let match = this.items.find(value => /^([0-9]*) (Pizza Rolls)$/.test(value))

            if(match){ //If there are already Pizza Rolls in the order --> Replace
                const index = this.items.indexOf(match)

                const num = Number(this.items[index].slice(0,-11))
                if(!this.hallStaffOrder){
                    this.price -= (0.25 * num)
                }

                this.items.splice(index,1)
            }
            if(this.pizzaRolls > 0){
                this.items.push(`${this.pizzaRolls} Pizza Rolls`)
                if(!this.hallStaffOrder){
                    this.price += (0.25 * this.pizzaRolls)
                }
            }

        },

        async updateOrder(){
            let cust = this.$store.state.customerBase.filter(cust => cust[2].toLowerCase() == this.name.toLowerCase())
            this.selectedOrder[7] = cust[0][0];
            this.selectedOrder[2] = this.encodeOrders(this.items);
            this.selectedOrder[11] = this.comments;
            this.selectedOrder[8] = this.cash ? 1 : 0;
            this.selectedOrder[1] = this.price;

            this.$store.dispatch('updateOrder', {order: this.selectedOrder})
            
            this.$router.push({name: 'orders'})
        },

        async getOrder(){

            await this.$store.dispatch('getOrderById', {id: this.orderId})

            const order = this.$store.state.editOrder;
            this.selectedOrder = order

            this.name = this.$store.state.customerBaseInd[Number(order[7])][2]
            this.items = this.decodeOrder(Number(order[2]))
            this.comments = order[11]
            this.cash = Number(order[8]) == 1 ? true : false
            this.price = Number(order[1])
            
            if(!this.price){
                this.hallStaffOrder = true;
            }
        },

        decodeOrder(order){
          let primes = {
                2:'pizza'                 ,
                3:'DubBuff'               ,
                5:'SingleBuff'            ,
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
          return orderlist;
        
        },

        encodeOrders(items){
            let primes = {
                'pizza'                 : 2,
                'dubbuff'               : 3,
                'singlebuff'            : 5,
                'cbr'                   : 7,
                'single'                : 11,
                'cheese'                : 13,
                'chicken'               : 17,
                'soda/gatorade'         : 19,
                'ice'                   : 23
            }
            let num = 1
            for(let i = 0 ; i < items.length; i++){
                if(items[i].includes("Pizza")){
                    let p = items[i].split(" ")
                    num *= Math.pow(2,Number(p[0]))
                }
                else {
                    let x = items[i].split(" ")[0]
                    num *= primes[x.toLowerCase()]
                }
            }
            return num
        },

        hallStaffCheckBox(){

            //Takes time to model to this.hallStaffOrder so flip the values

            if(!this.hallStaffOrder){
                this.price = 0
            } else {
                for( let i = 0; i < this.items.length; i++ ){
                    switch(this.items[i]){
                        case 'DubBuff':
                            this.price += 5
                            break
                        case 'SingleBuff':
                            this.price += 3
                            break
                        case 'CBR':
                            this.price += 5
                            break
                        case 'Cheese Nachos':
                            this.price += 2.50
                            break
                        case 'Chicken Nachos':
                            this.price += 3.50
                            break
                        case 'Single CBR':
                            this.price += 3
                            break
                        case 'Soda/Gatorade':
                            this.price += 1.50
                            break                    
                        case 'Ice Cream Sandwich':
                            this.price += 1.50
                            break
                        default:
                            this.price += (0.25 * this.pizzaRolls)
                            break;
                    }
                }
            }
        },
    },



    data(){
        return{
            
            selectedOrder: [],
            orderId: null,
            customers: this.$store.state.customerBase,
            filteredCustomers: [],
            modal: false,
            hallStaffOrder: false,
            toggleQuantity: false,
            name: '',
            items: [],
            comments: '',
            cash: null,
            price: null,
            pizzaRolls: null,
        }
    }
}
</script>

<style>
    button:disabled{
        background-color: grey;
    }
  .new-modal {
    width: auto;
    height: auto;
    padding: 10px;
    margin: 50px 50px;
    max-height: 85%;
    background: rgb(255, 255, 255);
    border-radius: 10px;
    overflow-y: auto;
  }

  .new-backdrop {
    top: 0;
    position: fixed;
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
  }

    /* If you are updating style for one specific component need to use .modal */
    .new-modal h1 {
    color: #2c3e50;
    border: none;
    padding: 0;
  }
  
  .new-modal p {
      font-style: italic;
      color: #2c3e50;
  }

  .new-modal .actions {
    text-align: center;
    margin: 30px 0 10px 0;
    color: #333;
  }
  .new-modal .actions a {
    color: #333;
    padding: 8px;
    border: 1px solid #eee;
    border-radius: 4px;
    text-decoration: none;
    margin: 10px;
  }

  .nameInput{
    border: 2px solid lightgray;
  }

  .listContainer{
    max-height: 120px;
    overflow-y: scroll;
    text-align: left;
  }

  .listItem{
    width: 100%; 
    cursor: pointer; 
    border-bottom: solid 1px lightgray;
    padding: 5px;
    background: rgb(232, 233, 233);
    color: black;
  }

  .listItem:hover {
    background: rgb(182, 248, 182);
    font-weight: bold;
  }

    input[type="checkbox"] {
    display: inline-block;
    width: 75px;
    margin: 0 10px 0 0;
    position: relative;
    top: 7px;
  }


</style>