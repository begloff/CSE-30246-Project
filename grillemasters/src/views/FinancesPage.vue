<template>
  <h3>Duncan Grille Finances</h3>
    <WeeklyFinances/>
</template>

<script>

import WeeklyFinances from '../components/financial/WeeklyFinances.vue'

// Gonna need to import data for both the date and Sales Done
// Snapshot for the totals page

export default{

  components:{
    WeeklyFinances,
  },
  
}

</script>

<style>
.components{
  display: inline-block;
  width: 100px;
  height: 100px;  
}

</style>


