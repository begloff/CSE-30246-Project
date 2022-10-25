<template>


    <h1 class="title">Welcome to the Duncan Grille</h1>
    <p style="color: white;">Open Sunday-Thursday 10pm-12am </p>

    <hr style="color: white; height: 5px; margin-top: 60px;">

    <h2 style="color:white; ">Our Menu</h2>

    <div class="menu">
        <div style="float:right;">
            <div>
                <p style="display: inline"><b>Dubbuff - $5.00</b></p><p style="font-size: 13px; display: inline;"> : Double Buffalo Chicken Quesadilla</p>
            </div>
            <div>
                <p style="display: inline"><b>Singlebuff - $3.00</b></p><p style="font-size: 13px; display: inline;"> : Single Buffalo Chicken Quesadilla</p>
            </div>
            <div>
                <p style="display: inline"><b>CBR - $5.00</b></p><p style="font-size: 13px; display: inline;"> : Double Chicken Bacon Ranch Quesadilla</p>
            </div>
            <div>
                <p style="display: inline"><b>Single CBR - $3.00</b></p><p style="font-size: 13px; display: inline;"> : Single Chicken Bacon Ranch Quesadilla</p>
            </div>
            <div>
                <p style="display: inline"><b>Chicken Nachos - $3.50</b></p><p style="font-size: 13px; display: inline;"></p>
            </div>
            <div>
            <p style="display: inline"><b>Cheese Nachos - $2.50</b></p><p style="font-size: 13px; display: inline;"></p>
            </div>
            <div>
                <p style="display: inline"><b>Pizza Rolls - $0.25 per</b></p><p style="font-size: 13px; display: inline;"></p>
            </div>
            <div>
                <p style="display: inline"><b>Soda/Gatorade - $1.50</b></p><p style="font-size: 13px; display: inline;"></p>
            </div>
            <div>
                <p style="display: inline"><b>Ice Cream Sandwich - $1.50</b></p><p style="font-size: 13px; display: inline;"></p>
            </div>
        </div>   
    </div>

    <div class="food" style="display: inline-block;">
        <img src="../assets/Dubbuff.jpg" class="image" style="float: left;" height=235 width=235>
    </div>

    <hr style="color: white; height: 5px;">
    
    <div>
        <button class="register" style="display: inline-block; margin-right: 15px; border-radius: 10px;" @click="$router.push('/login')">Login</button>
        <p style="display: inline-block; color: white; font-style: normal;">or</p>
        <button class="register" style="display: inline-block; margin-left: 15px; margin-right: 15px; border-radius: 10px;" @click="$router.push('/register')">Sign Up</button>
        <p style="display: inline-block; color: white; font-style: normal;"> to order! </p>
    </div>

</template>

<script>

import PublicNavBar from '../components/PublicNavBar.vue'

export default {

    components: {
        PublicNavBar
    }

}
</script>

<style scoped>

    .banner{
        width: 100%;
        margin: 0;
        height: 100vh;
        background-image: linear-gradient(rgba(34, 34, 34, 0.75),rgba(65, 65, 65, 0.75)) ,url(../assets/duncandoor.jpeg);
        background-size: cover;
        background-position: center;
        overflow: auto;
        
    }

    .title{
        color: white;
        padding-top: 10%;
        font-size: 55px;
    }

    .menu{
        padding-top: 10px;
        color: white;
        display: inline-block;
        width: 40%;
        margin-right: none;
    }

    .food{
        width: 40%;
        display: inline-block;
        margin-left: 35px;
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
    
    p{
        font-size: 18px;
    }


</style>