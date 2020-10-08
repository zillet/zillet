const { RewardCalculator } = require('./calculator')
const calculator = new RewardCalculator('https://dev-api.zilliqa.com','0x90fef596db83b32ae3bc3366b770179bf70d175c');


async function main() {
    const ssnaddr = '0xA9B9B3e19cbC122B9781425B12e07dC396A15850'.toLowerCase();
    const delegator = '0xd90f2e538CE0Df89c8273CAd3b63ec44a3c4ed82'.toLowerCase();
    try {
        const rewards = await calculator.get_rewards(ssnaddr,delegator);
        console.log(rewards.toString());
    } catch (err) {
        console.error("error - computing delegator rewards: %o - %o", delegator, err);
    }

}

main()
