<template>
    <div class="new-backdrop" @click.self="closeModal">
        <div class="new-modal" @click.self="toggleQuantity=false">

            <div style="display: inline">
            <h1 style="display: inline">{{currentOrder.name}}'s Order</h1>
            <button  @click="closeModal" type="button" style="display: inline; float: right " class="btn-close pull-right" aria-label="Close"></button>
            </div>

            <hr>

            <button style="background: green; margin-right: 50px; " @click="addItem('DubBuff')">DubBuff</button>
            <button style="background: red; margin-right: 50px;" @click="addItem('SingleBuff')" >SingleBuff</button>
            <button style="background: #47ad64; margin-right: 50px;" @click="addItem('DubBuff - HS')" >DubBuff - HS</button>
            <button style="background: #9e4f4f; margin-right: 50px;" @click="addItem('SingleBuff - HS')" >SingleBuff - HS</button>
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

            <div v-for="item in currentOrder.items" :key="item" class="pill">
                <span @click="delItem(item)" >{{item}}</span>
            </div>
            <hr>

            <input type="text" placeholder="Comments (optional)" v-model="currentOrder.comments">

            <hr>
            <h2>Ticket Total: ${{Number(currentOrder.price).toFixed(2)}}</h2>

            <hr>
            <button :disabled="!currentOrder.price" @click="submitOrder">Submit Order</button>

        </div>
    </div>
</template>

<script>

import { ordersCollection } from '../../firebase'
import { addDoc } from 'firebase/firestore'

export default {

    methods: {
        closeModal(){
            this.$emit('close')
        },

        addItem( item ){

            this.currentOrder.items.push(item)

            switch(item){
                case 'DubBuff':
                    this.currentOrder.price += 5
                    break
                case 'SingleBuff':
                    this.currentOrder.price += 3
                    break
                case 'DubBuff - HS':
                    this.currentOrder.price += 5
                    break
                case 'SingleBuff - HS':
                    this.currentOrder.price += 3
                    break
                case 'CBR':
                    this.currentOrder.price += 5
                    break
                case 'Cheese Nachos':
                    this.currentOrder.price += 2.50
                    break
                case 'Chicken Nachos':
                    this.currentOrder.price += 3.50
                    break
                case 'Single CBR':
                    this.currentOrder.price += 3
                    break
                case 'Soda/Gatorade':
                    this.currentOrder.price += 1.50
                    break                    
                case 'Ice Cream Sandwich':
                    this.currentOrder.price += 1.50
                    break

            }
        },

        delItem( item ){

            switch(item){
                case 'DubBuff':
                    this.currentOrder.price -= 5
                    break
                case 'SingleBuff':
                    this.currentOrder.price -= 3
                    break
                case 'DubBuff - HS':
                    this.currentOrder.price -= 5
                    break
                case 'SingleBuff - HS':
                    this.currentOrder.price -= 3
                    break
                case 'CBR':
                    this.currentOrder.price -= 5
                    break
                case 'Cheese Nachos':
                    this.currentOrder.price -= 2.50
                    break
                case 'Chicken Nachos':
                    this.currentOrder.price -= 3.50
                    break
                case 'Single CBR':
                    this.currentOrder.price -= 3
                    break
                case 'Soda/Gatorade':
                    this.currentOrder.price -= 1.50
                    break                    
                case 'Ice Cream Sandwich':
                    this.currentOrder.price -= 1.50
                    break
                default: //Pizza Rolls
                    this.currentOrder.price -= (0.25 * this.pizzaRolls)
                    this.pizzaRolls = 0
                    this.toggleQuantity = 0
                    break
            }

            const index = this.currentOrder.items.indexOf(item)
            
            this.currentOrder.items.splice(index,1)
        },

        addPizzaRolls(){

            let match = this.currentOrder.items.find(value => /^([0-9]*) (Pizza Rolls)$/.test(value))

            if(match){ //If there are already Pizza Rolls in the order --> Replace
                const index = this.currentOrder.items.indexOf(match)

                const num = Number(this.currentOrder.items[index].slice(0,-11))
                this.currentOrder.price -= (0.25 * num)

                this.currentOrder.items.splice(index,1)
            }
            if(this.pizzaRolls > 0){
                this.currentOrder.items.push(`${this.pizzaRolls} Pizza Rolls`)
                this.currentOrder.price += (0.25 * this.pizzaRolls)
            }

        },

        async submitOrder(){

            this.$emit('success')

            let d = new Date()

            this.currentOrder.time = d.toLocaleTimeString()
            await addDoc( ordersCollection, this.currentOrder )

        },

    },


    data(){
        return{
            
            currentOrder: {
                name: this.$store.state.customer,
                items: [],
                comments: '',
                price: 0.5,
                date: new Date(),
                time: null,
                done: false,
                cash: false,
                online: true,
                email: this.$store.state.user.email,
            },
            dayOfWeek: new Date().getDay(),
            currentTime: new Date(), //Need to cut off online orders at 9:05-11:45,
            toggleQuantity: false,
            pizzaRolls: null,

        }
    }
}
</script>

<style>
    button:disabled{
        background-color: grey;
        cursor: not-allowed;
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
  /* sale styles */
  .new-modal.sale {
    background: crimson;
    color: white;
  }
  .modal.sale h1 {
    color: white;
  }
  .modal.sale .actions {
    color: white;
  }
  .modal.sale .actions a {
    color: white;
  }

</style>