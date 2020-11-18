import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import VueTheMask from 'vue-the-mask';

import Bootstrap from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Snotify from 'vue-snotify';
import 'vue-snotify/styles/material.css';

import money from 'v-money';

Vue.use(Snotify)
Vue.use(VueTheMask)
Vue.use(Bootstrap)
Vue.use(money, {
    decimal: ',',
    thousands: '.',
    precision: 2,
});


Vue.config.productionTip = false
Vue.prototype.$http = Axios

const token = localStorage.getItem('user-token')

if (token) {
    Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

const EventBus = new Vue()

Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function () {
            return EventBus
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')