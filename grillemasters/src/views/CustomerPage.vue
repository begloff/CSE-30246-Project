<template>
  <CustomerOrderModal v-if="showOrderModal" @close="toggleOrderModal" @success="toggleSuccess"/>
  <div style="color: #f8f8f8;">
    <h3>Welcome to the Grille, {{this.$store.state.customerBaseInd[this.$store.state.custId][2]}}</h3>
    <hr>
    <h1>Online Ordering Policy:</h1>
    <li>Online Ordering hours: <b><u>Sun - Thurs from 10:05pm - 11:45pm</u></b></li>
    <li>Online Orders have a <b><u>$0.50 fee</u></b></li>
    <li>Please <b><u>Venmo @DuncanGrille</u></b> the total listed</li>
    <li>You will recieve an email when your order is done</li>
    <li>CBR</li>
    <div style="width: 49%; float: left; margin-right:0.5%;">
        <img src="../assets/grille_boys.jpg" alt="" style="float: right;" width=300 height=300>
    </div>
    <div style="width: 49%; float: right; margin-left:0.5%;">
        <img src="https://images.squarespace-cdn.com/content/v1/54dfd429e4b0549c366f98dd/1441391694273-GK2IJEZSPW4WPH1U0BBF/Ducnan+Hall+CBR.png?format=1500w" alt="" width=300 height=300 style="float: left;">
    </div>


    <button @click="toggleOrderModal" :disabled="false" class="register">New Online Order</button>
    <!-- <button @click="toggleOrderModal" class="register">New Online Order</button> -->
    <p v-if="success" style="color:green;">Your order was submitted successfully!</p>
    <p v-if="(currentTime.getHours() < 22 || (currentTime.getHours() == 22 && currentTime.getMinutes() < 5)
    || (currentTime.getHours() == 23 && currentTime.getMinutes() > 44)) && dayOfWeek < 5" style="color: red;">
        Online Orders can only be placed from 10:05pm - 11:45pm
    </p>
    <p v-if="dayOfWeek > 4" style="color:red;">The Grille is not open today. We are open Sun - Thurs</p>
  </div>
</template>

<script>

import CustomerOrderModal from '../components/orders/CustomerOrderModal.vue'
//dayOfWeek > 4 || currentTime.getHours() < 22 || (currentTime.getHours() == 22 && currentTime.getMinutes() < 5) || (currentTime.getHours() == 23 && currentTime.getMinutes() > 44)
export default {
    created() {
        this.$store.dispatch('setCustId');
    },
    data(){
        return{
            showOrderModal: false,
            currentTime: new Date(),
            dayOfWeek: new Date().getDay(),
            success: false
        }
    },

    methods:{
        toggleOrderModal(){
            this.showOrderModal = !this.showOrderModal
        },
        toggleSuccess(){
            this.showOrderModal = !this.showOrderModal
            alert("Successfully submitted order! Please Venmo @DuncanGrille")
            this.success = true
        }
    },

    components: {
        CustomerOrderModal
    },

}
</script>

<style>

.register:disabled{
    border: 2px solid red;
}

.register:disabled:hover{
    box-shadow: inset 0 0 0 0 rgb(12, 12, 12);
}

</style>