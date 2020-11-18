import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Login from './views/login/Login.vue'
import Panel from './views/restrict/Panel.vue'

Vue.use(Router)

let router = new Router({
    mode: 'history',

    routes: [{
            path: '/',
            name: 'panel',
            component: Panel,
            meta: {
                requiresAuth: true
            }
        },

        {
            path: '/login',
            name: 'login',
            component: Login
        },
    ],
})

router.beforeEach((to, from, next) => {
    if (!store.getters.isLoggedIn) {
        if (localStorage.getItem('user-token')) {
            let token = localStorage.getItem('user-token')

            store.dispatch('restore', {
                    token
                })
                .then(() => {
                    next('/')
                })
                .catch(
                    (error) => {
                        console.log(error)
                        next('/login')
                    }
                )
        }
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
            next()
            return
        }

        next('/login')
    } else {
        next()
    }
})

export default router