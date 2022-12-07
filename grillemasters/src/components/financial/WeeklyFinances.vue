<template>


    <!-- <div class = "card" style="margin-bottom: 20px;">
        <label for="weeks">Financial Info For:</label>
        <select name="weeks" id="weeks" @change="changeView" v-model="week">
            <option v-for="week in this.$store.state.weeksOfOperation" :value="week">{{ week.replace('-',' ',).replace('-',' ',).replace('-','/',) }}</option>
        </select>
    </div>

    <div style="display: block; float: right; width: 48%; margin-right:10px;">

    <div class="card">
        <div id="chart-wrapper">
            <canvas id="myBarChart" width="300" height="200" style="margin-top: 5px"></canvas>
        </div>
        <p style="color: green; font-size: 22px;">Weekly Revenue: ${{Number(this.$store.state.weeklyRev).toFixed(2)}}</p>
    </div>

    <div class="card" style="margin-top: 50px;">
        <p style="color: red; font-size: 22px;">Costs: {{this.$store.state.selectedWeek.replace('-',' ',).replace('-',' ',).replace('-','/',)}}</p>
        
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

        <label for="dateInput">Date of Cost</label>
        <input type="date" v-model="storeDate" name="dateInput">
        <label for="dollarInput">Cost in $</label>
        <input type="number" min="0.01" step="0.01" name="dollarInput" v-model="storeCost">
        <label for="costInput">Reason for Cost</label>
        <input type="text" name="costInput" v-model="storeReason">
        <button @click="addStoreRun">Add Cost</button>

        <p style="color: red; font-size: 22px;">Weekly Cost: ${{Number(this.$store.state.totalCost).toFixed(2)}}</p>

    </div>

    <div class="card" style="margin-top: 50px; margin-bottom: 50px;">
        <h2 style="font-weight: bold;" 
        :class="{ negative: this.$store.state.weeklyRev - this.$store.state.totalCost < 0, 
        positive: this.$store.state.weeklyRev - this.$store.state.totalCost > 0}">
        Weekly Profit: ${{Number(this.$store.state.weeklyRev - this.$store.state.totalCost).toFixed(2)}}
        </h2>
    </div>

    </div>

    <div style="float: left; width: 48%; margin-left: 10px">

        <div class = "card">
            <h2>Schedule</h2>
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
            <p style="font-size: 12px; font-style: normal;" v-for="worker in workerHours">{{worker}}</p>
        </div>

        <div class="card" style="margin-top: 50px;">
            <h2>
                Profit Distribution:
            </h2>
            <p style="font-size: 12px;">Weekly Profit: ${{ Number((this.$store.state.weeklyRev - this.$store.state.totalCost)).toFixed(2)}}</p>
            <p style="font-size: 12px; color: red;">10% Operations Cut: ${{ Number(0.1 * (this.$store.state.weeklyRev - this.$store.state.totalCost)).toFixed(2)}}</p>
            <p style="font-size: 12px; color: red;">Weekly Online Fees: ${{ Number(this.$store.state.weeklyOnlineFee).toFixed(2)}}</p>
            <p style="font-size: 12px; color: green;">Employee Wage Pool: ${{ Number(0.9 * (this.$store.state.weeklyRev - this.$store.state.totalCost)).toFixed(2)}}</p>
            <p style="font-size: 12px; color: orange;">Hours Worked: {{this.$store.state.totalHours}}</p>
            <hr>
            <p style="color: green;"> 
                Hourly Wage: ${{ Number( (0.9 * (this.$store.state.weeklyRev - this.$store.state.totalCost) ) / this.$store.state.totalHours ).toFixed(2)}}/hour
            </p>

            <div id="chart-wrapper">
                <canvas id="myDoughnutChart" width="250" height="250" style="margin-top: 5px"></canvas>
            </div>

            <p style="font-size: 10px;">Full Amount May Include Both Venmo and Cash</p>
            <p style="font-size: 10px;">Weekly Venmo Profit: ${{ Number((this.$store.state.weeklyVenmoRev - this.$store.state.totalCost)).toFixed(2)}}</p>
            <p style="font-size: 10px;">Weekly Cash Profit: ${{ Number((this.$store.state.weeklyCashRev)).toFixed(2)}}</p>
        </div>
        
    </div> -->

  
</template>

<script>
// Need to Adjust the Size of the labels for the chart based on days of the week
// Start With Sunday and advance to the current day --> need to adjust for end of month

import { weeklyCollection, db, operationCollection, viewCollection, weeklyPrefix } from "../../firebase"
import { deleteDoc, getDocs, updateDoc, doc, collection, onSnapshot, query, orderBy, setDoc, addDoc, getDoc } from "firebase/firestore"
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useStore } from 'vuex'


export default {

    data(){
        return{
            totalRev: 0,
            weeks: [],
            week: this.$store.state.selectedWeek,
            myBarChart: null,
            myDoughnutChart: null,
            storeDate: null,
            storeCost: null,
            storeRuns: [],
            storeReason: "",
            totalCost: 0,
            workerHours: this.combineHours()
        }
    },

    async mounted(){
        
        this.barChart(this.$store.state.venmo, this.$store.state.cash, this.$store.state.days.flat());
        this.doughnutChart(this.$store.state.employeeWages, this.$store.state.workingEmployees )

    },

    methods:{

        combineHours(){
            const x = []
            for(let i = 0; i < this.$store.state.workingEmployees.length; i++){
                x.push(this.$store.state.workingEmployees[i] + ": " + this.$store.state.hours[i])
            }
            return x
        },

        async changeView(){

            //Need to change selected week --> update view collection and recall Data and store runs
            this.$store.dispatch("changeWeek", this.week)

            viewCollection.view = collection(db, "finances", this.week, "daily-totals")
            
            this.myBarChart.destroy()
            this.myDoughnutChart.destroy()

            await this.$store.dispatch("getFinancialData")
            await this.$store.dispatch("getStoreData")
            await this.$store.dispatch("getSchedule")
            await this.$store.dispatch("getHours")


            this.barChart(this.$store.state.venmo, this.$store.state.cash, this.$store.state.days.flat());
            this.doughnutChart(this.$store.state.employeeWages, this.$store.state.workingEmployees);

            this.workerHours = this.combineHours()
        },
        
        async addStoreRun(){

            const newRun = await addDoc(collection(db,"finances",this.$store.state.selectedWeek,"store-runs"),{
                date: this.storeDate,
                cost: this.storeCost,
                reason: this.storeReason
            })

            this.$store.dispatch("addStoreRun",{
                date: this.storeDate,
                cost: this.storeCost,
                reason: this.storeReason,
                id: newRun.id
            })

            this.$store.dispatch("addCost",this.storeCost)

            this.storeDate = null
            this.storeCost = 0
            this.storeReason = "-"
        },

        async delStoreRun(id){

            await deleteDoc(doc(collection(db,"finances",this.$store.state.selectedWeek,"store-runs"),id))
            this.$store.dispatch("deleteStoreRun",id)
            
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
                    maintainAspectRatio: false,
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
                                    return total + datapoint;
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

        doughnutChart(hours,employees){
            const ctx = document.getElementById('myDoughnutChart').getContext('2d');

            this.myDoughnutChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: employees,
                    datasets:[{
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
                    }]
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
        }

    }




}
</script>

<style>

#chart-wrapper{
    display: flex;   
}
#myBarChart{
    min-height: 30%;
}
p{
    font-style: italic;
    font-weight: bold;
}

/* .card{
    margin-left: 50%; 
    margin-right: 30px;   
} */

.negative{
    color: red;
}

.positive{
    color: green;
}


</style>