import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import router from './router'
import store from './store'
import dateFilter from '@/filters/date.filter'
import messagePlugin from '@/common/message.plugin'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'


Vue.config.productionTip = false

Vue.use(messagePlugin)
Vue.use(Vuelidate)
Vue.filter('date', dateFilter)

firebase.initializeApp({
  apiKey: "AIzaSyB4kyl-PlAzAIeUcO_TCPZbbCpZ53hN8Us",
  authDomain: "vue-money-flow.firebaseapp.com",
  projectId: "vue-money-flow",
  storageBucket: "vue-money-flow.appspot.com",
  messagingSenderId: "359130978902",
  appId: "1:359130978902:web:8f11ff925cacc0ec1579f7",
  measurementId: "G-1TM13324GM"
})

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
  }
})



