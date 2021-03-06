import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import store from './store'

import App from './App.vue'
import Index from './views/Index'
import Login from './views/Login'
import Register from './views/Register'
import List from './views/List'
import UeberUns from './views/UeberUns'

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuex);
if (process.env.NODE_ENV == 'production') {
  Vue.http.options.root = '/api/v1';
}
else {
  Vue.http.options.root = 'http://localhost:5000/api/v1';
}

/*
const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}
*/

const routes = [
  { path: '/', component: Index },
  { path: '/login', component: Login },
  { path: '/register', component: Register},
  { path: '/ueber-uns', component: UeberUns},
  { path: '/list', component: List }
];

const router = new VueRouter({ routes });

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
