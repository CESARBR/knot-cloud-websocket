# KNoT Cloud WebSocket library for NodeJS and browser

A client side library that provides websocket abstraction to the KNoT Cloud for Node.js and browser applications.

# Getting started

## Install

```console
npm install --save @cesarbr/knot-cloud-websocket
```

## Quickstart

`KNoTCloudWebSocket` connects to &lt;protocol&gt;://&lt;hostname&gt;:&lt;port&gt; using the UUID and token as credentials, respectively. Replace this address with your protocol adapter instance and the credentials with valid ones.

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  id: '78159106-41ca-4022-95e8-2511695ce64c',
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
- `options` **Object** JSON object with connection details
  * `protocol` **String** Either `'ws'` or `'wss'`. Defaults to `'ws'`.
  * `hostname` **String** KNoT Cloud protocol adapter instance host name.
  * `port` **Number** KNoT Cloud protocol adapter instance port. When port is 433, protocol is automatically changed to `'wss'`.
  * `id` **String**  Device ID. Either the KNoT ID (for KNoT Things) or the meshblu assigned UUID (for KNoT Gateways, Apps or Users).
  * `uuid` **String** (Deprecated) Same as `id`.
  * `token` **String** User token.

#### Example

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  id: '78159106-41ca-4022-95e8-2511695ce64c',
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
  id: '78159106-41ca-4022-95e8-2511695ce64c',
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
  id: '78159106-41ca-4022-95e8-2511695ce64c',
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
- `properties` **Object** JSON object with device details
  * `type` **String** Required. Either `'gateway'` or `'app'`.
  * `name` **String** Human readable name for your device.

#### Result
- `device` **Object** JSON object containing device details after creation on cloud.

#### Example

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  id: '78159106-41ca-4022-95e8-2511695ce64c',
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

- `id` **String** Device ID. Either the KNoT ID (for KNoT Things) or the meshblu assigned UUID (for KNoT Gateways and/or KNoT Apps).
- `metadata` **Any** Device metadata.

#### Example

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  id: '78159106-41ca-4022-95e8-2511695ce64c',
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

- `query` **Object** Data contained in device.

#### Result
- `devices` **Array** Set of devices that match the constraint specified on `query`.

#### Example

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  id: '78159106-41ca-4022-95e8-2511695ce64c',
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
// [{ "online": false,
//     "type": "gateway",
//     "metadata": {
//       "name": "Raspberry"
//     },
//     "knot": {
//       "user": "d6d983d9-19df-495c-ab3f-09d6f5d62b6d",
//       "router": "8272bcad-55fd-44d9-bd21-d43eaaf01e3a",
//       "active": false
//     },
//     "meshblu": {
//       "version": "2.0.0",
//       "whitelists": {
//         "discover": {
//           "view": [
//             {
//               "uuid": "d6d983d9-19df-495c-ab3f-09d6f5d62b6d"
//             }
//           ]
//         },
//         "configure": {
//           "update": [
//             {
//               "uuid": "d6d983d9-19df-495c-ab3f-09d6f5d62b6d"
//             }
//           ]
//         }
//       },
//       "createdAt": "2019-01-10T11:35:17.584Z",
//       "hash": "ACj+0Dge+HzZCC2D87YHHya6VXr9VdF6KT60gvM0tZ4=",
//       "updatedAt": "2019-01-11T13:46:45.694Z",
//       "updatedBy": "d6d983d9-19df-495c-ab3f-09d6f5d62b6d"
//     },
//     "uuid": "edbc028a-f8e9-4804-93f7-92c8cc66f3aa",
//     "token": "$2a$08$qEeRk.KBRNaWAUmV1tG5xehbwPXVyy1Y0Wuna6n.5rpsIyj9ssXN6"
// }]
```

### unregister(id): &lt;Void&gt;

Remove a device from the cloud. When successful emits a `unregistered` message.

#### Arguments

- `id` **String** Device ID. Either the KNoT ID (for KNoT Things) or the meshblu assigned UUID (for KNoT Gateways and/or KNoT Apps).

#### Example
```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  id: '78159106-41ca-4022-95e8-2511695ce64c',
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

### createSessionToken(id): &lt;Void&gt;

Create a session token to device on cloud. When successful emits a `created` message.

#### Arguments

- `id` **String** Device ID. Either the KNoT ID (for KNoT Things) or the meshblu assigned UUID (for KNoT Gateways and/or KNoT Apps).

#### Result
- `token` **String** New token for the specified device.

#### Example
```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  id: '78159106-41ca-4022-95e8-2511695ce64c',
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

### updateSchema(schema): &lt;Void&gt;

Sends a KNoT schema as a thing associated to the connection. When successful emits a `updated` message.

#### Arguments

- `schema` **Array** Set of properties (associated to KNoT semantic) with details about sensors/actuators.
  * `sensor_id` **Number** Sensor id between 0 and the maximum number of sensors defined for that thing.
  * `value_type` **Number** Sensor type.
  * `unit` **Number** Sensor unit based.
  * `name` **String** Sensor name.

#### Example
```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  id: '97159106-41ca-4022-95e8-2511695ce64c',
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

### activate(id): &lt;Void&gt;

Sets the `active` KNoT property of the device on the cloud. When successful emits a `activated` message.

#### Arguments

- `id` **String** Device ID. Either the KNoT ID (for KNoT Things) or the meshblu assigned UUID (for KNoT Gateways and/or KNoT Apps).

#### Example
```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

async function main() {
  client.on('ready', () => {
    client.activate('871a6907-45c0-4557-b783-6224f3de92e7');
  });
  client.on('activated', () => {
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

### publishData(sensorId, value): &lt;Void&gt;

Sends a data as a thing associated to the connection. When successful emits a `published` message.

#### Arguments

- `sensor_id` **Number** Sensor id between 0 and the maximum number of sensors defined for that thing.
- `value` **Number** Sensor type.

#### Example
```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  id: '97159106-41ca-4022-95e8-2511695ce64c',
  token: 'g4265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

async function main() {
  client.on('ready', () => {
    client.publishData(253, true);
  });
  client.on('published', () => {
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
