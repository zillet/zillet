import BN from "bn.js";

const { Zilliqa } = require('@zilliqa-js/zilliqa');

const KEY_LAST_REWARD_CYCLE = 'lastrewardcycle';
const KEY_DIRECT_DEPOSIT_DELEG = 'direct_deposit_deleg';
const KEY_BUFF_DEPOSIT_DELEG = 'buff_deposit_deleg';
const KEY_STAKE_SSN_PER_CYCLE = 'stake_ssn_per_cycle';
const KEY_LAST_WITHDRAW_CYCLE = 'last_withdraw_cycle_deleg'

export class RewardCalculator {
    zilliqa: any;
    contract: any;

    constructor(url: String, ssnlist: String) {
         this.zilliqa = new Zilliqa(url);
         this.contract = this.zilliqa.contracts.at(ssnlist);
    }

    async get_rewards(ssnaddr: string, delegator: string) {
        const allState = await this.contract.getState();
        const reward_list = await this.get_reward_cycle_list(allState,ssnaddr,delegator);
        const delegate_per_cycle = await this.combine_buff_direct(allState,ssnaddr,delegator,reward_list);
        const need_list = await this.get_reward_need_cycle_list(allState,ssnaddr,delegator);
        const rewards = await this.calculate_rewards(allState,ssnaddr,delegate_per_cycle,need_list);
        return rewards;
    }


    // get reward cycle list
    async get_reward_cycle_list(state: any, ssnaddr: string, delegator: string) {
        if (state === undefined) {
            return [];
        }
        const last_withdraw_cycle_map = state[KEY_LAST_WITHDRAW_CYCLE];
        if (last_withdraw_cycle_map !== undefined  &&last_withdraw_cycle_map[delegator] !== undefined && last_withdraw_cycle_map[delegator][ssnaddr] !== undefined) {
            const last_reward_cycle_str = state[KEY_LAST_REWARD_CYCLE];
            const last_reward_cycle = Number.parseInt(last_reward_cycle_str);
            let result_list = [];
            let i =  1;
            for (i; i <= last_reward_cycle; i++) {
                result_list.push(i)
            }

            return result_list;

        } else {
            return [];
        }

    }

    // to get those cycles need to calculte rewards
    async get_reward_need_cycle_list(state: any, ssnaddr: string, delegator: string) {
        if (state === undefined) {
            return []
        }
         // get last_reward_cycle;
        const last_reward_cycle = state[KEY_LAST_REWARD_CYCLE];
        // get last_withdraw_cycle_deleg
        const last_withdraw_cycle_deleg = state[KEY_LAST_WITHDRAW_CYCLE];
        if (last_withdraw_cycle_deleg === undefined || last_withdraw_cycle_deleg[delegator.toLowerCase()] === undefined) {
            return [];
        }
        const last_withdraw_cycle = last_withdraw_cycle_deleg[delegator.toLowerCase()][ssnaddr];

        // to filter those elements that meet
        // last_withdraw_cycle < elements <= last_reward_cycle
        const reward_cycle_list_reverse = await this.get_reward_cycle_list(state,ssnaddr,delegator);
        const cycle_need_to_calculate = reward_cycle_list_reverse.filter(c => c > Number.parseInt(last_withdraw_cycle) && c <= Number.parseInt(last_reward_cycle));
        return cycle_need_to_calculate;
    }

    // to combine buffered deposit map and direct deposit map
    // eventually get the actual delegate amount of every cycle for this particular ssn operator
    async combine_buff_direct(state: any, ssnaddr: string, delegator: string, reward_list: number[]) {
        const result_map = new Map <number, BN>();

        if (state === undefined) {
            return result_map;
        }
        const direct_deposit = state[KEY_DIRECT_DEPOSIT_DELEG];
        const buffer_deposit = state[KEY_BUFF_DEPOSIT_DELEG];

        reward_list.forEach((cycle: number) => {
            // for every reward cycle, we need to get
            // 1. cycle - 1 in direct deposit
            // 2. cycle - 2 in buffered deposit
            // 3. accumulate last result to get total amount for this cycle
            const c1 = cycle - 1;
            const c2 = cycle - 2;
            let dir_amt = new BN(0);
            if (direct_deposit !== undefined 
                && direct_deposit[delegator] !== undefined 
                && direct_deposit[delegator][ssnaddr] !== undefined
                && direct_deposit[delegator][ssnaddr][c1.toString()] !== undefined) {
                dir_amt = new BN(direct_deposit[delegator][ssnaddr][c1.toString()]);
            }

            let buf_amt = new BN(0);
            if (buffer_deposit !== undefined 
                && buffer_deposit[delegator] !== undefined 
                && buffer_deposit[delegator][ssnaddr] !== undefined
                && buffer_deposit[delegator][ssnaddr][c2.toString()] !== undefined) {
                    buf_amt = new BN(buffer_deposit[delegator][ssnaddr][c2.toString()]);
            }

            const total_amt_tmp = dir_amt.add(buf_amt);
            const last_amt = result_map.get(c1);
            if (last_amt !== undefined) {
                const total_amt = total_amt_tmp.add(last_amt);
                result_map.set(cycle, total_amt);
            } else {
                result_map.set(cycle, total_amt_tmp);
            }
        });
        return result_map;
    }


    async calculate_rewards(state: any, ssnaddr: string, delegate_per_cycle: Map<number, BN>, need_list: number[]) {
        var result_rewards = new BN(0);
        if (state === undefined) {
            return result_rewards;
        }
        const stake_ssn_per_cycle = state[KEY_STAKE_SSN_PER_CYCLE][ssnaddr];
        if (stake_ssn_per_cycle === undefined) {
            return new BN(0);
        }
        need_list.forEach((cycle: number) => {
            const cycle_info = stake_ssn_per_cycle[cycle];
            if (cycle_info === undefined) {
                // no rewards for this cycle, just skip
            } else {
                const total_rewards = new BN(cycle_info['arguments'][1]);
                const total_stake = new BN(cycle_info['arguments'][0]);

                let deleg_amt: any = delegate_per_cycle.get(cycle);

                if (deleg_amt !== undefined) {
                    const rewards_tmp = deleg_amt.mul(total_rewards);
                    const rewards = rewards_tmp.div(total_stake);
                    result_rewards = result_rewards.add(rewards);
                }
            }
        });

        return result_rewards;
    }
}