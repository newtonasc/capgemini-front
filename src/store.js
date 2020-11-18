import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {
    API_BASE_URL
} from './config'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: {},
        permissions: {}
    },

    mutations: {
        auth_request(state) {
            state.status = 'loading'
        },

        auth_success(state, token) {
            state.status = 'success'
            state.token = token
        },

        auth_error(state) {
            state.status = 'error'
        },

        logout(state) {
            state.status = ''
            state.token = ''
        },

        auth_user(state, user) {
            state.user = user
        }
    },

    actions: {
        login({
            commit
        }, formData) {
            formData = JSON.parse(formData)
            return new Promise((resolve, reject) => {
                commit('auth_request')
                let urlApi = API_BASE_URL
                axios({
                        url: urlApi + '/login',
                        data: formData,
                        method: 'POST'
                    })
                    .then(resp => {
                        const token = resp.data.token
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

                        axios({
                                url: urlApi + '/user',
                                data: token,
                                method: 'GET'
                            })
                            .then(respuser => {
                                const user = respuser.data.user
                                commit('auth_user', user)
                                resolve(respuser)
                            })
                            .catch(err => {
                                reject(err)
                            })
                            .finally(() => {
                                // this.$snotify.clear()
                            })

                        localStorage.setItem('user-token', token)
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

                        commit('auth_success', token)

                        resolve(resp)
                    })
                    .catch(err => {
                        commit('auth_error')
                        localStorage.removeItem('user-token')
                        reject(err)
                    })
                    .finally(() => {
                        // this.$snotify.clear()
                    })
            })
        },

        restore({
            commit
        }, formData) {
            return new Promise((resolve, reject) => {
                const token = formData.token
                commit('auth_request')
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
                let urlApi = API_BASE_URL
                axios({
                        url: urlApi + '/user',
                        data: token,
                        method: 'GET'
                    })
                    .then(resp => {
                        const user = resp.data.user

                        localStorage.setItem('user-token', token)
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
                        commit('auth_success', token)
                        commit('auth_user', user)
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('auth_error', err)
                        localStorage.removeItem('user-token')
                        reject(err)
                    })
                    .finally(() => {
                        // this.$snotify.clear()
                    })
            })
        },

        logout({
            commit
        }) {
            return new Promise((resolve) => {
                let token = this.getters.getToken
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
                let urlApi = API_BASE_URL
                axios({
                        url: urlApi + '/logout',
                        data: {},
                        method: 'GET'
                    })
                    .then(resp => {
                        console.log(resp)
                    })

                commit('logout')
                localStorage.removeItem('user-token')

                delete axios.defaults.headers.common['Authorization']
                resolve()
            })
        }
    },

    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        getToken: state => state.token
    }
})