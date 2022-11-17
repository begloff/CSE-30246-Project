<template>
  <h3>Duncan Grille Finances</h3>
<!--WeeklyFinances/-->


  <div style="max-width:40%; margin-left:30%; margin-right:30%; margin-bottom:20px; text-align:center;">
    <label for="weeks">Financial Info For:</label>
    
    <select name="weeks" id="weeks" @change="changeWeek" v-model="selectedWeek" > 
      <!-- so pretty much we have to get weeks of operation from sql to the store-->
      <option v-for="week in this.$store.state.weeks" :value="week"> Week of {{week[1].split(" ")[0]}} </option>
      <!-- This line is fucked ^^^ -->

      <!-- Fixed it Tommy <3 -->
      <!-- What you need to do from here is make queries to db using axios based on the selected week -->
      <!-- Make requests to axios within the methods below -->

    </select>

    <p>Value for selected week is {{selectedWeek}} </p>



  </div>

  <div style="margin-top: 50px; margin-bottom: 50px;">
    <h2 style="font-weight: bold;" 
    :class="{ negative: this.$store.state.weeklyRev - this.$store.state.totalCost < 0, 
              positive: this.$store.state.weeklyRev - this.$store.state.totalCost > 0}">
    Weekly Profit: ${{Number(this.$store.state.weeklyRev - this.$store.state.totalCost).toFixed(2)}}
    </h2>
  </div>

  <div>
    <div class="lCard">
      <p style="color: green; font-size: 22px;">Weekly Revenue: ${{Number(this.$store.state.weeklyRev).toFixed(2)}}</p>
      <div id="chart-wrapper">
        <canvas id="myBarChart" width="300" height="200" style="margin-top: 5px"></canvas>
      </div>
    </div>

    <div class="rCard">
      <p style="color: red; font-size: 22px;">Weekly Cost: ${{Number(this.$store.state.totalCost).toFixed(2)}}</p>
      <div id="chart-wrapper">
          <canvas id="myBarChart" width="300" height="200" style="margin-top: 5px"></canvas>
      </div>
    </div>
  </div>

  <div style="float:right;">
    <p style="color: green; font-size: 8px; margin-right: 50px;">Go Dawgs ΔΩΓ</p>
  </div>
</template>
<script>
import WeeklyFinances from '../components/financial/WeeklyFinances.vue'

// Gonna need to import data for both the date and Sales Done
// Snapshot for the totals page

export default{

  components:{
    WeeklyFinances,
  },

  methods:{
    // Insert methods here
    changeWeek(){
      //The change week method is referenced above in the select tag
      //Can extract week id (first entry in selectedWeek list)
      
    }
  },

  data(){
    return{
      selectedWeek: []
    }
  }
  
}

</script>

<style>
.components{
  display: inline-block;
  width: 100px;
  height: 100px;  
}

.lCard{
    float: left;
    margin-left: 2%;   
    width: 48%;
}
.rCard{
    float: right;
    margin-right: 2%; 
    width: 48%;   
}


</style>


