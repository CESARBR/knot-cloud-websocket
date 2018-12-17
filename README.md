# KNoT Cloud WebSocket library for NodeJS and browser

A client side library that provides websocket abstraction to the KNoT Cloud for Node.js and browser applications.

# Getting started

## Install

```console
npm install --save file:path/to/knot-cloud-websocket
```

## Quickstart

`KNoTCloudWebSocket` connects to http://host:port using the UUID and token as credentials, respectively. Replace this address with your protocol adapter instance and the credentials with valid ones.

```javascript
const KNoTCloudWebSocket = require('knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname:'localhost',
  port:3004,
  uuid:'78159106-41ca-4022-95e8-2511695ce64c',
  token:'d5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

async function main() {
  try {
    await client.connect();
    await client.registerDevice({
      type:'gateway',
      name:'myKNoTGateway'
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
  `hostname` **String** KNoT Cloud protocol adapter instance host name.
  `port` **Number** KNoT Cloud protocol adapter instance port.
  `uuid` **String** User UUID.
  `token` **String** User token.
}
#### Example

```javascript
const KNoTCloudWebSocket = require('knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname:'localhost',
  port:3004,
  uuid:'78159106-41ca-4022-95e8-2511695ce64c',
  token:'d5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});
```

### connect(): &lt;Void&gt;

Connects to the KNoT Cloud protocol adapter instance.

#### Example

```javascript
const KNoTCloudWebSocket = require('knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname:'localhost',
  port:3004,
  uuid:'78159106-41ca-4022-95e8-2511695ce64c',
  token:'d5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

async function main() {
  await client.connect();
}
main();
```

### close(): &lt;Void&gt;

Closes the current connection.

#### Example

```javascript
const KNoTCloudWebSocket = require('knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname:'localhost',
  port:3004,
  uuid:'78159106-41ca-4022-95e8-2511695ce64c',
  token:'d5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

async function main() {
  await client.connect();
  await client.close();
}
main();
```

### registerDevice(): Promise&lt;Void&gt;

Registers a new device on the KNoT Cloud.

#### Example

```javascript
const KNoTCloudWebSocket = require('knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname:'localhost',
  port:3004,
  uuid:'78159106-41ca-4022-95e8-2511695ce64c',
  token:'d5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

async function main() {
  try {
    await client.connect();
    await client.registerDevice({
      type:'gateway',
      name:'myKNoTGateway'
    });
  } catch (err) {
    console.error(err);
  }

  await client.close();
}
main();
```
