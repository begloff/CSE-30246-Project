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
  <hr>
  <div v-if="selectedWeek" class="card" style="width: 98%; margin-right: 10px; margin-left: 10px;">
    <p> Inventory in Stock</p>
    <p>Chicken Units: {{chickenStorage}} Bags</p>
    <p>Cheese Units: {{cheeseStorage}} Bags</p>
    <p>Chips Units: {{chipsStorage}} Bags</p>
    <p>Bacon Units: {{baconStorage}} Bags</p>

  </div>
  <div v-if="selectedWeek" class="card" style="width: 98%; margin-right: 10px; margin-left: 10px;">
    <!-- <label for="dateInput">Week of Inventory Update</label>
    <select name="weeks" id="weeks" v-model="selectedWeekInven" >
      <option v-for="week in this.$store.state.weeks" :value="week"> Week of {{week[1].split(" ")[0]}} </option>
    </select>
    <p> {{selectedWeekInven}} </p> -->

    <p>Update Inventory</p>
    <label for="chickenInput">Chicken Storage</label>
    <input type="number" min="0" step="1" name="chickenInput" v-model="chickenInvenUpdate">
    <label for="cheeseInput">Cheese Storage</label>
    <input type="number" min="0" step="1" name="cheeseInput" v-model="cheeseInvenUpdate">
    <label for="chipsInput">Chips Storage</label>
    <input type="number" min="0" step="1" name="chipsnInput" v-model="chipsInvenUpdate">
    <label for="baconInput">bacon Storage</label>
    <input type="number" min="0" step="1" name="baconInput" v-model="baconInvenUpdate">
    <button @click="updateInventory" :disabled="!chickenInvenUpdate && !cheeseInvenUpdate && !chipsInvenUpdate && ! baconInvenUpdate">Update Inventory</button>
    
  </div>
  <div class="card" style="width: 98%; margin-right: 10px; margin-left: 10px;">
    <p>Historical Stats</p>
    <div id="chart-wrapper">
      <canvas id="TotalChart" width="300" height="200" style="margin-top: 5px"></canvas>
    </div>
    <p>Dubbuff: {{tdubbuff_count}} </p>
    <p>Singlebuff: {{tsinglebuff_count}} </p>
    <p>CBR: {{tCBR_count}} </p>
    <p>SingleCBR: {{tsingleCBR_count}} </p>
    <p>ChickenNacho: {{tchickenNacho_count}} </p>
    <p>CheeseNacho: {{tcheeseNacho_count}} </p>
  </div>
  <div class="card" style="width: 98%; margin-right: 10px; margin-left: 10px;">
    <p>Day of Week Stats</p>
    <p>Sunday</p>
    <p>Dubbuff: {{wdubbuff_count['SU'].toFixed(2)}}  Singlebuff: {{wsinglebuff_count['SU'].toFixed(2)}}  CBR: {{wCBR_count['SU'].toFixed(2)}}  SingleCBR: {{wsingleCBR_count['SU'].toFixed(2)}}  ChickenNacho: {{wchickenNacho_count['SU'].toFixed(2)}}  CheeseNacho: {{wcheeseNacho_count['SU'].toFixed(2)}}</p>
    <p>Monday</p>
    <p>Dubbuff: {{wdubbuff_count['MO'].toFixed(2)}}  Singlebuff: {{wsinglebuff_count['MO'].toFixed(2)}}  CBR: {{wCBR_count['MO'].toFixed(2)}}  SingleCBR: {{wsingleCBR_count['MO'].toFixed(2)}}  ChickenNacho: {{wchickenNacho_count['MO'].toFixed(2)}}  CheeseNacho: {{wcheeseNacho_count['MO'].toFixed(2)}}</p>
    <p>Tuesday</p>
    <p>Dubbuff: {{wdubbuff_count['TU'].toFixed(2)}}  Singlebuff: {{wsinglebuff_count['TU'].toFixed(2)}}  CBR: {{wCBR_count['TU'].toFixed(2)}}  SingleCBR: {{wsingleCBR_count['TU'].toFixed(2)}}  ChickenNacho: {{wchickenNacho_count['TU'].toFixed(2)}}  CheeseNacho: {{wcheeseNacho_count['TU'].toFixed(2)}}</p>
    <p>Wednesday</p>
    <p>Dubbuff: {{wdubbuff_count['WE'].toFixed(2)}}  Singlebuff: {{wsinglebuff_count['WE'].toFixed(2)}}  CBR: {{wCBR_count['WE'].toFixed(2)}}  SingleCBR: {{wsingleCBR_count['WE'].toFixed(2)}}  ChickenNacho: {{wchickenNacho_count['WE'].toFixed(2)}}  CheeseNacho: {{wcheeseNacho_count['WE'].toFixed(2)}}</p>
    <p>Thursday</p>
    <p>Dubbuff: {{wdubbuff_count['TH'].toFixed(2)}}  Singlebuff: {{wsinglebuff_count['TH'].toFixed(2)}}  CBR: {{wCBR_count['TH'].toFixed(2)}}  SingleCBR: {{wsingleCBR_count['TH'].toFixed(2)}}  ChickenNacho: {{wchickenNacho_count['TH'].toFixed(2)}}  CheeseNacho: {{wcheeseNacho_count['TH'].toFixed(2)}}</p>
  </div>
