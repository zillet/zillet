import BN from 'bn.js';

async function get_rewards(
  ssnaddr,
  delegator,
  lastrewardcycle,
  last_withdraw_cycle_deleg,
  direct_deposit_deleg,
  buff_deposit_deleg,
  stake_ssn_per_cycle,
  deleg_stake_per_cycle
) {
  let reward_list;
  if (
    last_withdraw_cycle_deleg !== undefined &&
    last_withdraw_cycle_deleg[delegator] !== undefined &&
    last_withdraw_cycle_deleg[delegator][ssnaddr] !== undefined
  ) {
    const last_reward_cycle = Number.parseInt(lastrewardcycle);
    let result_list = [];
    let i = 1;
    for (i; i <= last_reward_cycle; i++) {
      result_list.push(i);
    }

    reward_list = result_list;
  } else {
    reward_list = [];
  }
  const result_map = new Map();
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
      direct_deposit_deleg !== undefined &&
      direct_deposit_deleg[delegator] !== undefined &&
      direct_deposit_deleg[delegator][ssnaddr] !== undefined &&
      direct_deposit_deleg[delegator][ssnaddr][c1.toString()] !== undefined
    ) {
      dir_amt = new BN(direct_deposit_deleg[delegator][ssnaddr][c1.toString()]);
    }

    let buf_amt = new BN(0);
    if (
      buff_deposit_deleg !== undefined &&
      buff_deposit_deleg[delegator] !== undefined &&
      buff_deposit_deleg[delegator][ssnaddr] !== undefined &&
      buff_deposit_deleg[delegator][ssnaddr][c2.toString()] !== undefined
    ) {
      buf_amt = new BN(buff_deposit_deleg[delegator][ssnaddr][c2.toString()]);
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
  let delegate_per_cycle = result_map;
  // get last_reward_cycle;
  // get last_withdraw_cycle_deleg
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
  const need_list = reward_list.filter(
    c =>
      c > Number.parseInt(last_withdraw_cycle) &&
      c <= Number.parseInt(lastrewardcycle)
  );
  var result_rewards = new BN(0);
  const stake_ssn_p_cycle = stake_ssn_per_cycle[ssnaddr];
  if (stake_ssn_p_cycle === undefined) {
    return new BN(0);
  }
  need_list.forEach(cycle => {
    const cycle_info = stake_ssn_p_cycle[cycle];
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
