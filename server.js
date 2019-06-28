const https = require('https');
const fs = require('fs');
const { Nuxt, Builder } = require('nuxt');
const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

// Nuxt.js setup
let config = require('./nuxt.config.js');
config.dev = !isProd;
const nuxt = new Nuxt(config);
if (!isProd) {
  const builder = new Builder(nuxt);
  builder.build();
}

// HTTPS Server
const options = {
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./keys/cert.pem')
};

// Create the server
https.createServer(options, nuxt.render).listen(port);

console.log(`Server listening on https://localhost:${port}`);
