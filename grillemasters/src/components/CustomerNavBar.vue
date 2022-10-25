<template>

<nav class="navbar navbar-expand-lg navbar-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#" style="color: #f8f8f8;">
      <img src="../assets/dunc1.png" class="d-inline-block align-center pl-3 img-fluid">
      Duncan Hall Grille     
    </a>
    <button class="navbar-toggler"  style="vertical-align: middle" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <fa icon="bars" style="color: white;"/>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">   
        <li class="nav-item" >
          <a class="nav-link"  v-if="$store.state.user" @click = "$store.dispatch('logout')" href="#" style="color: #f8f8f8;">Log Out</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
  
</template>

<style>

nav{
  padding: 20;
}

.container-fluid{
  padding-top: 5px;
}

.navbar-light .navbar-brand {
    color: #2c3e50;
}

.navbar-light .nav-link{
  color: #fafbfc
}

.navbar-brand {
  font-weight: bold;
  color: #f8f8f8;
}

.navbar-nav{
  margin-left: 75px;
}

.nav-link:hover{
  text-decoration: underline;
}

</style>