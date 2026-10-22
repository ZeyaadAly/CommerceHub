// Fail closed if the offline CLI attempts network I/O. Test process only.
const net = require('node:net');
const tls = require('node:tls');
const http = require('node:http');
const https = require('node:https');
const dns = require('node:dns');
const { syncBuiltinESMExports } = require('node:module');
const deny = () => {
  throw new Error('Offline schema tooling attempted network access');
};
net.Socket.prototype.connect = deny;
tls.connect = deny;
http.request = http.get = https.request = https.get = deny;
dns.lookup = dns.resolve = deny;
dns.promises.lookup = dns.promises.resolve = deny;
globalThis.fetch = deny;
syncBuiltinESMExports();
