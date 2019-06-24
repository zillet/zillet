export default {
  VIEWBLOCK_URL: 'https://api.viewblock.io/zilliqa/addresses/',
  MULTIPLIER: 12,
  MINIMUM_GAS_PRICE: 1000, // in Li
  NODES: [
    {
      name: 'Zilliqa Mainnet',
      url: 'https://api.zilliqa.com',
      explorer: 'https://viewblock.io/zilliqa/tx/',
      version: 65537,
      id: 1001
    },
    {
      name: 'Zilliqa Testnet',
      url: 'https://dev-api.zilliqa.com',
      explorer: 'https://viewblock.io/zilliqa/tx/',
      version: 21823489,
      id: 1002
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
      body: 'Access your wallet using 12-word mnemonic Phrase',
      allowed: true,
      buttonText: 'Access'
    },
    {
      id: 1004,
      img: 'zilpay.svg',
      title: 'ZilPay',
      body: 'Access your wallet using ZilPay Extension',
      allowed: true,
      buttonText: 'Connect (Beta)'
    },
    {
      id: 1005,
      img: 'mnemonic.svg',
      title: 'Moonlet',
      body: 'Access your wallet using Moonlet Extension (Beta)',
      allowed: false,
      buttonText: 'Coming Soon'
    }
  ]
};
