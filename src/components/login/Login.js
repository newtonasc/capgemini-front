export default {
    name: 'c-login',

    props: {
        users: Array
    },

    data() {
        return {
            loginData: {
                agency: null,
                account: null,
                password: null
            },
            loading: false
        }
    },

    methods: {
        login(id) {
            let data = JSON.stringify(this.users[id])
            this.$store.dispatch('login', data)
                .then((response) => {
                    if (response.data.error) {
                        this.$snotify.error(response.data.message, 'Erro')
                        // console.log(response.data)
                        return
                    }

                    this.loading = false
                    this.$router.push('/')
                })
                .catch(error => {
                    this.$snotify.error('Dados de login incorretos', 'Erro')
                    console.log(error)
                })
                .finally(() => {
                    this.loading = false
                })
        }
    }
}