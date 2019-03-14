# Zilliqa Wallet

UI/UX focused minimal wallet. It is work in progress.

## Build Setup

``` bash
# install dependencies
$ npm install # yarn install

# serve with hot reload
$ npm run dev #  yarn dev

# build for production and launch server
$ npm run build # yarn build
$ npm start # yarn start
```

## Docker

```
$ docker build -t "zilliqa-wallet" .  # build docker image
$ docker run --name zilliqa-wallet  -d -p 80:80  zilliqa-wallet # run docker image at port 80
```

### Todo
[x] Simple user flow
[x] Offline signing
[ ] Contract interaction
[ ] Transaction history
[ ] Multiple account management

## License
[MIT](LICENSE) license.
