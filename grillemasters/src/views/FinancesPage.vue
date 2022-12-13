<template>
  <h3>Duncan Grille Finances</h3>
<!--WeeklyFinances/-->
  <div style="max-width:40%; margin-left:30%; margin-right:30%; margin-bottom:20px; text-align:center;">
    <label for="weeks">Financial Info For:</label>

    <select name="selectWeek" id="selectedWeek" @change="updateFinances()" v-model="selectedWeek"> 
      <option v-for="week in this.$store.state.weeks" :value="week"> Week of {{week[1].split(" ")[0]}} </option>
    </select>
  </div>

  <div>
    <h1 style="font-weight: bold;" 
    :class="{ negative: this.$store.state.weeklyRev - this.$store.state.totalCost < 0, 
              positive: this.$store.state.weeklyRev - this.$store.state.totalCost >= 0}">
    Weekly Profit: {{Number(this.$store.state.weeklyRev - this.$store.state.totalCost).toFixed(2)}}
    </h1>
    <p>
      <em>Projected Profit: {{(this.$store.state.projections.r - this.$store.state.projections.c).toFixed(2)}}</em>
    </p>
  </div>
  <hr style="width:80%; margin: auto; margin-bottom:10px;">
  <div style="margin:auto; height:420px; width:95%;">
    <div class="lCard">
      <p style="color: green; font-size: 22px;">Weekly Revenue: ${{Number(this.$store.state.weeklyRev).toFixed(2)}}</p>
      <p style="font-size: 12px;">Projected Revenue: ${{(this.$store.state.projections.r).toFixed(2)}}</p>
      <div style="width:30%; float:left; margin-left:12.5%;">
      <p style="font-size: 15px; color:green; text-align: left; margin-bottom:15px;">Venmo Revenue: ${{ Number(this.$store.state.weeklyVenmoRev).toFixed(2)}}</p> 
      </div>
      <div style="width:30%; float:right; margin-right:12.5%;">
      <p style="font-size: 15px; color:green; text-align: right; margin-bottom:15px;">Cash Revenue: ${{ Number(this.$store.state.weeklyCashRev).toFixed(2)}}</p>
      </div>
      <div>
        <canvas id="myBarChart" width="500" height="200" style="margin-top: 5px;"></canvas>
      </div>
    </div>
    
    <div class="rCard">
      <p style="color: red; font-size: 22px;">Weekly Cost: ${{Number(this.$store.state.totalCost).toFixed(2)}}</p>
      <p style="font-size: 12px;">Projected Cost: ${{(this.$store.state.projections.c).toFixed(2)}}</p>
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
                <tr v-for="entry in this.$store.state.weekCosts">
                    <td>
                        {{entry[1].split(' ')[0]}}
                    </td>
                    <td>
                        {{Number(entry[0]).toFixed(2)}}
                    </td>
                    <td>
                        {{entry[2]}}
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  </div>
  <hr style="width:80%; margin: auto;">
  <div style="margin:auto; margin-bottom: 15px; height:430px; width:95%;">
    <div class="lCard">
      <h2> Profit Distribution: </h2>
      <p style="font-size: 14px;">Weekly Profit: ${{ Number((this.$store.state.weeklyRev - this.$store.state.totalCost)).toFixed(2)}}</p>
      <p style="font-size: 14px; color: red;">10% Operations Cut: ${{ Number(0.1 * (this.$store.state.weeklyRev - this.$store.state.totalCost)).toFixed(2)}}</p>
      <p style="font-size: 14px; color: red;">Weekly Online Fees: ${{ Number(this.$store.state.weeklyOnlineFee).toFixed(2)}}</p>
      <p style="font-size: 14px; color: green;">Employee Wage Pool: ${{ Number(0.9 * (this.$store.state.weeklyRev - this.$store.state.totalCost)).toFixed(2)}}</p>
      <p style="font-size: 14px; color: orange;">Hours Worked: {{this.$store.state.totalHours.toFixed(2)}}</p>
      <hr style="width:80%; margin: auto; margin-bottom:40px;">
      <p style="color: green; font-size: 40px;"> Hourly Wage: ${{this.$store.state.wage.toFixed(2)}}/hour</p>
    </div>
    <div class="rCard">
      <h2>Weekly Wages:</h2>
      <div id="chart-wrapper">
        <canvas id="myDoughnutChart" width="500" height="270" style="margin-top: 5px;"></canvas>
      </div>
    </div>
</div>
<hr style="width:80%; margin: auto;">
<div style="margin:auto; margin-top:50px; width:90%;">
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
      <tr v-for="day in schedule">
        <td>
          {{day[0]}}
        </td>
        <td v-for="i in (day.length-1)">
          <input type="text" name="" v-model="day[i]" style="text-align:center;">
        </td>
      </tr>
    </tbody>
    </table>
    <button @click="updateSchedule()"> Submit Schedule </button>
  </div>
</template>
<script>
import WeeklyFinances from '../components/financial/WeeklyFinances.vue'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import axios from 'axios';

