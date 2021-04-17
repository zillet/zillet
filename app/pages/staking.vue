<template>
  <div class="w-full">
    <div class="card py-4">
      <div class="flex flex-row items-center justify-between">
        <h3 class="font-semibold text-xl">
          Staking
        </h3>
        <span
          class="text-xs italic text-left inline-block ml-2  select-none 
             align-middle text-gray-700 font-normal
            underline cursor-pointer hover:text-teal-500"
          @click="init()">
          <i
            class="eva eva-sync-outline relative font-bold"
            style="top: 2px" />
          Refresh
        </span>
      </div>
      
      <div
        class="bg-gray-200  rounded my-4 p-2 px-4  text-left flex flex-row items-center justify-between">
        <div class="flex items-center">
          <i class="eva eva-info-outline text-xl mr-4" />
          <div>
            New to staking and need help? 
            <a
              class="text-primary"
              href="https://support.zillet.io/staking-on-zillet"
              target="_blank">Click here to learn about staking on Zillet</a>
          </div>
        </div>
        <!-- <i class="eva eva-close-outline cursor-pointer" /> -->
      </div>
      <div
        v-if="stats && stats.apy || fetched"
        class="card border rounded-lg b-1 my-8 mb-4 bg-gray-0 flex  p-4 
        flex-row  items-center justify-between mobile:flex-col"
      >
        <div class="flex-col text-left">
          <div>
            <span class="text-xl font-bold">{{ stats.apy }} %</span>
          </div>
          <div class="">
            Average APY
          </div>
        </div>
        <div class="flex-col text-left">
          <div>
            <span class="text-xl font-bold"> {{ stats.blocksLeft }}</span>
            (<span class="text-gray-700">ETA:</span> {{ timeConverter(stats.nextRewardTime) }} )
          </div>
          <div class="">
            Blocks until reward
          </div>
        </div>
        <div class="flex-col text-left">
          <div>
            <span
              v-if="Prices.ZIL && Prices.ZIL.USD"
              class="text-xl font-bold">{{ convertCurrency(stats.totalStaked) }}  </span>
            ZIL <span v-if="Prices.ZIL && Prices.ZIL.USD">≈ {{ convertCurrency(stats.totalStaked* Prices.ZIL.USD) }} USD</span>
            <!-- {{ stats.totalStaked* Prices.ZIL.USD }} -->
            <!-- (<span class="text-gray-700">ETA:</span> {{ timeConverter(stats.nextRewardTime) }} ) -->
          </div>
          <div class="">
            Total Staked
          </div>
        </div>
        <div class="flex-col text-left">
          <div>
            <span class="text-xl font-bold">{{ stats.gZilLeft }} % </span>
          </div>
          <div class="">
            gZIL Left
          </div>
        </div>
      </div>
      <div
        v-if="totalPendingWithdrawls > 0"
        class="card border border-primary rounded-lg b-1 my-8 mb-4 bg-gray-0 flex  p-4 
        flex-row  items-center justify-between mobile:flex-col"
      >
        <div class="flex-col text-left">
          <div>
            <span class="text-2xl font-bold">{{ avlWithdrawals*Math.pow(10, -12) }} </span>/ 
            {{ totalPendingWithdrawls*Math.pow(10, -12) }}
            ZIL
          </div>
          <div class="">
            Available for withdrawal
          </div>
        </div>
        <div class="flex-col text-left">
          <div>
            <span class="text-2xl font-bold">{{ confNeeded > -1 ? confNeeded: '...' }} </span>/ 
            {{ bnumReq }}
          </div>
          <div class="">
            Min block confirmations needed
          </div>
        </div>
        <div class="flex flex-row items-center justify-between">
          <z-button
            class="rounded py-2 shadow-md ml-2 w-full "
            size="medium"
            :disabled="loading || avlWithdrawals < 1"
            :loading="loading && actionType =='completeWithdrawal'"
            @click="completeWithdrawal()">
            Withdraw
          </z-button>
        </div>
      </div>
      <div
        class="py-8 flex items-center justify-center mobile:flex-wrap"
        :class="{'pt-0': totalPendingWithdrawls > 1}">
        <div
          class="card border rounded-lg b-1 bg-gray-0 flex mobile:mb-4  flex-col items-center justify-center"
          style="max-width: 300px;">
          <!-- <div class="flex items-center justify-center">
            <img
              :src="getImages('zil')"
              height="24px" 
              class="rounded"
              width="24px"
            >
            <span
              v-if="fetched"
              class="text-2xl font-bold ml-2">
              {{ totalReward*Math.pow(10,-12) | currency('', 2) }} 
              <span class="text-base font-normal text-gray-700">
                ZIL
              </span>
            </span>
            <span
              v-else
              class="text-2xl font-bold ml-2">
              ...
            </span>
            <span class="text-2xl font-semibold mx-2">
              +
            </span>
            <img
              :src="getImages('gzil')"
              height="32px" 
              class="rounded"
              width="32px"
            >
          </div> -->
          <div class="text-2xl font-bold mt-2">
            <span
              v-if="fetched">
              {{ totalReward*Math.pow(10,-12) | currency('', 2) }} 
              <span class="text-base font-normal text-gray-700">
                ZIL
              </span>
              <span class="text-xl font-semibold mx-1">
                +
              </span>
              {{ totalReward*Math.pow(10,-15) | currency('', 4) }} 
              <span class="text-base font-normal text-gray-700">
                gZIL
              </span>
            </span>
            <span v-else>
              <Loader class="my-2" />
            </span>
          </div>
          
          <div class="">
            Unclaimed reward
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
          class="card border rounded-lg b-1 bg-gray-0 flex ml-4 flex-row items-center justify-center"
        >
          <div class="flex-col flex items-center justify-center">
            <!-- <img
              :src="getImages('zil')"
              height="32px" 
              class="rounded"
              width="32px"
            > -->
            <div class="text-2xl font-bold mt-2">
              <span v-if="fetched">
                {{ totalZilStaked*Math.pow(10,-12) | currency('', 2) }} 
                <span class="text-base font-normal text-gray-700">
                  ZIL
                </span>
              </span>
              <span v-else>
                <Loader class="my-2" />
              </span>
            </div>
            <span>
              Delegated to {{ myStakes.length > 0 ? myStakes.length : '...' }}  seed nodes
            </span>
            <div class="flex flex-row items-center justify-between mobile:flex-wrap mobile:justify-center">
              <z-button
                class="rounded py-2 mr-2 w-32 mb-0"
                type="default"
                size="medium"
                :disabled="loading"
                :loading="loading && actionType =='unstake'"
                @click="showUnstakeModal=true">
                Unstake
              </z-button>
              <z-button
                class="rounded py-2 mr-2 mb-0 border-primary"
                type="default"
                size="medium"
                :disabled="loading"
                :loading="loading && actionType =='transfer'"
                @click="showTransferStakeModal=true">
                Transfer Stake
              </z-button>
              <z-button
                class="rounded py-2 shadow-md ml-2 w-40 mb-0 border-primary"
                size="medium"
                :disabled="loading"
                :loading="loading && actionType =='stake'"
                @click="showStakeModal=true">
                Stake
              </z-button>
            </div>
          </div>
        </div>
      <!-- {{ ssnlist }} -->
      </div>
      <Stake
        :key="`stake${showStakeModal}`"
        :visible="showStakeModal"
        :ssnlist="ssnlist"
        :loading="loading"
        :min-stake="minStake"
        :error-msg="errorMsg"
        @stake="stake"
        @close="showStakeModal=false; errorMsg=''" />
      <TransferStake
        :key="`transfer${showTransferStakeModal}`"
        :visible="showTransferStakeModal"
        :ssnlist="ssnlist"
        :loading="loading"
        :my-stakes="myStakes"
        :error-msg="errorMsg"
        @transfer="transfer"
        @close="showTransferStakeModal=false; errorMsg=''" />
      <Unstake
        :key="`unstake${showUnstakeModal}`"
        :visible="showUnstakeModal"
        :my-stakes="myStakes"
        :loading="loading"
        :error-msg="errorMsg"
        :bnum-req="bnumReq"
        @unstake="unstake"
        @close="showUnstakeModal=false; errorMsg=''" />
      <RewardClaim
        :key="`reward${showRewardClaimModal}`"
        :visible="showRewardClaimModal"
        :my-stakes="myStakes"
        :loading="loading"
        :error-msg="errorMsg"
        @claim="claimReward"
        @close="showRewardClaimModal=false; errorMsg=''" />
      <Broadcasted
        :visible="isBroadcast"
        :tranx-id="tranxId"
        @close="isBroadcast=false" />
    </div>
  </div>
