const express = require('express');
const http = require('http');
const router = require('./routas/router.js');
const webServerConfig = require('./config/servidor');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

httpServer = http.createServer(app);
app.use('/ldap', router);
httpServer.listen(webServerConfig.PORT).on('listening', () => {
  console.log(`Web server listening on localhost:${webServerConfig.PORT}`);
}).on('error', err => {
  reject(err);
});