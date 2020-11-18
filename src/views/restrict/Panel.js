import axios from 'axios'
import money from 'v-money';

import {
    API_BASE_URL
} from '@/config'

export default {
    name: 'panel',

    components: {
        'money': money
    },

    data() {
        return {
            pageTitle: '',
            loadingUser: true,
            loadingBalance: true,
            loadingWallet: true,
            walletUsers: [],
            user: {},
            balance: 0,
            wallet: [],
            token: null,
            receipt: [],
            deposit: {
                amount: '0,00'
            },
            withdraw: {
                amount: '0,00'
            },
            transfer: {
                amount: '0,00'
            },
            selected: '',
        }
    },

    created() {
        this.$snotify.clear()
    },

    mounted() {
        this.getUserData()
    },

    methods: {
        logout() {
            this.$store.dispatch('logout')
                .then(() => {
                    this.$router.push('/login')
                })
        },

        getUserData() {
            setTimeout(() => {
                this.user = this.$store.state.user
                this.pageTitle = this.user.name
                this.loadingUser = false
                this.token = this.$store.getters.getToken

                this.getBalance(this.user.id)
                this.getWallet(this.user.id)
                this.getWalletusers(this.user.id)
            }, 1000)
        },

        getBalance(id) {
            this.balance = 0
            this.loadingBalance = true

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token
            axios({
                    url: API_BASE_URL + '/balance/' + id,
                    data: {},
                    method: 'GET'
                })
                .then(response => {
                    if (response.data.error) {
                        this.$snotify.error(response.data.message, 'Erro')
                        return
                    }

                    this.balance = response.data.data[0]['balance']
                })
                .catch(error => {
                    this.loadingBalance = false
                    this.$snotify.error('Falha ao obter dados', 'Erro')
                    this.error = error
                })
                .finally(() => {
                    this.loadingBalance = false
                })
        },

        getWallet(id) {
            this.wallet = []
            this.loadingWallet = true

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token
            axios({
                    url: API_BASE_URL + '/wallet/' + id,
                    data: {},
                    method: 'GET'
                })
                .then(response => {
                    if (response.data.error) {
                        this.$snotify.error(response.data.message, 'Erro')
                        return
                    }

                    this.wallet = response.data.data
                })
                .catch(error => {
                    this.loadingWallet = false
                    this.$snotify.error('Falha ao obter dados', 'Erro')
                    this.error = error
                })
                .finally(() => {
                    this.loadingWallet = false
                })
        },

        getWalletusers(id) {
            this.walletUsers = []

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token
            axios({
                    url: API_BASE_URL + '/usersWallet/' + id,
                    data: {},
                    method: 'GET'
                })
                .then(response => {
                    if (response.data.error) {
                        this.$snotify.error(response.data.message, 'Erro')
                        return
                    }

                    this.walletUsers = response.data.original
                })
                .catch(error => {
                    this.loadingWallet = false
                    this.$snotify.error('Falha ao obter dados', 'Erro')
                    this.error = error
                })
                .finally(() => {
                    this.loadingWallet = false
                })
        },

        saveDeposit() {
            if (!this.deposit.amount || this.deposit.amount == '0,00') {
                this.$snotify.warning('Informe o valor do depósito', 'Atenção')
                return
            }

            let data = {
                'transaction': 4,
                'amount': this.deposit.amount.replace('.', '').replace(',', '.')
            }

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token
            axios({
                    url: API_BASE_URL + '/wallet/' + this.user.id,
                    data: data,
                    method: 'PATCH'
                })
                .then(response => {
                    if (response.data.error) {
                        this.$snotify.error(response.data.message, 'Erro')
                        return
                    }

                    this.getBalance(this.user.id)
                    this.getWallet(this.user.id)
                })
                .catch(error => {
                    this.$snotify.error('Falha ao realizar o depósito', 'Erro')
                    this.error = error
                })
                .finally(() => {
                    this.closeModalTransaction('modal-deposit')
                })
        },

        saveTransfer() {
            if (!this.selected || this.selected == '') {
                this.$snotify.warning('Informe o cliente para transferência', 'Atenção')
                return
            }

            if (!this.transfer.amount || this.transfer.amount == '0,00') {
                this.$snotify.warning('Informe o valor da transferência', 'Atenção')
                return
            }

            let amount = this.transfer.amount.replace('.', '').replace(',', '.')

            if (parseFloat(amount) > parseFloat(this.balance)) {
                this.$snotify.warning('Saldo insuficiente', 'Atenção')
                return
            }

            let data = {
                'transaction': 2,
                'amount': amount,
                'user_destination_id': this.selected
            }

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token
            axios({
                    url: API_BASE_URL + '/wallet/' + this.user.id,
                    data: data,
                    method: 'PATCH'
                })
                .then(response => {
                    if (response.data.error) {
                        this.$snotify.error(response.data.message, 'Erro')
                        return
                    }

                    this.getBalance(this.user.id)
                    this.getWallet(this.user.id)
                })
                .catch(error => {
                    this.$snotify.error('Falha ao realizar a transferência', 'Erro')
                    this.error = error
                })
                .finally(() => {
                    this.closeModalTransaction('modal-transfer')
                })
        },

        saveWithdraw() {
            if (!this.withdraw.amount || this.withdraw.amount == '0,00') {
                this.$snotify.warning('Informe o valor do saque', 'Atenção')
                return
            }

            let amount = this.withdraw.amount.replace('.', '').replace(',', '.')

            if (parseFloat(amount) > parseFloat(this.balance)) {
                this.$snotify.warning('Saldo insuficiente', 'Atenção')
                return
            }

            let data = {
                'transaction': 5,
                'amount': amount
            }

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token
            axios({
                    url: API_BASE_URL + '/wallet/' + this.user.id,
                    data: data,
                    method: 'PATCH'
                })
                .then(response => {
                    if (response.data.error) {
                        this.$snotify.error(response.data.message, 'Erro')
                        return
                    }

                    this.getBalance(this.user.id)
                    this.getWallet(this.user.id)
                })
                .catch(error => {
                    this.$snotify.error('Falha ao realizar o saque', 'Erro')
                    this.error = error
                })
                .finally(() => {
                    this.closeModalTransaction('modal-withdraw')
                })
        },

        toBRLCurrency(amount) {
            return (parseFloat(amount)).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            })
        },

        toBRLDate(date) {
            return (new Date(date).toLocaleDateString('pt-BR', {
                hour: 'numeric',
                minute: 'numeric'
            }))
        },

        openModalReceipt(item) {
            this.receipt = item
            this.$refs['modal-receipt'].show()
        },

        closeModalReceipt() {
            this.$refs['modal-receipt'].hide()
        },

        openModalTransaction(ref) {
            this.$refs[ref].show()
        },

        closeModalTransaction(ref) {
            switch (ref) {
                case 'modal-deposit':
                    this.deposit.amount = '0,00'
                    break;
                case 'modal-transfer':
                    this.transfer.amount = '0,00'
                    this.selected = ''
                    break;
                case 'modal-withdraw':
                    this.withdraw.amount = '0,00'
                    break;
            }
            this.$refs[ref].hide()
        },

        showModal(refs) {
            this.$refs[refs].show()
        },

        hideModal(refs) {
            this.$refs[refs].hide()
        },

        getClient(id) {
            let client = this.walletUsers.find(x => x.id == id)
            return (`${client.name} Ag: ${client.agency} - Cta: ${client.account}`)
        }
    }
}