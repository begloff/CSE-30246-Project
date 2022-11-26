<template>
  <h3>Inventory Page</h3>

  <!-- Week Selector -->
  <label for="weeks">Inventory Info For:</label> 
  <select name="weeks" id="weeks" @change="changeWeek" v-model="selectedWeek" >
    <option v-for="week in this.$store.state.weeks" :value="week"> Week of {{week[1].split(" ")[0]}} </option>
  </select>

  <div v-if="selectedWeek" class="card" style="float: left; width: 48%; margin-left: 10px;">
    <p>Sales Distribution for Week of {{selectedWeek[1].split(" ")[0]}}</p>
    <div id="chart-wrapper">
      <canvas id="myBarChart" width="300" height="200" style="margin-top: 5px"></canvas>
    </div>
    <p>Approximate Inventory Usage:</p>
    <p>Chicken Units: {{chicken}} -> {{chickenUsage}} Bags</p>
    <p>Cheese Units: {{cheese}} -> {{cheeseUsage}} Bags</p>
    <p>Chips Units: {{chips}} -> {{chipsUsage}} Bags</p>
    <p>Bacon Units: {{bacon}} -> {{baconUsage}} Bags</p>
  </div>

  <div v-if="selectedWeek" class="card" style="float:right; width: 48%; margin-right: 10px;">
    <p>Costs for {{selectedWeek[1].split(" ")[0]}}</p>
    <table class="table">
        <thead>
            <tr>
                <th scope="col">Date</th>
                <th scope="col">$</th>
                <th scope="col">Reason</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="entry in this.weeklyCosts">
                <td>
                    {{entry[3].split(" ")[0]}}
                </td>
                <td>
                    ${{Number(entry[2]).toFixed(2)}}
                </td>
                <td>
                    {{entry[4]}}
                </td>
                <td>
                  <fa icon="trash-can" @click="delStoreRun( entry[0] )" style="color:red; cursor:pointer;"/>
                </td>
            </tr>
        </tbody>
    </table>

    <label for="dateInput">Date of Cost</label>
    <input type="date" v-model="storeDate" name="dateInput">
    <label for="dollarInput">Cost in $</label>
    <input type="number" min="0.01" step="0.01" name="dollarInput" v-model="storeCost">
    <label for="costInput">Reason for Cost</label>
    <input type="text" name="costInput" v-model="storeReason">
    <button @click="addStoreRun" :disabled="!storeDate || !storeCost || !storeReason">Add Cost</button>

  </div>

</template>

<script>

import axios from 'axios';
import Chart from 'chart.js/auto'

