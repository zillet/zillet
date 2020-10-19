<template>
  <div class="w-full">
    <div class="card py-4">
      <div class="flex flex-row items-center justify-between">
        <h3 class="font-semibold text-xl">
          Staking
        </h3>
        <span
          class="text-xs italic text-left inline-block ml-2
            font-semibold align-middle text-gray-700 font-normal
            underline cursor-pointer hover:text-teal-500"
          @click="init()">
          <i
            class="eva eva-sync-outline relative font-bold"
            style="top:2px" />
          Refresh
        </span>
      </div>
      <div class="py-16 flex items-center justify-center">
        <div
          class="card border rounded-lg b-1 bg-gray-0 flex mx-4  flex-col items-center justify-center"
          style="max-width:250px; min-height:200px">
          <img
            :src="getImages('zil')"
            height="32px" 
            class="rounded"
            width="32px"
          >
          <div class="text-3xl font-bold mt-2">
            <span v-if="fetched">
              {{ totalReward*Math.pow(10,-12) | currency('', 2) }} 
            </span>
            <span v-else>
              ...
            </span>
          </div>
          
          <div class="">
            Unclaimed <b>ZIL</b> Reward.
          </div>
          <div class="flex flex-row items-center justify-between">
            <z-button
              class="rounded py-2 shadow-md ml-2 w-full mb-0"
              size="medium"
              :disabled="loading"
              :loading="loading && actionType =='claimReward'"
              @click="claimReward()">
              Claim Reward
            </z-button>
          </div>
        </div>
        <div
          class="card border rounded-lg b-1 bg-gray-0 flex mx-4 flex-row items-center justify-center"
          style=" min-height:200px">
          <div class="flex-col flex items-center justify-center">
            <img
              :src="getImages('zil')"
              height="32px" 
              class="rounded"
              width="32px"
            >
            <div class="text-3xl font-bold mt-2">
              <span v-if="fetched">
                {{ totalZilStaked*Math.pow(10,-12) | currency('', 2) }} 
              </span>
              <span v-else>
                ...
              </span>
            </div>
            <div class="">
              Staked <b>ZIL</b> tokens<span v-if="myStakes.length > 1">
                delegated to {{ myStakes.length }}  seed nodes
              </span>.
            </div>
            <div class="flex flex-row items-center justify-between">
              <z-button
                class="rounded py-2 mr-2 w-40 mb-0"
                type="default"
                size="medium"
                :disabled="loading"
                :loading="loading && actionType =='unstake'"
                @click="showUnstakeModal=true">
                Unstake
              </z-button>
              <z-button
                class="rounded py-2 shadow-md ml-2 w-40 mb-0"
                size="medium"
                :disabled="loading"
                :loading="loading && actionType =='stake'"
                @click="showStakeModal=true">
                Stake
              </z-button>
            </div>
          </div>
          <div
            v-if="totalPendingWithdrawls > 0"
            class="flex-col flex items-center justify-center ml-4 border-dashed border-solid border-l-2 border-gray-500 pl-4"
          >
            <img
              :src="getImages('zil')"
              height="32px" 
              class="rounded"
              width="32px"
            >
            <div class="mt-2">
              <span class="text-3xl font-bold">{{ avlWithdrawals*Math.pow(10, -12) }} </span>/ 
              {{ totalPendingWithdrawls*Math.pow(10, -12) }}
            </div>
            <div class="">
              Available for withdrawal
            </div>
            <div class="flex flex-row items-center justify-between">
              <z-button
                class="rounded py-2 shadow-md ml-2 w-full mb-0"
                size="medium"
                :disabled="loading || avlWithdrawals < 1"
                :loading="loading && actionType =='completeWithdrawal'"
                @click="completeWithdrawal()">
                Withdraw
              </z-button>
            </div>
          </div>
        </div>
      <!-- {{ ssnlist }} -->
      </div>
      <Stake
        :visible="showStakeModal"
        :ssnlist="ssnlist"
        :loading="loading"
        :min-stake="minStake"
        :error-msg="errorMsg"
        @stake="stake"
        @close="showStakeModal=false" />
      <Unstake
        :visible="showUnstakeModal"
        :my-stakes="myStakes"
        :loading="loading"
        :error-msg="errorMsg"
        :bnum-req="bnumReq"
        :deposit-amt-deleg="depositAmtDeleg"
        @unstake="unstake"
        @close="showUnstakeModal=false" />
      <RewardClaim
        :visible="showRewardClaimModal"
        :my-stakes="myStakes"
        :loading="loading"
        :error-msg="errorMsg"
        @claim="claimReward"
        @close="showRewardClaimModal=false" />
      <Broadcasted
        :visible="isBroadcast"
        :tranx-id="tranxId"
        @close="isBroadcast=false" />
    </div>
  </div>