</template>

<script>
import { faBuildingCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Chart from 'chart.js/auto'
export default {
  data(){
    return{
      selectedWeek: null,
      selectedWeekInven: null,
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
      chickenStorage: 0,
      cheeseStorage: 0,
      chipsStorage: 0,
      baconStorage: 0,
      chickenInvenUpdate: null,
      cheeseInvenUpdate: null,
      chipsInvenUpdate: null,
      baconInvenUpdate: null,
      weeklyCosts: null,
      storeDate: null,
      storeCost: null,
      storeReason: null,
      inventoryExist: true,
      tdubbuff_count: 0,
      tsinglebuff_count: 0,
      tsingleCBR_count: 0,
      tCBR_count: 0,
      tchickenNacho_count: 0,
      tcheeseNacho_count: 0,
      TotalChart:null,
      wdubbuff_count: {'SU':0,'MO':0,'TU':0,'WE':0,'TH':0},
      wsinglebuff_count: {'SU':0,'MO':0,'TU':0,'WE':0,'TH':0},
      wsingleCBR_count: {'SU':0,'MO':0,'TU':0,'WE':0,'TH':0},
      wCBR_count: {'SU':0,'MO':0,'TU':0,'WE':0,'TH':0},
      wchickenNacho_count: {'SU':0,'MO':0,'TU':0,'WE':0,'TH':0},
      wcheeseNacho_count: {'SU':0,'MO':0,'TU':0,'WE':0,'TH':0}
    }
  },
  methods:{
    async changeWeek(){
      //Change week and make subsequent calls for each food item --> Cheese, Chicken, Bacon, Tortillas, Chips
      if(this.myBarChart) this.myBarChart.destroy()
      await this.compileSupply()
      await this.fetchCosts()
      await this.fetchInventory()
      await this.historicalstats()
    },
    async historicalstats(){
      var dubbuff_count = 0
      var singlebuff_count = 0
      var singleCBR_count = 0
      var CBR_count = 0
      var chickenNacho_count = 0
      var cheeseNacho_count = 0     
      const dubbuff = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items from orders where MOD(items,3) = 0;`})
      const singlebuff = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items from orders where MOD(items,5) = 0;`})
      const singleCBR = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items from orders where MOD(items,11) = 0;`})
      const CBR = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items from orders where MOD(items,7) = 0;`})
      const chickenNacho = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items from orders where MOD(items,17) = 0;`})
      const cheeseNacho = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items from orders where MOD(items,13) = 0;`})
      const test=await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items, order_day from orders where MOD(items,3) = 0;`})
      console.log("yes")
      console.log(test.data[0])
      const wdubbuff = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items, order_day from orders where MOD(items,3) = 0;`})
      const wsinglebuff = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items, order_day from orders where MOD(items,5) = 0;`})
      const wsingleCBR = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items, order_day from orders where MOD(items,11) = 0;`})
      const wCBR = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items, order_day from orders where MOD(items,7) = 0;`})
      const wchickenNacho = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items , order_day from orders where MOD(items,17) = 0;`})
      const wcheeseNacho = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT items, order_day from orders where MOD(items,13) = 0;`})
      const noSU = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT count(DISTINCT week_id) from orders where order_day='SU';`})
      const noMO= await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT count(DISTINCT week_id) from orders where order_day='MO';`})
      const noTU = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT count(DISTINCT week_id) from orders where order_day='TU';`})
      const noWE = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT count(DISTINCT week_id) from orders where order_day='WE';`})
      const noTH = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT count(DISTINCT week_id) from orders where order_day='TH';`})
      var db = {
        'SU':0,
        'MO':0,
        'TU':0,
        'WE':0,
        'TH':0,
      }
      var sb = {
        'SU':0,
        'MO':0,
        'TU':0,
        'WE':0,
        'TH':0,
      }
      var sc = {
        'SU':0,
        'MO':0,
        'TU':0,
        'WE':0,
        'TH':0,
      }
      var c = {
        'SU':0,
        'MO':0,
        'TU':0,
        'WE':0,
        'TH':0,
      }
      var cin = {
        'SU':0,
        'MO':0,
        'TU':0,
        'WE':0,
        'TH':0,
      }
      var cen = {
        'SU':0,
        'MO':0,
        'TU':0,
        'WE':0,
        'TH':0,
      }
      for( var item in wdubbuff.data){
        var total = wdubbuff.data[item][0]
        while(total % 3 == 0){
          db[wdubbuff.data[item][1]] += 1
          total /= 3
        }
      }
      for( var item in wsinglebuff.data){
        var total = wsinglebuff.data[item][0]
        while(total % 5 == 0){
          sb[wdubbuff.data[item][1]] += 1
          total /= 5
        }
      }
      for( var item in wsingleCBR.data){
        var total = wsingleCBR.data[item][0]
        while(total % 11 == 0){
          sc[wdubbuff.data[item][1]] += 1
          total /= 11
        }
      }
      for( var item in wCBR.data){
        var total = wCBR.data[item][0]
        while(total % 7 == 0){
          c[wdubbuff.data[item][1]] += 1
          total /= 7
        }
      }
      for( var item in wchickenNacho.data){
        var total = wchickenNacho.data[item][0]
        while(total % 17 == 0){
          cin[wdubbuff.data[item][1]]+= 1
          total /= 17
        }
      }
      for( var item in wcheeseNacho.data){
        var total = wcheeseNacho.data[item][0]
        while(total % 13 == 0){
          cen[wdubbuff.data[item][1]] += 1
          total /= 13
        }
      }
      console.log(db['SU']/Number(noSU.data[0]))
      db['SU']/=Number(noSU.data[0])
      sb['SU']/=Number(noSU.data[0])
      sc['SU']/=Number(noSU.data[0])
      c['SU']/=Number(noSU.data[0])
      cin['SU']/=Number(noSU.data[0])
      cen['SU']/=Number(noSU.data[0])

      db['MO']/=Number(noMO.data[0])
      sb['MO']/=Number(noMO.data[0])
      sc['MO']/=Number(noMO.data[0])
      c['MO']/=Number(noMO.data[0])
      cin['MO']/=Number(noMO.data[0])
      cen['MO']/=Number(noMO.data[0])

      db['TU']/=Number(noTU.data[0])
      sb['TU']/=Number(noTU.data[0])
      sc['TU']/=Number(noTU.data[0])
      c['TU']/=Number(noTU.data[0])
      cin['TU']/=Number(noTU.data[0])
      cen['TU']/=Number(noTU.data[0])

      db['WE']/=Number(noWE.data[0])
      sb['WE']/=Number(noWE.data[0])
      sc['WE']/=Number(noWE.data[0])
      c['WE']/=Number(noWE.data[0])
      cin['WE']/=Number(noWE.data[0])
      cen['WE']/=Number(noWE.data[0])

      db['TH']/=Number(noTH.data[0])
      sb['TH']/=Number(noTH.data[0])
      sc['TH']/=Number(noTH.data[0])
      c['TH']/=Number(noTH.data[0])
      cin['TH']/=Number(noTH.data[0])
      cen['TH']/=Number(noTH.data[0])

      this.wdubbuff_count=db
      this.wsinglebuff_count=sb
      this.wCBR_count=c
      this.wsingleCBR_count=sc
      this.wchickenNacho_count=cin
      this.wcheeseNacho_count=cen




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
      this.tdubbuff_count = dubbuff_count
      this.tsinglebuff_count = singlebuff_count
      this.tsingleCBR_count = singleCBR_count
      this.tCBR_count = CBR_count
      this.tchickenNacho_count = chickenNacho_count
      this.tcheeseNacho_count = cheeseNacho_count
      this.totalChart([dubbuff_count, singlebuff_count,  CBR_count,singleCBR_count, chickenNacho_count, cheeseNacho_count])

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
    async fetchInventory(){
      const chickenStorage = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT chicken from inventory;`})
      // console.log("yes")
      if(chickenStorage.data.length==0) this.inventoryExist=false
      this.chickenStorage = Number(chickenStorage.data[0])
      const cheeseStorage = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT cheese from inventory;`})
      this.cheeseStorage=Number(cheeseStorage.data[0])
      const chipsStorage = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT chips from inventory;`})
      this.chipsStorage=Number(chipsStorage.data[0])
      const baconStorage = await axios.post('https://duncan-grille-api.azurewebsites.net/api/get-orders',{sql: `SELECT bacon from inventory;`})
      this.baconStorage=Number(baconStorage.data[0])
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
    async updateInventory(){
      let chick=this.chickenStorage
      let chips=this.chipsStorage
      let cheese=this.cheeseStorage
      let bacon=this.baconStorage
      if(this.chickenInvenUpdate) chick=this.chickenInvenUpdate
      if(this.chipsInvenUpdate) chips=this.chipsInvenUpdate
      if(this.cheeseInvenUpdate) cheese=this.cheeseInvenUpdate
      if(this.baconInvenUpdate) bacon=this.baconInvenUpdate
      if(this.inventoryExist){
        const sql=`UPDATE inventory SET chicken = ${chick}, cheese = ${cheese}, chips= ${chips},bacon=${bacon};`
        console.log("Success")
        const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order', {sql: sql})
      }else{
        if(!this.chickenInvenUpdate) chick=0
        if(!this.chipsInvenUpdate) chips=0
        if(!this.cheeseInvenUpdate) cheese=0
        if(!this.baconInvenUpdate) bacon=0
        const sql=`insert into inventory values (${chick}, ${cheese}, ${chips},${bacon});`
        const response = await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order', {sql: sql})
      }
      
      //Need to get week id
      this.chickenStorage=chick
      this.chipsStorage=chips
      this.cheeseStorage=cheese
      this.baconStorage=bacon
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
    },
    totalChart( items ){
      const ctx = document.getElementById('TotalChart').getContext('2d');
      const l = ["Dubbuffs", "Singlebuffs",  "CBRs", "SingleCBRs", "Chicken Nachos", "Cheese Nachos"]
      // console.log(dubbuff_count)
      this.TotalChart = new Chart(ctx, {
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