export default {

  data(){
    return{
      selectedWeek: null,
      dubbuff_count: 0,
      singlebuff_count: 0,
      singleCBR_count: 0,
      CBR_count: 0,
      chickenNacho_count: 0,
      cheeseNacho_count: 0,
      myBarChart: null,
      chicken: 0,
      cheese: 0,
      bacon: 0,
      chips: 0,
      chickenUsage: 0,
      cheeseUsage: 0,
      chipsUsage: 0,
      baconUsage: 0,
      weeklyCosts: null,
      storeDate: null,
      storeCost: null,
      storeReason: null,
    }
  },

  methods:{
    async changeWeek(){
      //Change week and make subsequent calls for each food item --> Cheese, Chicken, Bacon, Tortillas, Chips
      if(this.myBarChart) this.myBarChart.destroy()
      await this.compileSupply()
      await this.fetchCosts()
    },

    async compileSupply(){
      //Need to scale based on single or dub
      //Single = 0.5 supply units dub = 1 supply unit
      //select * from orders where MOD(items,3) = 0 general formula for sql call
      var dubbuff_count = 0
      var singlebuff_count = 0
      var singleCBR_count = 0
      var CBR_count = 0
      var chickenNacho_count = 0
      var cheeseNacho_count = 0

      //2 dubs, 1 single = 45
      //Extract 2 dubs?

      //Compile each supply item
      const dubbuff = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items from orders where week_id = ${this.selectedWeek[0]} and MOD(items,3) = 0;`})
      const singlebuff = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items from orders where week_id = ${this.selectedWeek[0]} and MOD(items,5) = 0;`})
      const singleCBR = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items from orders where week_id = ${this.selectedWeek[0]} and MOD(items,11) = 0;`})
      const CBR = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items from orders where week_id = ${this.selectedWeek[0]} and MOD(items,7) = 0;`})
      const chickenNacho = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items from orders where week_id = ${this.selectedWeek[0]} and MOD(items,17) = 0;`})
      const cheeseNacho = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items from orders where week_id = ${this.selectedWeek[0]} and MOD(items,13) = 0;`})

      for( var item in dubbuff.data){
        var total = dubbuff.data[item][0]
        while(total % 3 == 0){
          dubbuff_count += 1
          total /= 3
        }
      }

      for( var item in singlebuff.data){
        var total = singlebuff.data[item][0]
        while(total % 5 == 0){
          singlebuff_count += 1
          total /= 5
        }
      }

      for( var item in singleCBR.data){
        var total = singleCBR.data[item][0]
        while(total % 11 == 0){
          singleCBR_count += 1
          total /= 11
        }
      }

      for( var item in CBR.data){
        var total = CBR.data[item][0]
        while(total % 7 == 0){
          CBR_count += 1
          total /= 7
        }
      }

      for( var item in chickenNacho.data){
        var total = chickenNacho.data[item][0]
        while(total % 17 == 0){
          chickenNacho_count += 1
          total /= 17
        }
      }

      for( var item in cheeseNacho.data){
        var total = cheeseNacho.data[item][0]
        while(total % 13 == 0){
          cheeseNacho_count += 1
          total /= 13
        }
      }

      this.dubbuff_count = dubbuff_count
      this.singlebuff_count = singlebuff_count
      this.singleCBR_count = singleCBR_count
      this.CBR_count = CBR_count
      this.chickenNacho_count = chickenNacho_count
      this.cheeseNacho_count = cheeseNacho_count

      this.barChart([dubbuff_count, singlebuff_count, singleCBR_count, CBR_count, chickenNacho_count, cheeseNacho_count])

      //Each Dub/CBR --> 1 Chicken/1 Cheese
      //Each Chix Nacho --> 1.5 Chicken
      //Each Nacho --> 1 Chips/1.5 Cheese
      //Each CBR --> 1 Bacon
      //Single CBR/Singlebuff --> half of normals

      this.cheese = dubbuff_count + CBR_count + 0.5 * (singleCBR_count) + 0.5 * (singlebuff_count) + 1.5 * (chickenNacho_count) + 1.5 * (cheeseNacho_count)
      this.chicken = dubbuff_count + CBR_count + 0.5 * (singleCBR_count) + 0.5 * (singlebuff_count) + 1.5 * (chickenNacho_count) + 1.5 * (cheeseNacho_count)
      this.chips = chickenNacho_count + cheeseNacho_count
      this.bacon = CBR_count + 0.5 * (singleCBR_count)

      //Estimation for Bags of Chips, Bacon, Cheese, and Chicken
      //96 Nugs per bag --> 4 Nugs Unit/Dub
      //Cheese --> Every 15 Items = Bag
      //Chips --> 6 Nachos per Bag

      this.chickenUsage = Math.round( (this.chicken * 4) / 96 )
      this.cheeseUsage = Math.round( this.cheese / 15 )
      this.chipsUsage = Math.round( this.chips / 6)
      this.baconUsage = Math.round( this.bacon / 11)

    },

    async fetchCosts(){
      const costs = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT * from costs where week_id = ${this.selectedWeek[0]};`})
      this.weeklyCosts = costs.data
    },

    async delStoreRun(id){
      const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order', {sql: `delete from costs where cost_id = ${id}`})
      this.weeklyCosts = this.weeklyCosts.filter( (item) => {
        return item[0] != id;
      })
    },

    async addStoreRun(){
      const d = this.storeDate.split('-')
      const date = new Date(d[0],d[1]-1,d[2],-4,0,0,0).toISOString().slice(0, 19).replace('T', ' ')
      const cost = this.storeCost
      const reason = this.storeReason

      const sql = `insert into costs (week_id, cost, date, reason) values (${this.selectedWeek[0]}, ${cost}, '${date}', '${reason}');`

      const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order', {sql: sql})

      //Need to get week id
      const sql2 = `SELECT * from costs where week_id = ${this.selectedWeek[0]} and date = '${date}' and cost = ${cost} and reason = '${reason}';`
      const da = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: sql2})

      this.weeklyCosts.push(da.data[0])
    },

    barChart( items ){
      const ctx = document.getElementById('myBarChart').getContext('2d');
      const l = ["Dubbuffs", "Singlebuffs", "SingleCBRs", "CBRs", "Chicken Nachos", "Cheese Nachos"]

      // console.log(dubbuff_count)

      this.myBarChart = new Chart(ctx, {
        type: 'bar',
        data:{
          labels: l,
          datasets: [
            {
              label: "Amount Purchased",
              data: items,
              backgroundColor: ['red', 'orange', 'yellow','green','blue','purple', 'black']
            },
          ]
        }
      })

    }

  }

}
</script>

<style>

</style>