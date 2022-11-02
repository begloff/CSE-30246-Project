// import store from '../store/store'
import { createRouter, createWebHistory } from 'vue-router'
import FinancesPage from '../views/FinancesPage.vue'
import LoginPage from '../views/LoginPage.vue'
import OrdersPage from '../views/OrdersPage.vue'
import EditOrder from '../components/orders/EditOrder.vue'
import InventoryPage from '../views/InventoryPage.vue'
import HomePage from '../views/HomePage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import CustomerPage from '../views/CustomerPage.vue'
import PastOrders from '../views/PastOrders.vue'
import { auth } from '../firebase'

import store from '../store/store'

const routes = [
  {
    path: '',
    redirect: {
      name: "home"
    }
  },

  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta:{
      title: "Duncan Grille - Login"
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta:{
      title: "Duncan Grille - Sign Up"
    }
  },

  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta:{
      title: "Duncan Grille"
    }
  },

  {
    path: '/customer',
    name: 'customer',
    component: CustomerPage,
    meta:{
      title: "Duncan Grille - Customer",
      requiresAuth: true,
    }
  },

  {

    path: '/finances',
    name: 'finances',
    component: FinancesPage,
    meta: {
      requiresAuth: true,
      title: "Duncan Grille - Finances"
    }

  },

  {
    path: '/orders',
    name: 'orders',
    component: OrdersPage,
    meta: {
      requiresAuth: true,
      title: "Duncan Grille - Orders"
    }
  },

  {
    path: '/inventory',
    name: 'inventory',
    component: InventoryPage,
    meta: {
      requiresAuth: true,
      title: "Duncan Grille - Inventory"
    }
  },

  {
    path: '/past-orders',
    name: 'inventory',
    component: PastOrders,
    meta: {
      requiresAuth: true,
      title: "Duncan Grille - Past Orders"
    }
  },

  {
    path: '/orders/edit/:id',
    name: 'edit',
    component: EditOrder,
    meta:{
      requiresAuth: true,
      title: "Duncan Grille - Edit Order"
    }
  },

  {
    path: '/:catchAll(.*)',
    redirect: '/login'
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const getCurrentUser = () => {
  return new Promise ( (resolve,reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    )
  })
}

router.beforeEach( async(to, from, next) => {

  document.title = `${to.meta.title}`;

  if (to.path == '/login' && auth.currentUser){
    next('/finances')
    return;
  }

  if ( to.matched.some((record) => record.meta.requiresAuth ) && !store.state.user){
    next('/login')
    return;
  }

  next();


});

export default router
