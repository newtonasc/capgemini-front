<template>
    <b-container class="bv-example-row">
        <table class="table table-hover">
            <thead class="thead-dark">
                <tr>
                    <th>Id</th>
                    <th>Nome</th>
                    <th>Agência</th>
                    <th>Conta</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in users" :key="index">
                    <td>{{user.id}}</td>
                    <td>{{user.name}}</td>
                    <td>{{user.agency}}</td>
                    <td>{{user.account}}</td>
                    <td>
                        <b-button variant="outline-primary" class="btn-sm" title="Entrar na conta"
                            @click="login(index)"><i class="fas fa-sign-in-alt"></i></b-button>
                    </td>
                </tr>
            </tbody>
        </table>
    </b-container>
</template>
<script src="./Login.js"></script>