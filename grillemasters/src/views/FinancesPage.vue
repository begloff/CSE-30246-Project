<template>
  <h3>Duncan Grille Finances</h3>
<!--WeeklyFinances/-->


  <div style="max-width:40%; margin-left:30%; margin-right:30%; margin-bottom:20px; text-align:center;">
    <label for="weeks">Financial Info For:</label>
    
    
    <!-- !!!!!!! -->
    <select name="weeks" id="weeks" @change="updateFinances()" v-model="this.$store.state.selectedWeek" > 
      <option v-for="week in this.$store.state.weeks" :value="week"> Week of {{week[1].split(" ")[0]}} </option>
    </select>
  </div>

  <div>
    <h1 style="font-weight: bold;" 
    :class="{ negative: this.$store.state.weeklyRev - this.$store.state.totalCost < 0, 
              positive: this.$store.state.weeklyRev - this.$store.state.totalCost >= 0}">
    Weekly Profit: {{Number(this.$store.state.weeklyRev - this.$store.state.totalCost).toFixed(2)}}
    </h1>
  </div>
  <hr style="width:80%; margin: auto; margin-bottom:40px;">
  <div style="margin:auto; height:350px; width:95%; border:0px solid #000;">
    <div class="lCard">
      <p style="color: green; font-size: 22px;">Weekly Revenue: ${{Number(this.$store.state.weeklyRev).toFixed(2)}}</p>
      <div style="width:30%; float:left; margin-left:12.5%;">
      <p style="font-size: 15px; color:green; text-align: left; margin-bottom:15px;">Venmo Revenue: ${{ Number(this.$store.state.weeklyVenmoRev).toFixed(2)}}</p> 
      </div>
      <div style="width:30%; float:right; margin-right:12.5%;">
      <p style="font-size: 15px; color:green; text-align: right; margin-bottom:15px;">Cash Revenue: ${{ Number(this.$store.state.weeklyCashRev).toFixed(2)}}</p>
      </div>
      <div>
        <canvas id="myBarChart" width="500" height="200" style="align: center; margin-top: 5px; border:1px solid #000000;"></canvas>
      </div>
    </div>
    
    <div class="rCard">
      <p style="color: red; font-size: 22px;">Weekly Cost: ${{Number(this.$store.state.totalCost).toFixed(2)}}</p>
      <div>        
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">$</th>
                    <th scope="col">Reason</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="entry in this.$store.state.storeRuns">
                    <td>
                        {{entry.date}}
                    </td>
                    <td>
                        ${{Number(entry.cost).toFixed(2)}}
                    </td>
                    <td>
                        {{entry.reason}}
                    </td>
                    <td>
                      <fa icon="trash-can" @click="delStoreRun( entry.id )" style="color:red; cursor:pointer;"/>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  </div>

  <div style="margin:auto; margin-bottom: 15px; height:430px; width:95%; border:1px solid #000;">
    <div class="lCard">
      <h2> Profit Distribution: </h2>
      <p style="font-size: 14px;">Weekly Profit: ${{ Number((this.$store.state.weeklyRev - this.$store.state.totalCost)).toFixed(2)}}</p>
      <p style="font-size: 14px; color: red;">10% Operations Cut: ${{ Number(0.1 * (this.$store.state.weeklyRev - this.$store.state.totalCost)).toFixed(2)}}</p>
      <p style="font-size: 14px; color: red;">Weekly Online Fees: ${{ Number(this.$store.state.weeklyOnlineFee).toFixed(2)}}</p>
      <p style="font-size: 14px; color: green;">Employee Wage Pool: ${{ Number(0.9 * (this.$store.state.weeklyRev - this.$store.state.totalCost)).toFixed(2)}}</p>
      <p style="font-size: 14px; color: orange;">Hours Worked: {{this.$store.state.totalHours}}</p>
      <hr style="width:80%; margin: auto; margin-bottom:40px;">
      <p style="color: green; font-size: 40px;"> 
          Hourly Wage: ${{ Number( (0.9 * (this.$store.state.weeklyRev - this.$store.state.totalCost) ) / this.$store.state.totalHours ).toFixed(2)}}/hour
      </p>
    </div>
    <div class="rCard">

      <div id="chart-wrapper">
        <canvas id="myDoughnutChart" width="250" height="250" style="margin-top: 5px;"></canvas>
      </div>
    </div>
  </div>

  <div style="margin:auto; margin-top:60px; height:600px; width:90%; border:1px solid #000;">
    <h2 style="margin-top:20px;">Schedule</h2>
    <table class="table">
    <thead>
      <tr>
        <th scope="col">Date</th>
        <th scope="col">1</th>
        <th scope="col">2</th>
        <th scope="col">3</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in this.$store.state.schedule">
        <td>
          {{entry.date}}
        </td>
        <td v-for="shift in entry.schedule">
          {{shift}}
        </td>
      </tr>
    </tbody>
    </table>
    <p>Hours Worked:</p>
    <!--<p style="font-size: 12px; font-style: normal;" v-for="worker in workerHours">{{worker}}</p>-->
  </div>
  
  <div style="float:right; margin:auto;">
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
    async updateFinances(){
      await this.$store.dispatch("updateFinancePage")
    },
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
    margin-top: 30px;
    width: 48%;
}
.rCard{
    float: right;
    margin-right: 2%; 
    margin-top: 30px;
    width: 48%;   
}
</style>

