<template>
  <h3>Current Orders</h3>
  <hr>
  <OrderTable/>
  <button @click="toggleOrderModal">Create New Order</button>
  <h2 style="padding-top: 20px;">Nightly Total: ${{Number(this.$store.state.nightTotal).toFixed(2)}}</h2>
  <hr>
  <button style="background: green; font-size: 20px; border-radius: 4px;" @click="toggleHoursModal">Log Hours</button>
  <NewOrderModal v-if="showOrderModal" @close="toggleOrderModal" />
  <LogHoursModal v-if="showHoursModal" @close="toggleHoursModal"/>
</template>

<script>

import NewOrderModal from '../components/orders/NewOrderModal.vue'
import OrderTable from '../components/orders/OrderTable.vue'
import LogHoursModal from '../components/financial/LogHoursModal.vue'

export default {

    data(){
        return{
            showOrderModal: false,
            showHoursModal: false,
            total: 0
        }
    },

    methods:{
        toggleOrderModal(){
            this.showOrderModal = !this.showOrderModal
        },
        toggleHoursModal(){
            this.showHoursModal = !this.showHoursModal
        }
    },
    components: {
        NewOrderModal,
        OrderTable,
        LogHoursModal,
    }

}
</script>

<style>

</style>