export default{
  components:{
    WeeklyFinances,
  },

  async mounted(){
    this.selectedWeek = this.$store.state.weeks.filter( week => week[0] == this.$store.state.currWeek)[0]
    await this.$store.dispatch("updateFinancePage")

    if(this.myBarChart){
      this.myBarChart.destroy()
    }

    if(this.myDoughnutChart){
      this.myDoughnutChart.destroy()
    }


    this.barChart(this.$store.state.weekVenmo, this.$store.state.weekCash, this.$store.state.weekLabels)
    this.doughnutChart(this.$store.state.workerHours, this.$store.state.workingEmployees)

    this.schedule = this.$store.state.workingEmployees
    console.log(this.schedule)

  },

  methods:{

    async updateSchedule() {
      console.log(this.schedule)

      //Need to prevent SQL injection here
      var sql = ''

      //Need to update
      for( var i = 0; i < this.schedule.length; i++){
        console.log(this.schedule[i])
        sql = sql.concat(`UPDATE schedule set w1 = '${this.schedule[i][1]}', w2 = '${this.schedule[i][2]}', w3 = '${this.schedule[i][3]}' where week_id = ${this.selectedWeek[0]} and day_of_week = '${this.schedule[i][0]}'; `)
      }

      await axios.post('https://duncan-grille-api.azurewebsites.net/api/place-order',{sql: sql})

    },

    async updateFinances(){

      await this.$store.dispatch("selectWeek", Number(this.selectedWeek[0]))

      await this.$store.dispatch("updateFinancePage")

      if(this.myBarChart){
        this.myBarChart.destroy()
      }

      if(this.myDoughnutChart){
        this.myDoughnutChart.destroy()
      }

      this.barChart(this.$store.state.weekVenmo, this.$store.state.weekCash, this.$store.state.weekLabels)
      this.doughnutChart(this.$store.state.workerHours, this.$store.state.workingEmployees)

      this.schedule = this.$store.state.workingEmployees


    },

    async setProjections() {
      await this.$store.dispatch("setProjections")
    },

    doughnutChart(hours, employees) {
      const ctx = document.getElementById('myDoughnutChart').getContext('2d');
      this.myDoughnutChart = new Chart( ctx, {
        type: 'doughnut',
        data: {
          labels: employees,
          datasets: [{
            label:'Hours',
            data: hours,
                  backgroundColor: [
                      'red',
                      'orange',
                      'yellow',
                      'green',
                      'blue',
                      'indigo',
                      'violet',
                      'brown',
                      'black',
                      'white',
                  ],
                  hoverOffset: 4
          }],
        },
        options:{
          maintainAspectRatio: false,
          plugins:{
              tooltip:{
                  callbacks:{
                      label: function(tooltipItem, data){
                          return tooltipItem.label + ": $" + Number(tooltipItem.parsed).toFixed(2);
                      }
                  }
              }
          }
        }
      });
      this.myDoughnutChart;
    },

    barChart( venmo, cash, week ){

      const ctx = document.getElementById('myBarChart').getContext('2d');

      this.myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: week,
            datasets: [
                {
                    label: 'Venmo Total',
                    data: venmo,
                    backgroundColor: "#008CFF",
                    borderWidth: 1
                },
                {
                    label: 'Cash Total',
                    data: cash,
                    backgroundColor: "#85bb65",
                    borderWidth: 1                      
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grace: "10%",
                    stacked: true,                     
                },
                x: {
                    stacked: true,
                }
            },
            // maintainAspectRatio: false,
            plugins:{
                datalabels:{
                    anchor: 'end',
                    align: 'top',
                    formatter: (value, context) => {
                        const datasetArray = [];
                        context.chart.data.datasets.forEach((dataset) => {
                            if(dataset.data[context.dataIndex] != undefined){
                                datasetArray.push(dataset.data[context.dataIndex]);
                            }
                        });

                        function totalSum(total, datapoint){
                            return Number(total) + Number(datapoint);
                        }

                        let sum = datasetArray.reduce(totalSum, 0);

                        if(context.datasetIndex == datasetArray.length - 1){
                            return `$ ${Number(sum).toFixed(2)} `;
                        } else {
                            return '';
                        }

                    }
                },
                tooltip:{
                    callbacks:{
                        label: function(tooltipItem, data){
                            return tooltipItem.dataset.label + ": $" + Number(tooltipItem.formattedValue).toFixed(2);
                        }
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
    this.myBarChart;
    
  },




  },
  data(){
    return{
      selectedWeek: null,
      myBarChart: null,
      myDoughnutChart: null,
      schedule: []
    }
  },
  beforeMount(){
    this.setProjections()
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
    margin-right: 2%;  
    margin-top: 30px;
    width: 46%;
}
.rCard{
    float: right;
    margin-left: 2%;   
    margin-right: 2%; 
    margin-top: 30px;
    width: 46%;   
}
.table {
  float: center;
  width: 90%
}


</style>

