<template>
  
    <div class="new-backdrop" @click.self="deny">
        <div class="new-modal">
            <h1>Are You Sure?</h1>
            <button @click = "confirm" style="background-color:red;"> Yes </button>
            <button @click = "deny"> No </button>
        </div>
    </div>
        
</template>

<script>
export default {

    methods:{
        deny(){
            this.$emit("denied")
        },
        confirm(){
            this.$emit("confirmed")
        }
    }

}
</script>

<style scoped>

button + button {
    margin-left: 20px
}

</style>