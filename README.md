# Zilliqa Wallet

UI/UX focused minimal web wallet.

## Build Setup

``` bash
# install dependencies
$ npm install # yarn install
# serve with hot reload http/https
$ npm run dev #  yarn dev
$ npm run https:dev #  yarn https:dev

# build for production and launch server http/https
$ npm run build # yarn build
$ npm start # yarn start
$ npm run https:start #  yarn https:start
```

## Docker

```
$ docker build -t "zilliqa-wallet" .  # build docker image
$ docker run --name zilliqa-wallet  -d -p 80:80  zilliqa-wallet # run docker image at port 80
```

### To serve via https

- Create ssl certificate in `keys` folder
```
openssl req -subj '/CN=localhost' -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem

```

## License
[MIT](LICENSE) license.
