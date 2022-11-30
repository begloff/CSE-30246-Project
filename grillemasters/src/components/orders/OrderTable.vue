<template>

  <ConfirmModal v-if="deleteModal" @denied="toggleModal" @confirmed="confirmDelete"/>

  <table class="table" v-if="this.$store.state.orders">
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
     { online: order[9] == '1' && order[10] == '0', completed : order[10] == '1' }">
        <th scope="row"> {{ index + 1 }}</th>
        <td>
            <fa icon="money-bill" v-if="order[8] == '1'" style="color:green;"/>
            <fa icon="v" style="color:blue;" v-else/>
        </td>
        <td>
            <fa icon="computer" v-if="order[9] == '1'" style="color: black;"/>
            <fa icon="people-arrows" v-else />
        </td>
        <td>{{ order[3] }}</td>
        <td v-if="order[7] == 'None'">Customer</td>
        <td v-else>{{ this.$store.state.customerBaseInd[order[7]][2] }}</td>
        <td>{{ decodeOrder(order[2]) }}</td>
        <td style="word-wrap: break-word; max-width: 400px;">{{ order[11]}}</td>
        <td v-if="order[9] == '0'">${{Number(order[1]).toFixed(2)}}</td>
        <td v-else>${{Number(order[1] - .5).toFixed(2)}}</td>
      

      <td>
        <fa icon="check-to-slot" @click="toggleDone( order )" style="color:green; cursor:pointer;"/>
      </td>
      <td>
        <fa icon="pen-to-square" @click="$router.push( { path: `/orders/edit/${order[0]}` })" style="color:#2c3e50; cursor: pointer"/>
      </td>
      <td>
        <fa icon="trash-can" @click="toggleDel( order[0] )" style="color:red; cursor:pointer;"/>
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
        async toggleDone( order ){
          // Read done value from order and flip it
          this.$store.dispatch('completeOrder', {order: order});
        },
        toggleModal(){
            this.deleteModal = !this.deleteModal
        },
        toggleDel( id ){
            this.$store.dispatch('deleteOrder', {id: id});
        },
        async confirmDelete(){
            this.deleteModal = !this.deleteModal
            await deleteDoc( doc( ordersCollection, this.delId ))
        },
        decodeOrder(order){
          let primes = {
                2:'pizza'                 ,
                3:'Dubbuff'               ,
                5:'Singlebuff'            ,
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
          return orderlist.join(', ');
        
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