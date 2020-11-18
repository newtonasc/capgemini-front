<template>
    <b-container fluid="md">
        <div class="content-title">
            <b-row>
                <b-col>
                    <div v-if="loadingUser" class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <h4 class="title-login text-primary">
                        {{pageTitle}}
                    </h4>
                </b-col>
                <b-col class="text-right">
                    <b-button variant="outline-danger" class="btn-sm" title="Sair da conta" @click="logout()"><i
                            class="fas fa-sign-out-alt"></i></b-button>
                </b-col>
            </b-row>
        </div>

        <div class="content-account">
            <div class="content-wallet float-left">
                <div v-if="loadingWallet" class="spinner-border text-warning" role="status">
                </div>
                <div v-else>
                    <div class="wallet">
                        <table class="table table-hover">
                            <thead>
                                <th>Ordem</th>
                                <th>Data</th>
                                <th>Transação</th>
                                <th>Valor</th>
                                <th>Saldo</th>
                                <th>Ação</th>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in wallet" :key="index"
                                    :class="(item.type_id == 4 || item.type_id == 3) ? 'credit' : 'debit'">
                                    <td>{{index + 1}}</td>
                                    <td>{{toBRLDate(item.transaction_date)}}</td>
                                    <td>{{item.description}}</td>
                                    <td class="text-right">{{toBRLCurrency(item.amount)}}</td>
                                    <td class="text-right">{{toBRLCurrency(item.balance)}}</td>
                                    <td>
                                        <b-button variant="outline-dark" class="btn-sm" title="Comprovante"
                                            @click="openModalReceipt(item)"><i class="fas fa-receipt text-dark"></i>
                                        </b-button>
                                    </td>
                                </tr>
                                <tr v-if="wallet.length == 0">
                                    <td colspan="6" class="text-center">Nenhuma movimentação na conta do usuário.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="content-options float-right">
                <div class="content-balance">
                    <b>Agência:</b> {{user.agency}} <br> <b>Conta</b>: {{user.account}}

                    <div><b>Saldo</b>
                        <div class="balance text-center">
                            <div v-if="loadingBalance" class="spinner-border text-success" role="status">
                            </div>
                            <div v-else class="text-right">
                                {{toBRLCurrency(balance)}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-menu">
                    <b-row>
                        <b-col>
                            <b-button variant="outline-success" class="btn-sm"
                                @click="openModalTransaction('modal-deposit')">Deposito em
                                Conta</b-button>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-button :disabled="balance == 0" variant="outline-warning" class="btn-sm"
                                @click="openModalTransaction('modal-transfer')"
                                :title="(balance == 0) ? 'Saldo insuficiente' : ''">
                                Transferência</b-button>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-button :disabled="balance == 0" variant="outline-danger" class="btn-sm"
                                @click="openModalTransaction('modal-withdraw')"
                                :title="(balance == 0) ? 'Saldo insuficiente' : ''">Realizar
                                Saque</b-button>
                        </b-col>
                    </b-row>
                </div>
            </div>
        </div>

        <b-modal size="lg" ref="modal-receipt" hide-footer title="Comprovante da Transação">
            <div class="d-block text-center">
                <table class="table">
                    <tbody>
                        <tr>
                            <td><b>Data</b></td>
                            <td class="text-right">{{toBRLDate(receipt.transaction_date)}}</td>
                        </tr>
                        <tr v-if="receipt.type_id == 2">
                            <td><b>Destinatário</b></td>
                            <td class="text-right">{{getClient(receipt.user_destination_id)}}</td>
                        </tr>
                        <tr v-if="receipt.type_id == 3">
                            <td><b>Remetente</b></td>
                            <td class="text-right">{{getClient(receipt.user_destination_id)}}</td>
                        </tr>
                        <tr>
                            <td><b>Valor</b></td>
                            <td class="text-right">{{toBRLCurrency(receipt.amount)}}</td>
                        </tr>
                        <tr>
                            <td><b>Transação</b></td>
                            <td class="text-right">{{receipt.description}}</td>
                        </tr>
                        <tr>
                            <td><b>Id da transação</b></td>
                            <td class="text-right">{{receipt.transaction_id}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <b-button class="mt-3 float-right" variant="outline-danger" @click="closeModalReceipt()">Fechar
            </b-button>
        </b-modal>

        <b-modal ref="modal-deposit" hide-footer title="Deposito em Conta">
            <div>
                <template>
                    <div>
                        <b-form class="text-right">
                            <div class="col-auto">
                                <label class="sr-only text-left" for="amountDeposit">Valor do depósito</label>
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">R$</div>
                                    </div>
                                    <input type="text" id="amountDeposit" class="text-right form-control" maxlength="10"
                                        v-money="deposit.amount" v-model="deposit.amount" placeholder="Valor" />
                                </div>
                            </div>

                            <b-button type="button" variant="primary" @click="saveDeposit()">Confirmar</b-button>
                            &nbsp;
                            <b-button type="button" variant="danger" @click="closeModalTransaction('modal-deposit')">
                                Cancelar</b-button>
                        </b-form>
                    </div>
                </template>
            </div>
        </b-modal>

        <b-modal ref="modal-transfer" hide-footer title="Transferência Bancária">
            <div>
                <template>
                    <div>
                        <b-form class="text-right">
                            <div class="col-auto text-left">
                                <label class="text-left" for="amountTransfer">Cliente</label>
                                <select v-model="selected" class="form-control">
                                    <option v-for="(option, index) in walletUsers" v-bind:value="option.id"
                                        :key="index">
                                        {{ `${option.name} (Ag: ${option.agency} - Cta: ${option.account})` }}
                                    </option>
                                </select>
                            </div>
                            <br>
                            <div class="col-auto">
                                <label class="sr-only text-left" for="amountTransfer">Valor do depósito</label>
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">R$</div>
                                    </div>
                                    <input type="text" id="amountTransfer" class="text-right form-control"
                                        maxlength="10" v-money="transfer.amount" v-model="transfer.amount"
                                        placeholder="Valor" />
                                </div>
                            </div>
                            <br>
                            <b-button type="button" variant="primary" @click="saveTransfer()">Confirmar</b-button>
                            &nbsp;
                            <b-button type="button" variant="danger" @click="closeModalTransaction('modal-transfer')">
                                Cancelar</b-button>
                        </b-form>
                    </div>
                </template>
            </div>
        </b-modal>

        <b-modal ref="modal-withdraw" hide-footer title="Realizar Saque">
            <div>
                <template>
                    <div>
                        <b-form class="text-right">
                            <div class="col-auto">
                                <label class="sr-only text-left" for="amountWithdraw">Valor do depósito</label>
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">R$</div>
                                    </div>
                                    <input type="text" id="amountWithdraw" class="text-right form-control"
                                        maxlength="10" v-money="withdraw.amount" v-model="withdraw.amount"
                                        placeholder="Valor" />
                                </div>
                            </div>

                            <b-button type="button" variant="primary" @click="saveWithdraw()">Confirmar</b-button>
                            &nbsp;
                            <b-button type="button" variant="danger" @click="closeModalTransaction('modal-withdraw')">
                                Cancelar</b-button>
                        </b-form>
                    </div>
                </template>
            </div>
        </b-modal>
        <vue-snotify></vue-snotify>
    </b-container>
</template>
<script src="./Panel.js"></script>
<style lang="scss" src="./Panel.scss" scoped></style>