</template>
<script>
import config from '@/config';
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';
import { getImages } from '@/utils';
import { BN, Long, validation, units } from '@zilliqa-js/util';
import { util, Transaction } from '@zilliqa-js/account';
import ZilliqaHW from '@/utils/ledger';
import { get_rewards } from '@/utils/rewardCalculator';
import {
  fromBech32Address,
  isValidChecksumAddress,
  toChecksumAddress,
  sign
} from '@zilliqa-js/crypto';
import Stake from '@/components/staking/Stake.vue';
import Unstake from '@/components/staking/Unstake.vue';
import RewardClaim from '@/components/staking/RewardClaim.vue';

import Broadcasted from '@/components/send/Broadcasted';

const STAKING = config.STAKING;
export default {
  name: 'Staking',
  middleware: 'ifKeyExists',
  components: {
    Stake,
    Broadcasted,
    Unstake,
    RewardClaim
  },
  data() {
    return {
      depositAmtDeleg: {},
      isBroadcast: false,
      actionType: '',
      tranxId: '',
      showStakeModal: false,
      showUnstakeModal: false,
      showRewardClaimModal: false,
      ssnlist: {},
      loading: false,
      fetched: false,
      errorMsg: '',
      myStakes: [],
      pendingWithdrawals: {},
      bnumReq: 50,
      currentMiniEpoch: 0,
      minStake: 100,
      contractInstances: {
        proxy: {},
        ssnlist: {},
        gzil: {}
      }
    };
  },
  computed: {
    ...mapGetters(['Prices', 'Balance', 'Account']),
    ...mapState({
      accessType: state => state.accessType,
      selectedNode: state => state.selectedNode
    }),
    totalZilStaked() {
      let total = 0;
      for (let index = 0; index < this.myStakes.length; index++) {
        const element = this.myStakes[index];
        total = total + parseInt(element.amount);
      }
      return total;
    },
    totalPendingWithdrawls() {
      let total = 0;
      const pWith = this.pendingWithdrawals[this.Account.address.toLowerCase()];
      for (const key in pWith) {
        total = total + pWith[key];
      }
      return total;
    },
    avlWithdrawals() {
      let total = 0;
      const pWith = this.pendingWithdrawals[this.Account.address.toLowerCase()];
      for (const key in pWith) {
        if (this.currentMiniEpoch - parseInt(key) > this.bnumReq) {
          total = total + pWith[key];
        }
      }
      return total;
    },
    totalReward() {
      let total = 0;
      for (let index = 0; index < this.myStakes.length; index++) {
        const element = this.myStakes[index];
        console.log(element.myReward);
        total = total + parseFloat(element.myReward);
      }
      return total;
    }
  },
  async mounted() {
    await this.init();
  },
  methods: {
    ...mapActions(['sendTransaction']),
    ...mapMutations(['updateBalance', 'saveTxn']),
    getImages,
    async init() {
      this.fetched = false;
      const networkType = this.selectedNode.id == 1 ? 'mainet' : 'testnet';
      const address =
        this.Account.address && this.Account.address.toLowerCase();
      if (networkType == 'mainet') {
        this.contractInstances.proxy = this.$zillet.contracts.at(
          STAKING.testnet.proxy
        );
        this.contractInstances.ssnlist = this.$zillet.contracts.at(
          STAKING.testnet.ssnlist
        );
        this.contractInstances.gzil = this.$zillet.contracts.at(
          STAKING.testnet.gzil
        );
      } else {
        this.contractInstances.proxy = this.$zillet.contracts.at(
          STAKING.testnet.proxy
        );
        this.contractInstances.ssnlist = this.$zillet.contracts.at(
          STAKING.testnet.ssnlist
        );
        this.contractInstances.gzil = this.$zillet.contracts.at(
          STAKING.testnet.gzil
        );
      }
      // Fetching SSN list
      const { ssnlist } = await this.contractInstances.ssnlist.getSubState(
        'ssnlist',
        []
      );
      this.ssnlist = ssnlist;
      // Total amount delegated by user
      try {
        const {
          deposit_amt_deleg
        } = await this.contractInstances.ssnlist.getSubState(
          'deposit_amt_deleg',
          [address]
        );
        this.depositAmtDeleg = deposit_amt_deleg;
      } catch (error) {}

      // Calculating rewards
      const myStakes = this.depositAmtDeleg[this.Account.address.toLowerCase()];
      const delegations = [];
      for (const key in myStakes) {
        const ssn = this.ssnlist[key].arguments;
        const myReward = await get_rewards(
          this.contractInstances.ssnlist,
          key.toLowerCase(), // Delegated to
          this.Account.address.toLowerCase()
        );
        delegations.push({
          name: ssn[3],
          stakingUrl: ssn[4],
          commision: ssn[7] * Math.pow(10, -7),
          address: key,
          amount: myStakes[key],
          myReward: myReward.toString()
        });
      }
      this.myStakes = delegations;

      // Pending withdrawals
      try {
        const {
          withdrawal_pending
        } = await this.contractInstances.ssnlist.getSubState(
          'withdrawal_pending',
          [address]
        );
        this.pendingWithdrawals = withdrawal_pending;
      } catch (error) {
        this.pendingWithdrawals = {};
      }
      // Min amount for staking
      const minDelegateAmount = await this.contractInstances.ssnlist.getSubState(
        'mindelegstake',
        []
      );
      this.minStake = minDelegateAmount.mindelegstake;
      // No. of confirmation needed for withdrawls
      const { bnum_req } = await this.contractInstances.ssnlist.getSubState(
        'bnum_req',
        []
      );
      this.bnumReq = parseInt(bnum_req);
      const bInfo = await this.$zillet.blockchain.getBlockChainInfo();
      this.currentMiniEpoch = parseInt(bInfo.result.CurrentMiniEpoch);
      this.fetched = true;
    },
    async updateWallet() {
      let balance = await this.$zillet.blockchain.getBalance(
        this.Account.address
      );
      let localNonce = 0;
      try {
        let accountNonce = JSON.parse(localStorage.getItem('_local_nonces'));
        if (accountNonce[this.Account.address]) {
          if (
            (+new Date() - accountNonce[this.Account.address]['lastUpdated']) /
              (1000 * 60) <
            10
          ) {
            localNonce = accountNonce[this.Account.address]['nonce'];
          }
        }
      } catch (error) {
        console.warn(error);
      }
      if (localNonce > balance.result.nonce) {
        balance.result.nonce = localNonce;
      }
      this.updateBalance(balance.result);
    },
    async createTxn() {
      const VERSION = this.selectedNode.version;
      await this.updateWallet();
      const minGasPrice = await this.$zillet.blockchain.getMinimumGasPrice();
      const nonce = this.Account.nonce + 1;
      let txParams = {
        version: VERSION,
        nonce: nonce,
        pubKey: this.Account.publicKey,
        amount: new BN(0),
        gasPrice: new BN(minGasPrice.result),
        gasLimit: Long.fromNumber(25000)
      };
      return txParams;
    },
    async zilletContractTx(contractMethod, contractParams, txParams) {
      let sentTx = await this.contractInstances.proxy.callWithoutConfirm(
        contractMethod,
        contractParams,
        txParams,
        false
      );
      // console.log(sentTx);
      sentTx.TranID = sentTx.id;
      sentTx.Info = 'Transaction broadcasted';
      console.log(sentTx);
      this.txnDone(sentTx);
      sentTx.via = 'zillet';
      this.saveTxn(sentTx);
    },
    async zilpayContractTx(contractMethod, contractParams, txParams) {
      const zilliqa = window.zilPay;
      const contractAddress = this.contractInstances.proxy.address;
      const contract = zilliqa.contracts.at(contractAddress);
      let sentTx = await contract.call(
        contractMethod,
        contractParams,
        txParams
      );
      this.txnDone(sentTx);
      sentTx.type = 'contract';
      sentTx.via = 'zilpay';
      this.saveTxn(sentTx);
      this.loading = false;
    },
    async ledgerContractTx(contractMethod, contractParams, txParams) {
      const transport = await ZilliqaHW.create();
      const ledgerZil = new ZilliqaHW(transport);
      const hwIndex = this.Account.index;
      const contractAddress = this.contractInstances.proxy.address;
      const cParams = {
        _tag: contractMethod,
        params: contractParams
      };
      txParams.toAddr = contractAddress;
      txParams.priority = true;
      let raw_tx = new Transaction(
        {
          ...txParams,
          data: JSON.stringify(cParams)
        },
        false
      );
      const { data, code } = raw_tx;
      txParams.data = data;
      txParams.code = code;
      try {
        const signature = await ledgerZil.signTxn(hwIndex, txParams);
        const signedTx = {
          ...txParams,
          amount: txParams.amount.toString(),
          gasPrice: txParams.gasPrice.toString(),
          gasLimit: txParams.gasLimit.toString(),
          signature
        };
        const { result } = await this.sendTransaction(signedTx);
        signedTx.TranID = result.TranID;
        signedTx.Info = 'Transaction broadcasted';
        this.txnDone(signedTx);
        signedTx.via = 'zillet';
        signedTx.rawTx = raw_tx;
        this.saveTxn(signedTx);
      } catch (error) {
        this.loading = false;
        return this.$notify({
          message: `Something went wrong${JSON.stringify(error)}`,
          type: 'danger'
        });
      }
    },
    txnDone(result) {
      this.loading = false;
      if ('Error' in result) {
        return this.$notify({
          message: result.Error,
          type: 'danger'
        });
      } else {
        this.isBroadcast = true;
        this.tranxId = result.TranID;
        return this.$notify({
          message: result.Info,
          type: 'success'
        });
      }
    },
    async stake(amount, ssn) {
      this.actionType = 'stake';
      this.loading = true;
      let actualAmount = units.toQa(amount, units.Units.Zil);
      if (parseInt(actualAmount.toString()) < parseInt(this.minStake)) {
        this.errorMsg = `Stake amount should be greater then ${this.minStake *
          Math.pow(10, -12)}`;
        this.loading = false;
        return this.$notify({
          message: this.errorMsg,
          type: 'danger'
        });
      }
      let txParams = await this.createTxn();
      txParams.amount = new BN(actualAmount);
      const contractMethod = 'DelegateStake';
      const contractParams = [
        {
          vname: 'ssnaddr',
          type: 'ByStr20',
          value: `${toChecksumAddress(ssn)}`
        }
      ];
      /// .//////////////////////////
      if (this.accessType === 1004) {
        await this.zilpayContractTx(contractMethod, contractParams, txParams);
      } else if (this.accessType === 1006) {
        await this.ledgerContractTx(contractMethod, contractParams, txParams);
      } else {
        await this.zilletContractTx(contractMethod, contractParams, txParams);
      }
      this.loading = false;
      this.showStakeModal = false;
      this.errorMsg = '';
    },
    async unstake(amount, ssnAddr) {
      console.log(`Unstaking ${amount} ZILs`);
      this.errorMsg = '';
      this.loading = true;
      const myAddr = this.Account.address.toLowerCase();
      const {
        lastrewardcycle
      } = await this.contractInstances.ssnlist.getSubState(
        'lastrewardcycle',
        []
      );
      const {
        last_withdraw_cycle_deleg
      } = await this.contractInstances.ssnlist.getSubState(
        'last_withdraw_cycle_deleg',
        [this.Account.address.toLowerCase()]
      );
      if (last_withdraw_cycle_deleg[myAddr][ssnAddr] < lastrewardcycle) {
        this.loading = false;
        this.showUnstakeModal = false;
        this.errorMsg = 'You need to claim your rewards first.';
        return this.$notify({
          message: this.errorMsg,
          type: 'danger'
        });
      }
      const {
        buff_deposit_deleg
      } = await this.contractInstances.ssnlist.getSubState(
        'buff_deposit_deleg',
        [this.Account.address.toLowerCase()]
      );
      let biggestBuffDeposit = 0;
      for (const key in buff_deposit_deleg[myAddr][ssnAddr]) {
        if (key > biggestBuffDeposit) {
          biggestBuffDeposit = key;
        }
      }
      if (!(lastrewardcycle > biggestBuffDeposit)) {
        this.loading = false;
        this.errorMsg = `You have buffered deposits in the selected node. 
          Please wait for the next cycle before withdrawing the staked amount.`;
        return this.$notify({
          message: this.errorMsg,
          type: 'danger'
        });
      }
      this.actionType = 'unstake';
      let txParams = await this.createTxn();
      const contractMethod = 'WithdrawStakeAmt';
      let actualAmount = units.toQa(amount, units.Units.Zil);
      const contractParams = [
        {
          vname: 'ssnaddr',
          type: 'ByStr20',
          value: `${toChecksumAddress(ssnAddr)}`
        },
        {
          vname: 'amt',
          type: 'Uint128',
          value: `${actualAmount.toString()}`
        }
      ];
      if (this.accessType === 1004) {
        await this.zilpayContractTx(contractMethod, contractParams, txParams);
      } else if (this.accessType === 1006) {
        this.ledgerContractTx(contractMethod, contractParams, txParams);
      } else {
        this.zilletContractTx(contractMethod, contractParams, txParams);
      }
      this.showUnstakeModal = false;
    },
    async completeWithdrawal() {
      this.loading = true;
      this.actionType = 'completeWithdrawal';
      let txParams = await this.createTxn();
      const contractMethod = 'CompleteWithdrawal';
      const contractParams = [];
      if (this.accessType === 1004) {
        await this.zilpayContractTx(contractMethod, contractParams, txParams);
      } else if (this.accessType === 1006) {
        this.ledgerContractTx(contractMethod, contractParams, txParams);
      } else {
        this.zilletContractTx(contractMethod, contractParams, txParams);
      }
    },
    async claimReward(ssn) {
      console.log(`Claiming reward...`);
      this.actionType = 'claimReward';
      if (this.myStakes.length === 1 || ssn) {
        const ssnAddr =
          this.myStakes.length === 1 ? this.myStakes[0].address : ssn;
        this.loading = true;
        let txParams = await this.createTxn();
        const contractMethod = 'WithdrawStakeRewards';
        const contractParams = [
          {
            vname: 'ssnaddr',
            type: 'ByStr20',
            value: `${toChecksumAddress(ssnAddr)}`
          }
        ];
        if (this.accessType === 1004) {
          await this.zilpayContractTx(contractMethod, contractParams, txParams);
        } else if (this.accessType === 1006) {
          this.ledgerContractTx(contractMethod, contractParams, txParams);
        } else {
          this.zilletContractTx(contractMethod, contractParams, txParams);
        }
        this.showRewardClaimModal = false;
      } else {
        this.showRewardClaimModal = true;
      }
    }
  }
};
</script>
