export default {
  MULTIPLIER: 12,
  MINIMUM_GAS_PRICE: 1000000000,
  NODES: [
    {
      name: 'Zilliqa Dev',
      url: 'https://dev-api.zilliqa.com',
      explorer: 'https://dev-explorer.zilliqa.com/',
      version: 21823489
    },
    {
      name: 'Zilliqa Mainnet',
      url: ' https://api.zilliqa.com',
      explorer: 'https://explorer.zilliqa.com/',
      version: 65537
    }
  ],
  WALLET_METHODS: [
    {
      id: 1001,
      img: 'private-key.svg',
      title: 'Private Key',
      body: 'Access your wallet using 64 character hex string',
      allowed: true,
      buttonText: 'Access'
    },
    {
      id: 1002,
      img: 'keystore.svg',
      title: 'Keystore file',
      body: 'Access your wallet using Keystore(JSON) file',
      allowed: true,
      buttonText: 'Import File'
    },
    {
      id: 1003,
      img: 'mnemonic.svg',
      title: 'Mnemonic phrase',
      body: 'Access your wallet using human readable string',
      allowed: false,
      buttonText: 'Coming Soon'
    }
  ]
};
