<template>
      <div class="new-backdrop" @click.self="closeModal">
        <div class="new-modal">

            <h2>Log Hours</h2>

            <label for="employees">Select Your Name:</label>
            <select name="employees" id="employees" v-model="this.hoursObj.employee">
                <option v-for="employee in this.$store.state.employees" :value="employee">{{employee[2]}}</option>
            </select>

            <label for="hours"> Enter Your Hours:</label>
            <div id="hours">
                <input type="number" v-model="this.hoursObj.hours">
                <p style="font-style: normal; color: rgb(161, 154, 154); font-size: 12px;">Example: 2.5, 1.3, 2.0, etc</p>
            </div>

            <p v-if="this.hoursObj.employee">Employee: {{this.hoursObj.employee[2]}}</p>
            <p v-if="this.hoursObj.hours">Hours: {{this.hoursObj.hours}}</p>

            <p v-if="this.hoursObj.hours > 3" style="color:red; font-size: 12px;">Maximum of 3 hours</p>
            <button :disabled="this.hoursObj.hours>3 || !this.hoursObj.employee || !this.hoursObj.hours" @click="submitHours">Submit Hours</button>

        </div>
    </div>
</template>

<script>

import { addDoc, collection } from 'firebase/firestore'
import { db, weeklyPrefix } from '../../firebase'

export default {

    data(){
        return{
            hoursObj: {
                employee: null,
                hours: null,
            }
        }
    },

    methods:{
        closeModal(){
            this.$emit('close')
        },

        async submitHours(){
            
            console.log(this.hoursObj.employee)
            this.$emit('close')
            let employee = this.hoursObj.employee[0]
            this.$store.dispatch('logHours', {id: Number(employee), hours: this.hoursObj.hours});
        }
    },
}
</script>

<style>
  .descriptor{
    font-style: normal;
    color: rgb(161, 154, 154);
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