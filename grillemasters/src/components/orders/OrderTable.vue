<template>

  <ConfirmModal v-if="deleteModal" @denied="toggleModal" @confirmed="confirmDelete"/>

  <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">$</th>
      <th scope="col">Type</th>
      <th scope="col">Time</th>
      <th scope="col">Name</th>
      <th scope="col">Order</th>
      <th scope="col">Comments</th>
      <th scope="col">Price</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(order,index) in this.$store.state.orders" :class="
    { online: order.data.online && !order.data.done, completed : order.data.done }">
      <th scope="row"> {{ index + 1 }}</th>
      <td>
        <fa icon="money-bill" v-if="order.data.cash" style="color:green;"/>
        <fa icon="v" style="color:blue;" v-else/>
      </td>
      <td>
        <fa icon="computer" v-if="order.data.online" style="color: black;"/>
        <fa icon="people-arrows" v-else />
      </td>
      <td>{{order.data.time}}</td>
      <td>{{ order.data.name }}</td>
      <td>{{ order.data.items.join(", ") }}</td>
      <td style="word-wrap: break-word; max-width: 400px;">{{ order.data.comments}}</td>
      <td v-if="!order.data.online">${{Number(order.data.price).toFixed(2)}}</td>
      <td v-else>${{Number(order.data.price - .5).toFixed(2)}}</td>
      

      <td>
        <fa icon="check-to-slot" @click="toggleDone( order.id, order.data )" style="color:green; cursor:pointer;"/>
      </td>
      <td>
        <fa icon="pen-to-square" @click="$router.push( { path: `/orders/edit/${order.id}` })" style="color:#2c3e50; cursor: pointer"/>
      </td>
      <td>
        <fa icon="trash-can" @click="toggleDel( order.id )" style="color:red; cursor:pointer;"/>
      </td>
      

    </tr>

  </tbody>
  </table>


</template>

<script>
// import ordersCollection from "../firebase"
import { deleteDoc, updateDoc, doc, collection, onSnapshot, query, orderBy, setDoc } from "firebase/firestore"
import { ordersCollection, weeklyCollection, operationCollection, weeklyPrefix, db} from "../../firebase"

import ConfirmModal  from "./ConfirmModal.vue"

export default {
    components:{
        ConfirmModal
    },

    data(){
        return{
            deleteModal: false,
            delId: null,
        }
    },

    methods: {

        async toggleDone( id, order ){
          // Read done value from order and flip it

            await updateDoc( doc(ordersCollection, id),{
                done: !order.done
            })

            order.done = !order.done
        },

        toggleModal(){
            this.deleteModal = !this.deleteModal
        },

        toggleDel( id ){
            this.delId = id
            this.deleteModal = !this.deleteModal
        },

        async confirmDelete(){
            this.deleteModal = !this.deleteModal
            await deleteDoc( doc( ordersCollection, this.delId ))
        },
    },

}
</script>

<style>

.completed{
    background-color: rgb(170, 230, 170);
}
.online{
    background-color: rgb(235, 209, 161);
}

</style>