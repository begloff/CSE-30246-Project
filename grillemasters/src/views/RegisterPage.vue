<template>
<h3 style="color:white;">Duncan Grille Sign Up</h3>
<form @submit.prevent="register" class="signupForm">
    <label>First Name: </label>
    <input type="text" required v-model="signup_form.first_name">
    <label>Last Name: </label>
    <input type="text" required v-model="signup_form.last_name">
    <label>Email: </label>
    <input type="email" required v-model="signup_form.email">
    <label>Password: </label>
    <input type="password" v-model="signup_form.password" required>
    <button class="register">Sign Up</button>
</form>

<img src="https://images.squarespace-cdn.com/content/v1/54dfd429e4b0549c366f98dd/1599506014278-OY3IXZWIHO6CRM7ZB6UO/5Q6A9980.jpg?format=2500w" alt="DuncanHall">

</template>

<script>

import { ref } from 'vue'
import { useStore } from 'vuex'

// Want to restrict signup unless email has @nd.edu
//Throw Email and name into customer collection --> EDIT Check to see if user is in auth db --> if not set their value
//Issue with this --> done client side so not entirely reliable

export default {
    setup(){
        const signup_form = ref({});
        const store = useStore();

        const register = () => {
            let check = signup_form.value.email.slice(-7)
            if(check !== '@nd.edu'){

                alert("You are not permitted to make an account.")
                signup_form.value.email = ""
                signup_form.value.name = ""
                signup_form.value.password = ""

            } else {
                signup_form.value.name = signup_form.value.first_name + " " + signup_form.value.last_name
                store.dispatch('register',signup_form.value)
            }
        }

        return{
            signup_form,
            register
        }
    },

}
</script>

<style>

.signupForm{
    max-width: 60%;
    background: transparent;
}

.banner{
    width: 100%;
    margin: 0;
    height: 100vh;
    background-image: linear-gradient(rgba(34, 34, 34, 0.75),rgba(65, 65, 65, 0.75)) ,url(../assets/duncandoor.jpeg);
    background-size: cover;
    background-position: center;
    overflow: auto;
    
}

.register{
    background: transparent;
    border: 2px solid rgb(13, 69, 253);
    box-shadow: inset 0 0 0 0 rgb(13, 69, 253);
    transition: ease-out 0.3s;
}

.register:hover{
    box-shadow: inset 300px 0 0 0 rgb(13, 69, 253);
    transition: ease-in 0.5s;
}

</style>