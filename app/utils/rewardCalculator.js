import BN from 'bn.js';

const KEY_LAST_REWARD_CYCLE = 'lastrewardcycle';
const KEY_DIRECT_DEPOSIT_DELEG = 'direct_deposit_deleg';
const KEY_BUFF_DEPOSIT_DELEG = 'buff_deposit_deleg';
const KEY_STAKE_SSN_PER_CYCLE = 'stake_ssn_per_cycle';
const KEY_LAST_WITHDRAW_CYCLE = 'last_withdraw_cycle_deleg';
const KEY_DELEG_PER_CYCLE = 'deleg_stake_per_cycle';

async function get_rewards(ssnContract, ssnaddr, delegator) {
  const allState = await ssnContract.getState();
  const reward_list = await get_reward_cycle_list(allState, ssnaddr, delegator);
  const delegate_per_cycle = await combine_buff_direct(
    allState,
    ssnaddr,
    delegator,
    reward_list
  );
  const need_list = await get_reward_need_cycle_list(
    allState,
    ssnaddr,
    delegator
  );
  const rewards = await calculate_rewards(
    allState,
    ssnaddr,
    delegate_per_cycle,
    need_list
  );
  return rewards;
}

// get reward cycle list
async function get_reward_cycle_list(state, ssnaddr, delegator) {
  if (state === undefined) {
    return [];
  }
  const last_withdraw_cycle_map = state[KEY_LAST_WITHDRAW_CYCLE];
  if (
    last_withdraw_cycle_map !== undefined &&
    last_withdraw_cycle_map[delegator] !== undefined &&
    last_withdraw_cycle_map[delegator][ssnaddr] !== undefined
  ) {
    const last_reward_cycle_str = state[KEY_LAST_REWARD_CYCLE];
    const last_reward_cycle = Number.parseInt(last_reward_cycle_str);
    let result_list = [];
    let i = 1;
    for (i; i <= last_reward_cycle; i++) {
      result_list.push(i);
    }

    return result_list;
  } else {
    return [];
  }
}

// to get those cycles need to calculte rewards
async function get_reward_need_cycle_list(state, ssnaddr, delegator) {
  if (state === undefined) {
    return [];
  }
  // get last_reward_cycle;
  const last_reward_cycle = state[KEY_LAST_REWARD_CYCLE];
  // get last_withdraw_cycle_deleg
  const last_withdraw_cycle_deleg = state[KEY_LAST_WITHDRAW_CYCLE];
  if (
    last_withdraw_cycle_deleg === undefined ||
    last_withdraw_cycle_deleg[delegator.toLowerCase()] === undefined
  ) {
    return [];
  }
  const last_withdraw_cycle =
    last_withdraw_cycle_deleg[delegator.toLowerCase()][ssnaddr];

  // to filter those elements that meet
  // last_withdraw_cycle < elements <= last_reward_cycle
  const reward_cycle_list_reverse = await get_reward_cycle_list(
    state,
    ssnaddr,
    delegator
  );
  const cycle_need_to_calculate = reward_cycle_list_reverse.filter(
    c =>
      c > Number.parseInt(last_withdraw_cycle) &&
      c <= Number.parseInt(last_reward_cycle)
  );
  return cycle_need_to_calculate;
}

// to combine buffered deposit map and direct deposit map
// eventually get the actual delegate amount of every cycle for this particular ssn operator
async function combine_buff_direct(state, ssnaddr, delegator, reward_list) {
  const result_map = new Map();

  if (state === undefined) {
    return result_map;
  }
  const direct_deposit = state[KEY_DIRECT_DEPOSIT_DELEG];
  const buffer_deposit = state[KEY_BUFF_DEPOSIT_DELEG];
  const deleg_stake_per_cycle = state[KEY_DELEG_PER_CYCLE];

  reward_list.forEach(cycle => {
    // for every reward cycle, we need to get
    // 1. cycle - 1 in direct deposit
    // 2. cycle - 2 in buffered deposit
    // 3. accumulate last result to get total amount for this cycle
    const c1 = cycle - 1;
    const c2 = cycle - 2;
    let hist_amt = new BN(0);
    if (
      deleg_stake_per_cycle !== undefined &&
      deleg_stake_per_cycle[delegator] !== undefined &&
      deleg_stake_per_cycle[delegator][ssnaddr] !== undefined &&
      deleg_stake_per_cycle[delegator][ssnaddr][c1.toString()] !== undefined
    ) {
      hist_amt = new BN(
        deleg_stake_per_cycle[delegator][ssnaddr][c1.toString()]
      );
    }

    let dir_amt = new BN(0);
    if (
      direct_deposit !== undefined &&
      direct_deposit[delegator] !== undefined &&
      direct_deposit[delegator][ssnaddr] !== undefined &&
      direct_deposit[delegator][ssnaddr][c1.toString()] !== undefined
    ) {
      dir_amt = new BN(direct_deposit[delegator][ssnaddr][c1.toString()]);
    }

    let buf_amt = new BN(0);
    if (
      buffer_deposit !== undefined &&
      buffer_deposit[delegator] !== undefined &&
      buffer_deposit[delegator][ssnaddr] !== undefined &&
      buffer_deposit[delegator][ssnaddr][c2.toString()] !== undefined
    ) {
      buf_amt = new BN(buffer_deposit[delegator][ssnaddr][c2.toString()]);
    }

    let total_amt_tmp = dir_amt.add(buf_amt);
    total_amt_tmp = total_amt_tmp.add(hist_amt);
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

async function calculate_rewards(
  state,
  ssnaddr,
  delegate_per_cycle,
  need_list
) {
  var result_rewards = new BN(0);
  if (state === undefined) {
    return result_rewards;
  }
  const stake_ssn_per_cycle = state[KEY_STAKE_SSN_PER_CYCLE][ssnaddr];
  if (stake_ssn_per_cycle === undefined) {
    return new BN(0);
  }
  need_list.forEach(cycle => {
    const cycle_info = stake_ssn_per_cycle[cycle];
    if (cycle_info === undefined) {
      // no rewards for this cycle, just skip
    } else {
      const total_rewards = new BN(cycle_info['arguments'][1]);
      const total_stake = new BN(cycle_info['arguments'][0]);

      let deleg_amt = delegate_per_cycle.get(cycle);

      if (deleg_amt !== undefined) {
        const rewards_tmp = deleg_amt.mul(total_rewards);
        const rewards = rewards_tmp.div(total_stake);
        result_rewards = result_rewards.add(rewards);
      }
    }
  });

  return result_rewards;
}

export { get_rewards };
export default get_rewards;
