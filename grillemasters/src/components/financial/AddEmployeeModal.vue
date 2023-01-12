<template>
    <div class="new-backdrop" @click.self="closeModal">
        <div class="new-modal" @click.self="modal=false">

            <button  @click="closeModal" type="button" style="display: inline; float: right " class="btn-close pull-right" aria-label="Close"></button>
            <h3>Add Employee</h3>
            
            <!-- First compile list of non employees -->

            <hr>
            <input type="text" class="nameInput" id="nameInput" placeholder="Name (First and Last)" v-model="name" autocomplete="off" @input="filterCustomers" @focus="modal=true">
            <div v-if="filteredCustomers && modal" class="listContainer">
                <ul style="padding-left: 0px;">
                    <li class="listItem" v-for="customer in filteredCustomers" @click="setCustomer(customer)">{{customer}}</li>
                </ul>
            </div>
            <hr>

            <button :disabled="!this.name" @click="makeEmployee">Make Employee</button>

        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {db} from "../../firebase"
import {setDoc, doc} from 'firebase/firestore'

export default {
    methods:{
        closeModal(){
            this.$emit('close')
        },
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
        async makeEmployee(customer){
            //need to get employee by name --> change db value for employee to 1 and update in firebase

            const person = this.customers.filter((cust) => {
                return cust[2] == this.name
            })

            if(person.length == 0){
                alert("Cannot make employee")
                return
            }

            var sql = `UPDATE customers set employee = 1 where id = ${person[0][0]}`

            await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: sql})

            //set firebase auth doc to employee
            await setDoc(doc(db,"auth",person[0][1]),{ //Auth collection is to verify employees and load email/name when someone makes an order
                name: person[0][2],
                employee: true
            })

            alert(`${this.name} has been made an employee`)
            this.closeModal()
        }
    },

    async mounted(){ //compile all non employees
        const nonEmployees = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: 'SELECT * from customers where employee != 1;'})
        this.customers = nonEmployees.data
        this.filterCustomers()
    },

    data(){
        return{
            customers: [],
            filteredCustomers: [],
            modal: false,
            name: '',

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