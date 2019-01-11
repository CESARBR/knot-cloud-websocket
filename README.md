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
// { online: false,
//   type: 'gateway',
//   metadata: { name: 'My KNoT Gateway' },
//   meshblu:
//    { version: '2.0.0',
//      whitelists:
//       { discover:
//          { as: [ { uuid: '78159106-41ca-4022-95e8-2511695ce64c' } ],
//            view: [ { uuid: '78159106-41ca-4022-95e8-2511695ce64c' } ] },
//         configure:
//          { as: [ { uuid: '78159106-41ca-4022-95e8-2511695ce64c' } ],
//            update: [ { uuid: '78159106-41ca-4022-95e8-2511695ce64c' } ] } },
//      createdAt: '2019-01-08T13:01:41.278Z',
//      hash: 'f3NlbFF9abnShDWXh5GfN7C2hnas5ElubSLCnDbNSaI=' },
//   uuid: '871a6907-45c0-4557-b783-6224f3de92e7',
//   token: '8df7ed3c29738e9bf70bdf30e6c3abfa3cb10f05' }
```

### updateMetadata(id, metadata): &lt;Void&gt;

Update the device metadata. When successful emits a `updated` message.

#### Arguments

- `id` **String** device ID (KNoT ID).
- `metadata` **Any** device metadata.

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
    client.updateMetadata('7e133545550e496a', {
      room: {
        name: 'Lula Cardoso Ayres',
        location: 'Tiradentes'
      }
    });
  });
  client.on('updated', () => {
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

### getDevices(query): &lt;Void&gt;

Gets the devices registered on cloud. If a `query` is specified, only the devices with that property will be filtered. When successful emits a `devices` message.

#### Arguments

`query` **Object** data contained in device

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
    client.getDevices({
      type: 'gateway'
    });
  });
  client.on('devices', (devices) => {
    console.log(devices);
    client.close();
  });
  client.on('error', (err) => {
    console.log(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();

// [ { online: true,
//    name: 'Door lock',
//    id: '7e133545550e496a',
//    schema: [ [Object], [Object] ] } ]
```

### unregister(id): &lt;Void&gt;

Remove a device from the cloud. When successful emits a `unregistered` message.

#### Arguments

`id` **String** device ID (KNoT ID).

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
    client.unregister('7e133545550e496a');
  });
  client.on('unregistered', () => {
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

### updateSchema(schema): &lt;Void&gt;

Sends a KNoT schema to a device associated to the connection. When successful emits a `updated` message.

#### Arguments

- `schema` **Array** a set of properties (associated to KNoT semantic) with details about sensors/actuators.
  * `sensor_id` **Number** a sensor id between 0 and 255.
  * `value_type` **Number** sensor type.
  * `unit` **Number** sensor unit based.
  * `name` **String** sensor name.

#### Example
```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  uuid: '97159106-41ca-4022-95e8-2511695ce64c',
  token: 'g4265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

async function main() {
  client.on('ready', () => {
    client.updateSchema([
      { "sensor_id": 251, "value_type": 02,
      "unit": 1, "type_id": 13, "name":
      "Tank Volume" },
      { "sensor_id": 252, "value_type": 1,
      "unit": 1 ,"type_id": 5, "name":
      "Outdoor Temperature" },
      { "sensor_id": 253, "value_type": 3,
      "unit": 0, "type_id": 65521, "name":
      "Lamp Status" }
    ]);
  });
  client.on('updated', () => {
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

### createSessionToken(id): &lt;Void&gt;

Create a session token to device on loud. When successful emits a `created` message.

#### Arguments

`id` **String** Device ID

#### Example

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
    client.createSessionToken('7e133545550e496a');
  });
  client.on('created', (token) => {
    console.log(token);
    client.close();
  });
  client.on('error', (err) => {
    console.log(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
// "a0ab6f486633ddc87dceecc98e88d7ffee60a402"
```
