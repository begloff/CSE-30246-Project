<template>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <img src="../assets/dunc1.png" class="d-inline-block align-center pl-3 img-fluid">
      Duncan Hall Grille     
    </a>
    <button class="navbar-toggler bg-light"  style="vertical-align: middle" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" to="/finances">Finances</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" to="/inventory">Inventory</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" to="/orders">Orders</router-link>
        </li>    
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" to="/past-orders">Past Orders</router-link>
        </li>    
        <li class="nav-item" >
          <a class="nav-link"  v-if="$store.state.user" @click = "$store.dispatch('logout')" href="#">Log Out</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
  
</template>

<style>

nav{
  padding: 20
}

.container-fluid{
  padding-top: 5px;
}

.navbar-light .navbar-brand {
    color: #2c3e50;
}

.navbar-light .nav-link{
  color: #2c3e50
}

.navbar-brand {
  font-weight: bold;
  color: #2c3e50;
}

.navbar-nav{
  margin-left: 75px;
}

</style>