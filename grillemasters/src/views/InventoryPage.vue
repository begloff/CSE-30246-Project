<template>
  <h3>Inventory Page</h3>

  <!-- Week Selector -->
  <label for="weeks">Inventory Info For:</label> 
  <select name="weeks" id="weeks" @change="changeWeek" v-model="selectedWeek" >
    <option v-for="week in this.$store.state.weeks" :value="week"> Week of {{week[1].split(" ")[0]}} </option>
  </select>

  <div v-if="selectedWeek" style="float: left; width: 48%; margin-left: 10px;">
    <p>Sales Distribution for Week of {{selectedWeek[1].split(" ")[0]}}</p>
    <div id="chart-wrapper">
      <canvas id="myBarChart" width="300" height="200" style="margin-top: 5px"></canvas>
    </div>
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
      myBarChart: null
    }
  },

  methods:{
    async changeWeek(){
      //Change week and make subsequent calls for each food item --> Cheese, Chicken, Bacon, Tortillas, Chips
      if(this.myBarChart) this.myBarChart.destroy()
      await this.compileSupply()
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

      console.log(dubbuff_count, singlebuff_count, singleCBR_count, CBR_count, chickenNacho_count, cheeseNacho_count)
      this.dubbuff_count = dubbuff_count
      this.singlebuff_count = singlebuff_count
      this.singleCBR_count = singleCBR_count
      this.CBR_count = CBR_count
      this.chickenNacho_count = chickenNacho_count
      this.cheeseNacho_count = cheeseNacho_count

      this.barChart([dubbuff_count, singlebuff_count, singleCBR_count, CBR_count, chickenNacho_count, cheeseNacho_count])

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