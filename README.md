# KNoT Cloud WebSocket library for NodeJS and browser

A client side library that provides websocket abstraction to the KNoT Cloud for Node.js and browser applications.

# Getting started

## Install

```console
npm install --save file:path/to/knot-cloud-websocket
```

## Quickstart

`KNoTCloudWebSocket` connects to &lt;protocol&gt;://&lt;hostname&gt;:&lt;port&gt; using the UUID and token as credentials, respectively. Replace this address with your protocol adapter instance and the credentials with valid ones.

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  uuid: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

async function main() {
  try {
    await client.connect();
    await client.register({
      type: 'gateway',
      name: 'my KNoT Gateway'
    });
  } catch (err) {
    console.error(err);
  }

  await client.close();
}
main();
```
## Methods

### constructor(options)

Create a client object that will connect to a KNoT Cloud protocol adapter instance.

#### Arguments
`options`: {
  `protocol` **String** Either `'ws'` or `'wss'`. Defaults to `'ws'`.
  `hostname` **String** KNoT Cloud protocol adapter instance host name.
  `port` **Number** KNoT Cloud protocol adapter instance port. When port is 433, protocol is automatically changed to `'wss'`.
  `uuid` **String** User UUID.
  `token` **String** User token.
}
#### Example

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  uuid: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});
```

### connect(): &lt;Void&gt;

Connects to the KNoT Cloud protocol adapter instance. Emits  a `'ready'` message when the connection is successfull and `'error'` if a connection issue occurs.

#### Example

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  uuid: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

async function main() {
  client.on('ready', () => {
    console.log('Connection established');
  });
  client.on('error', () => {
    console.log(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
```

### close(): &lt;Void&gt;

Closes the current connection.

#### Example

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  uuid: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

async function main() {
  client.on('ready', () => {
    console.log('Connection established');
    client.close();
  });
  client.on('error', () => {
    console.log(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
```

### register(properties): &lt;Void&gt;

Registers a new device on the KNoT Cloud. When the register is successfull, emits a `'registered'` message.

#### Arguments
`properties`: {
  `type` **String** Required. Either `'gateway'` or `'app'`.
  `name` **String** Human readable name for your device.
}

#### Example

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  uuid: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

async function main() {
  client.on('ready', () => {
    client.register({
      type:'gateway',
      name:'My KNoT Gateway'
    });
  });
  client.on('registered', (device) => {
    console.log(device);
    client.close();
  });
  client.on('error', (err) => {
    console.log(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
```
