import CLogin from '@/components/login/Login.vue'

export default {
    name: 'page-login',

    components: {
        'component-login': CLogin
    },

    data() {
        return {
            users: {},
            pageTitle: 'CAPGEMINI',
        }
    },

    created() {
        this.users = [{
                id: 1,
                name: 'Olivia Flávia Márcia Figueiredo',
                agency: '0001',
                account: '123654',
                password: 'password',
                action: `<button class="btn btn-primary btn-sm">Login</button>`
            },
            {
                id: 2,
                name: 'Carlos Eduardo Enrico Silva',
                agency: '0001',
                account: '123984',
                password: 'password'
            },
            {
                id: 3,
                name: 'Silvana Bianca Maria Silveira',
                agency: '0002',
                account: '234123',
                password: 'password'
            },
            {
                id: 4,
                name: 'Felipe Diogo Cláudio Costa',
                agency: '0002',
                account: '234552',
                password: 'password'
            },
        ]
    },
}