</template>
<script>
import config from '@/config.json';
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
import TransferStake from '@/components/staking/TransferStake.vue';

import Broadcasted from '@/components/send/Broadcasted';

const STAKING = config.STAKING;
export default {
  name: 'Staking',
  middleware: 'ifKeyExists',
  components: {
    Stake,
    Broadcasted,
    Unstake,
    RewardClaim,
    TransferStake
  },
  data() {
    return {
      isBroadcast: false,
      actionType: '',
      tranxId: '',
      showStakeModal: false,
      showTransferStakeModal: false,
      showUnstakeModal: false,
      showRewardClaimModal: false,
      ssnlist: {},
      loading: false,
      fetched: false,
      errorMsg: '',
      myStakes: [],
      stats: {},
      pendingWithdrawals: {},
      bnumReq: 50,
      currentMiniEpoch: 0,
      minStake: 100,
      tId: null,
      lastrewardcycle: 0,
      last_withdraw_cycle_deleg: {},
      direct_deposit_deleg: {},
      buff_deposit_deleg: {},
      stake_ssn_per_cycle: {},
      deleg_stake_per_cycle: {},
      fetchedRewardCal: false,
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
      const pWith = this.pendingWithdrawals;
      for (const key in pWith) {
        total = Number(total) + Number(pWith[key]);
      }
      return total;
    },
    delegratedToOthers() {
      const found = this.myStakes.some(el => el.name.toLowerCase() != 'zillet');
      return found;
    },
    avlWithdrawals() {
      let total = 0;
      const pWith = this.pendingWithdrawals;

      for (const key in pWith) {
        if (this.currentMiniEpoch - parseInt(key) > this.bnumReq) {
          total = Number(total) + Number(pWith[key]);
        }
      }
      return total;
    },
    confNeeded() {
      let min = 0;
      const pWith = this.pendingWithdrawals;

      Object.entries(pWith).forEach(([key, value], index) => {
        if (index == 0) {
          min = this.currentMiniEpoch - parseInt(key);
        } else if (min > this.currentMiniEpoch - parseInt(key)) {
          min = this.currentMiniEpoch - parseInt(key);
        }
      });
      return min;
    },
    totalReward() {
      let total = 0;
      for (let index = 0; index < this.myStakes.length; index++) {
        const element = this.myStakes[index];
        total = total + parseFloat(element.myReward);
      }
      return total;
    }
  },
  watch: {
    'selectedNode.id': {
      handler(newValue, oldValue) {
        this.init();
      }
    }
  },
  beforeDestroy() {
    console.log(`destroying staking ... ${this.tId}`);
    if (this.tId) {
      clearInterval(this.tId);
    }
  },
  async mounted() {
    this.fetched = false;
    this.lastrewardcycle = localStorage.getItem('__lastrewardcycle') || 0;
    try {
      this.last_withdraw_cycle_deleg =
        JSON.parse(localStorage.getItem('__last_withdraw_cycle_deleg')) || {};
      this.direct_deposit_deleg =
        JSON.parse(localStorage.getItem('__direct_deposit_deleg')) || {};
      this.stake_ssn_per_cycle =
        JSON.parse(localStorage.getItem('__stake_ssn_per_cycle')) || {};
      this.buff_deposit_deleg =
        JSON.parse(localStorage.getItem('__buff_deposit_deleg')) || {};
      this.deleg_stake_per_cycle =
        JSON.parse(localStorage.getItem('__deleg_stake_per_cycle')) || {};
    } catch (error) {}
    this.fetchStats();
    await this.init();
    this.fetched = true;
  },
  methods: {
    ...mapActions(['sendTransaction']),
    ...mapMutations(['updateBalance', 'saveTxn']),
    getImages,
    async fetchStats() {
      try {
        let stats = await this.$axios.$get(`https://viewblock.zillet.io/stats`);
        console.log(stats.success);
        this.stats = stats.success;
      } catch (error) {
        console.log(error);
      }
    },
    async init() {
      if (this.tId) {
        clearInterval(this.tId);
      }
      this.$nuxt.$loading.start();
      const networkType = this.selectedNode.id == 1 ? 'mainnet' : 'testnet';
      const address =
        this.Account.address && this.Account.address.toLowerCase();
      if (networkType == 'mainnet') {
        this.contractInstances.proxy = this.$zillet.contracts.at(
          STAKING.mainnet.proxy
        );
        this.contractInstances.ssnlist = this.$zillet.contracts.at(
          STAKING.mainnet.ssnlist
        );
        this.contractInstances.gzil = this.$zillet.contracts.at(
          STAKING.mainnet.gzil
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

      // Pending withdrawals
      this.contractInstances.ssnlist
        .getSubState('withdrawal_pending', [address])
        .then(res => {
          if (
            res &&
            res.withdrawal_pending &&
            res.withdrawal_pending[address]
          ) {
            this.pendingWithdrawals = res.withdrawal_pending[address];
          }
        });
      // Min amount for staking
      this.contractInstances.ssnlist.getSubState('mindelegstake').then(res => {
        if (res && res.mindelegstake) {
          this.minStake = res.mindelegstake;
        }
      });
      // No. of confirmation needed for withdrawls
      this.contractInstances.ssnlist.getSubState('bnum_req', []).then(res => {
        if (res && res.bnum_req) {
          this.bnumReq = parseInt(res.bnum_req);
        }
      });
      this.$zillet.blockchain.getBlockChainInfo().then(res => {
        if (res && res.result && res.result.CurrentMiniEpoch) {
          this.currentMiniEpoch = parseInt(res.result.CurrentMiniEpoch);
        }
      });
      // Fetching SSN list
      const { ssnlist } = await this.contractInstances.ssnlist.getSubState(
        'ssnlist',
        []
      );
      this.ssnlist = ssnlist;
      let depositAmtDeleg = {};
      try {
        const {
          deposit_amt_deleg
        } = await this.contractInstances.ssnlist.getSubState(
          'deposit_amt_deleg',
          [address]
        );
        depositAmtDeleg = deposit_amt_deleg;
      } catch (error) {
        console.log('No ZIL delegated');
      }
      // Total amount delegated by user
      if (depositAmtDeleg[address]) {
        this.fetchedRewardCal = false;
        const myStakes = depositAmtDeleg[address];
        const delegations = [];
        for (const key in myStakes) {
          const ssn = this.ssnlist[key].arguments;
          const myReward = await this.fetchReward(
            key.toLowerCase(), // Delegated to
            address
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
      } else {
        this.myStakes = [];
      }
      this.$nuxt.$loading.finish();
      if (this.Account.address && this.$route.name == 'staking') {
        this.tId = setTimeout(() => {
          this.init();
          this.fetchStats();
        }, 600000);
      }
    },
    async fetchReward(ssnaddr, delegator) {
      const {
        lastrewardcycle
      } = await this.contractInstances.ssnlist.getSubState(
        'lastrewardcycle',
        []
      );
      let currentTime = new Date().getTime();
      let lastClaimedAt = localStorage.getItem('__rewards_claimed_at') || 0;
      var seconds = parseInt((currentTime - lastClaimedAt) / 1000);
      console.log(seconds);
      if (
        (Number(this.lastrewardcycle) < Number(lastrewardcycle) ||
          (seconds > 120 && seconds < 2400)) &&
        this.fetchedRewardCal === false
      ) {
        this.fetchedRewardCal = true;
        try {
          const {
            last_withdraw_cycle_deleg
          } = await this.contractInstances.ssnlist.getSubState(
            'last_withdraw_cycle_deleg',
            [delegator]
          );
          this.last_withdraw_cycle_deleg = last_withdraw_cycle_deleg;
          localStorage.setItem(
            '__last_withdraw_cycle_deleg',
            JSON.stringify(last_withdraw_cycle_deleg)
          );
        } catch (error) {
          console.error(error);
        }
        try {
          const {
            direct_deposit_deleg
          } = await this.contractInstances.ssnlist.getSubState(
            'direct_deposit_deleg',
            [delegator]
          );
          this.direct_deposit_deleg = direct_deposit_deleg;
          localStorage.setItem(
            '__direct_deposit_deleg',
            JSON.stringify(direct_deposit_deleg)
          );
        } catch (error) {
          console.error(error);
        }
        try {
          const {
            buff_deposit_deleg
          } = await this.contractInstances.ssnlist.getSubState(
            'buff_deposit_deleg',
            [delegator]
          );
          this.buff_deposit_deleg = buff_deposit_deleg;
          localStorage.setItem(
            '__buff_deposit_deleg',
            JSON.stringify(buff_deposit_deleg)
          );
        } catch (error) {
          console.error(error);
        }
        try {
          const {
            stake_ssn_per_cycle
          } = await this.contractInstances.ssnlist.getSubState(
            'stake_ssn_per_cycle',
            []
          );
          this.stake_ssn_per_cycle = stake_ssn_per_cycle;
          localStorage.setItem(
            '__stake_ssn_per_cycle',
            JSON.stringify(stake_ssn_per_cycle)
          );
        } catch (error) {
          console.error(error);
        }
        try {
          const {
            deleg_stake_per_cycle
          } = await this.contractInstances.ssnlist.getSubState(
            'deleg_stake_per_cycle',
            [delegator]
          );
          this.deleg_stake_per_cycle = deleg_stake_per_cycle;
          localStorage.setItem(
            '__deleg_stake_per_cycle',
            JSON.stringify(deleg_stake_per_cycle)
          );
        } catch (error) {
          console.error(error);
        }
        this.lastrewardcycle = lastrewardcycle;
        if (
          this.last_withdraw_cycle_deleg != null &&
          this.direct_deposit_deleg != null &&
          this.buff_deposit_deleg != null &&
          this.stake_ssn_per_cycle != null &&
          this.deleg_stake_per_cycle != null
        ) {
          localStorage.setItem('__lastrewardcycle', lastrewardcycle);
        }
        try {
          const reward = await get_rewards(
            ssnaddr,
            delegator,
            this.lastrewardcycle,
            this.last_withdraw_cycle_deleg,
            this.direct_deposit_deleg,
            this.buff_deposit_deleg,
            this.stake_ssn_per_cycle,
            this.deleg_stake_per_cycle
          );
          return reward;
        } catch (error) {
          return 0;
        }
      } else {
        try {
          const reward = await get_rewards(
            ssnaddr,
            delegator,
            this.lastrewardcycle,
            this.last_withdraw_cycle_deleg,
            this.direct_deposit_deleg,
            this.buff_deposit_deleg,
            this.stake_ssn_per_cycle,
            this.deleg_stake_per_cycle
          );
          return reward;
        } catch (error) {
          return 0;
        }
      }
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
      console.log(this.Account.balance * Math.pow(10, -12));
      if (this.Account.balance * Math.pow(10, -12) < 30) {
        throw Error(
          'Account balance is low, balance should be at least 30 ZIL.'
        );
      }
      let txParams = {
        version: VERSION,
        nonce: nonce,
        pubKey: this.Account.publicKey,
        amount: new BN(0),
        gasPrice: new BN(minGasPrice.result),
        gasLimit: Long.fromNumber(10000)
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
      try {
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
      } catch (error) {
        return this.$notify({
          message: error,
          type: 'danger'
        });
      }
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
          message: `Something went wrong ${JSON.stringify(error)}`,
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
        this.errorMsg = `Stake amount should be greater than ${this.minStake *
          Math.pow(10, -12)}.`;
        this.loading = false;
        return this.$notify({
          message: this.errorMsg,
          type: 'danger'
        });
      }
      let txParams = {};
      try {
        txParams = await this.createTxn();
      } catch (error) {
        this.loading = false;
        this.showStakeModal = false;
        return this.$notify({
          message: `${error}`,
          type: 'danger'
        });
      }
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
    async validateAmountRemove(amount, ssnAddr, action) {
      const myAddr = this.Account.address.toLowerCase();
      const amountInQa = units.toQa(amount, units.Units.Zil);
      if (!(amount > 0)) {
        this.loading = false;
        this.errorMsg = 'Amount should be greater than 0.';
        this.$notify({
          message: this.errorMsg,
          type: 'danger'
        });
        throw Error(this.errorMsg);
      }
      if (action === 'transfer' || action === 'unstake') {
        const ssn = this.myStakes.find(el => el.address === ssnAddr);
        const leftOverQa = ssn.amount - amountInQa;
        if (new BN(amountInQa).gt(new BN(ssn.amount))) {
          this.loading = false;
          this.errorMsg = `Invalid ${action} amount; you only have ${amount} ZIL to ${action}.`;
          this.$notify({
            message: this.errorMsg,
            type: 'danger'
          });
          throw Error(this.errorMsg);
        } else if (leftOverQa > 0 && leftOverQa <= this.minStake) {
          this.loading = false;
          this.errorMsg = `Invalid ${action} amount; please leave at least ${(
            this.minStake * Math.pow(10, -12)
          ).toFixed(2)} ZIL (min. stake amount) or ${action} ALL.`;
          this.$notify({
            message: this.errorMsg,
            type: 'danger'
          });
          throw Error(this.errorMsg);
        }
      }
      const {
        last_withdraw_cycle_deleg
      } = await this.contractInstances.ssnlist.getSubState(
        'last_withdraw_cycle_deleg',
        [myAddr]
      );
      const {
        lastrewardcycle
      } = await this.contractInstances.ssnlist.getSubState(
        'lastrewardcycle',
        []
      );
      // console.log(last_withdraw_cycle_deleg[myAddr][ssnAddr], lastrewardcycle);
      if (
        Number(last_withdraw_cycle_deleg[myAddr][ssnAddr]) <
        Number(lastrewardcycle)
      ) {
        const ssn = this.myStakes.find(item => item.address === ssnAddr);
        this.loading = false;
        this.showUnstakeModal = false;
        this.errorMsg = `You need to claim your ${ssn &&
          ssn.name} rewards first.`;
        this.$notify({
          message: this.errorMsg,
          type: 'danger'
        });
        throw Error(this.errorMsg);
      }
      const {
        buff_deposit_deleg
      } = await this.contractInstances.ssnlist.getSubState(
        'buff_deposit_deleg',
        [myAddr]
      );
      let biggestBuffDeposit = 0;
      for (const key in buff_deposit_deleg[myAddr][ssnAddr]) {
        if (key > biggestBuffDeposit) {
          biggestBuffDeposit = key;
        }
      }
      if (!(Number(lastrewardcycle) > Number(biggestBuffDeposit))) {
        this.loading = false;
        this.errorMsg = `You have buffered deposits in the selected node. 
          Please wait for the next cycle before withdrawing the staked amount.`;
        this.$notify({
          message: this.errorMsg,
          type: 'danger'
        });
        throw Error(this.errorMsg);
      }
    },
    async unstake(amount, ssnAddr) {
      this.errorMsg = '';
      this.loading = true;
      this.actionType = 'unstake';
      try {
        await this.validateAmountRemove(amount, ssnAddr, 'unstake');
      } catch (error) {
        console.warn(error);
        return;
      }
      let txParams = {};
      try {
        txParams = await this.createTxn();
      } catch (error) {
        this.loading = false;
        this.showUnstakeModal = false;
        return this.$notify({
          message: `${error}`,
          type: 'danger'
        });
      }
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
      this.loading = false;
      this.showUnstakeModal = false;
      this.errorMsg = '';
      console.log(`Unstaking: ${actualAmount.toString()}`);
    },
    async completeWithdrawal() {
      this.loading = true;
      this.actionType = 'completeWithdrawal';
      let txParams = {};
      try {
        txParams = await this.createTxn();
      } catch (error) {
        this.loading = false;
        return this.$notify({
          message: `${error}`,
          type: 'danger'
        });
      }
      const contractMethod = 'CompleteWithdrawal';
      const contractParams = [];
      if (this.accessType === 1004) {
        await this.zilpayContractTx(contractMethod, contractParams, txParams);
      } else if (this.accessType === 1006) {
        await this.ledgerContractTx(contractMethod, contractParams, txParams);
      } else {
        await this.zilletContractTx(contractMethod, contractParams, txParams);
      }
      this.loading = false;
      this.errorMsg = '';
    },
    async claimReward(ssn) {
      console.log(`Claiming reward...`);
      this.actionType = 'claimReward';
      if (this.myStakes.length === 1 || ssn) {
        const ssnAddr =
          this.myStakes.length === 1 ? this.myStakes[0].address : ssn;
        this.loading = true;
        let txParams;
        try {
          txParams = await this.createTxn();
        } catch (error) {
          this.loading = false;
          this.showRewardClaimModal = false;
          return this.$notify({
            message: `${error}`,
            type: 'danger'
          });
        }
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
          await this.ledgerContractTx(contractMethod, contractParams, txParams);
        } else {
          await this.zilletContractTx(contractMethod, contractParams, txParams);
        }
        this.showRewardClaimModal = false;
        localStorage.setItem('__rewards_claimed_at', new Date().getTime());
        this.loading = false;
        this.errorMsg = '';
      } else {
        this.showRewardClaimModal = true;
      }
    },
    async transfer(fromNode, toNode, amount) {
      console.log(`Transfering staked...`, amount);
      this.actionType = 'transfer';
      this.loading = true;
      try {
        await this.validateAmountRemove(amount, fromNode.address, 'transfer');
      } catch (error) {
        console.warn(error);
        return;
      }
      let txParams = {};
      try {
        txParams = await this.createTxn();
      } catch (error) {
        this.loading = false;
        this.showTransferStakeModal = false;
        return this.$notify({
          message: `${error}`,
          type: 'danger'
        });
      }
      const contractMethod = 'ReDelegateStake';
      let actualAmount = units.toQa(amount, units.Units.Zil);
      const contractParams = [
        {
          vname: 'ssnaddr',
          type: 'ByStr20',
          value: `${toChecksumAddress(fromNode.address)}`
        },
        {
          vname: 'to_ssn',
          type: 'ByStr20',
          value: `${toChecksumAddress(toNode.address)}`
        },
        {
          vname: 'amount',
          type: 'Uint128',
          value: `${actualAmount}`
        }
      ];
      if (this.accessType === 1004) {
        await this.zilpayContractTx(contractMethod, contractParams, txParams);
      } else if (this.accessType === 1006) {
        await this.ledgerContractTx(contractMethod, contractParams, txParams);
      } else {
        await this.zilletContractTx(contractMethod, contractParams, txParams);
      }
      this.showTransferStakeModal = false;
      this.loading = false;
      this.errorMsg = '';
    },
    timeConverter(UNIX_timestamp) {
      let a = new Date(UNIX_timestamp);
      let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];
      let year = a.getFullYear();
      let month = months[a.getMonth()];
      let date = a.getDate();
      let hours = a.getHours();
      let minutes = a.getMinutes();
      let seconds = a.getSeconds();
      let formattedTime =
        hours.toString().padStart(2, '0') +
        ':' +
        minutes.toString().padStart(2, '0') +
        ':' +
        seconds.toString().padStart(2, '0');
      let time = date + ' ' + month + ' ' + year + ' ' + formattedTime;
      return time;
    },
    convertCurrency(labelValue) {
      // Nine Zeroes for Billions
      return Math.abs(Number(labelValue)) >= 1.0e9
        ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(4) + ' B'
        : // Six Zeroes for Millions
          Math.abs(Number(labelValue)) >= 1.0e6
          ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(4) + ' M'
          : // Three Zeroes for Thousands
            Math.abs(Number(labelValue)) >= 1.0e3
            ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
            : Math.abs(Number(labelValue));
    }
  }
};
</script>
