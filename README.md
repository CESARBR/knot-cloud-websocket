# KNoT Cloud WebSocket library for NodeJS and browser

A client side library that provides a WebSocket abstraction to the KNoT Cloud for Node.js and browser applications.

# Quickstart

## Install

```console
npm install --save @cesarbr/knot-cloud-websocket
```

## Run

`KNoTCloudWebSocket` connects to &lt;protocol&gt;://&lt;hostname&gt;:&lt;port&gt;/&lt;pathname&gt; using ID and token as credentials. Replace this address with your protocol adapter instance and the credentials with valid ones.

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  pathname: '/ws',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

async function main() {
  try {
    await client.connect();
    await client.register({
      type: 'knot:gateway',
      name: 'My KNoT Gateway'
    });
  } catch (err) {
    console.error(err);
  }

  await client.close();
}
main();
```
# Methods

## constructor(options)

Create a client object that will connect to a KNoT Cloud protocol adapter instance.

### Arguments
- `options` **Object** JSON object with connection details.
  * `protocol` **String** (Optional) Either `'ws'` or `'wss'`. Default: `'wss'`.
  * `hostname` **String** KNoT Cloud protocol adapter instance host name.
  * `port` **Number** (Optional) KNoT Cloud protocol adapter instance port. Default: 443.
  * `pathname` **String** (Optional) Path name on the server.
  * `id` **String**  Device ID.
  * `token` **String** Device token.

### Example

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  hostname: 'localhost',
  port: 3004,
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});
```

## connect(): &lt;Void&gt;

Connects to the protocol adapter instance. Receives the `'ready'` message when succeeds and `'error'` otherwise.

### Example

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
  client.on('error', (err) => {
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
```

## close(): &lt;Void&gt;

Closes the current connection.

### Example

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
  client.on('error', (err) => {
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
```

## register(properties): &lt;Void&gt;

Registers a new device. Receives the `'registered'` message when succeeds and `'error'` otherwise.

Users can create `'knot:gateway'`, `'knot:app'` and `'knot:thing'`. Gateways (`'knot:gateway'`) can create `'knot:thing'`.

### Arguments
- `properties` **Object** JSON object with device details
  * `type` **String** Device type. One of: `'knot:gateway'`, `'knot:app'` or `'knot:thing'`.
  * `name` **String** (Optional) Human readable name for your device.
  * `id` **String** Device ID. Required when `type` is `'knot:thing'`, for other types it is automatically generated.
  * `active` **Boolean** (Optional) Whether the gateway being created is active. Only used when `type` is `'knot:gateway'`. Default: `false`.

### Result
- `device` **Object** JSON object containing device details after creation on cloud.

### Example

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
      type: 'knot:gateway',
      name: 'My KNoT Gateway'
    });
  });
  client.on('registered', (device) => {
    console.log(device);
    client.close();
  });
  client.on('error', (err) => {
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
// { type: 'knot:gateway',
//   metadata: { name: 'My KNoT Gateway' },
//   knot: { id: '871a6907-45c0-4557-b783-6224f3de92e7', active: false } }
```

## unregister(id): &lt;Void&gt;

Removes a device from the cloud. Receives the `'unregistered'` message when succeeds and `'error'` otherwise.

### Arguments

- `id` **String** Device ID.

### Example
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
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
```

## getDevices(query): &lt;Void&gt;

Lists the devices registered on cloud. If a `query` is specified, only the devices that match such query will be returned. Receives the `'devices'` message when succeeds and `'error'` otherwise.

### Arguments

- `query` **Object** (Optional) Search query, written using [MongoDB query format](https://docs.mongodb.com/manual/tutorial/query-documents/).

### Result
- `devices` **Array** Set of devices that match the constraint specified on `query`.

### Example

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
      type: 'knot:gateway'
    });
  });
  client.on('devices', (devices) => {
    console.log(devices);
    client.close();
  });
  client.on('error', (err) => {
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
// [ { type: 'knot:gateway',
//     metadata: { name: 'Raspberry' },
//     knot: { id: 'edbc028a-f8e9-4804-93f7-92c8cc66f3aa', active: false } } ]
```

## createSessionToken(id): &lt;Void&gt;

Creates a session token for a device. Receives the `'created'` message when succeeds and `'error'` otherwise.

### Arguments

- `id` **String** Device ID.

### Result
- `token` **String** New token for the specified device.

### Example
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
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
// 'a0ab6f486633ddc87dceecc98e88d7ffee60a402'
```

## revokeSessionToken(id, token): &lt;Void&gt;

Revokes a device session token. Receives the `'revoked'` message when succeeds and `'error'` otherwise.

### Arguments

- `id` **String** Device ID.
- `token` **String** Existing session token for the specified device.

### Example
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
    client.revokeSessionToken('78159106-41ca-4022-95e8-2511695ce64c' 'e22dfa8d43ca0caf356f1a4930b638f2d1d98322');
  });
  client.on('revoked', () => {
    client.close();
  });
  client.on('error', (err) => {
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
```

## updateSchema(schema): &lt;Void&gt;

Updates the thing schema. Receives the `'updated'` message when succeeds and `'error'` otherwise.

### Arguments

- `schema` **Array** An array of objects in the following format:
  * `sensorId` **Number** Sensor ID. Value between 0 and the maximum number of sensors defined for that thing.
  * `typeId` **Number** Sensor type, e.g. whether it is a presence sensor or distance sensor.
  * `valueType` **Number** Value type, e.g. whether it is an integer, a floating-point number, etc.
  * `unit` **Number** Sensor unit.
  * `name` **String** Sensor name.

### Example
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
      {
        sensorId: 251,
        typeId: 13,
        valueType: 2,
        unit: 1,
        name: 'Tank Volume'
      },
      {
        sensorId: 252,
        typeId: 5,
        valueType: 1,
        unit: 1,
        name: 'Outdoor Temperature'
      },
      {
        sensorId: 253,
        typeId: 65521,
        valueType: 3,
        unit: 0,
        name: 'Lamp Status'
      }
    ]);
  });
  client.on('updated', () => {
    client.close();
  });
  client.on('error', (err) => {
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
```

## activate(id): &lt;Void&gt;

Activates a gateway. Receives the `'activated'` message when succeeds and `'error'` otherwise.

### Arguments

- `id` **String** Device ID.

### Example
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
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
```

## updateMetadata(id, metadata): &lt;Void&gt;

Updates the device metadata. Receives the `'updated'` message when succeeds and `'error'` otherwise.

### Arguments

- `id` **String** Device ID.
- `metadata` **Any** Device metadata.

### Example

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
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
```

## publishData(sensorId, value): &lt;Void&gt;

Publishes data. Receives the `'published'` message when succeeds and `'error'` otherwise.

### Arguments

- `sensorId` **Number** Sensor ID.
- `value` **Number** Sensor value.

### Example
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
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
```

## getData(id, sensorIds): &lt;Void&gt;

Requests a thing to send its current data items values. Receives the `'sent'` message when succeeds and `'error'` otherwise.

### Arguments

- `id` **String** Device ID.
- `sensorIds` **Array** Array of sensor IDs.

### Example

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
    client.getData('7e133545550e496a', [1, 2]);
  });
  client.on('sent', () => {
    client.close();
  });
  client.on('error', (err) => {
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
```

## setData(id, data): &lt;Void&gt;

Requests a thing to update its data items with the values passed as arguments. Receives the `'sent'` message when succeeds and `'error'` otherwise.

### Arguments

- `id` **String** Device ID.
- `data` **Array** Data items to be sent, each one formed by:
  * `sensorId` **Number** Sensor ID.
  * `value` **String|Boolean|Number** Sensor value. Strings must be Base64 encoded.

### Example

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
    client.setData('7e133545550e496a', [{ sensorId: 1, value: false }]);
  });
  client.on('sent', () => {
    client.close();
  });
  client.on('error', (err) => {
    console.error(err);
    console.log('Connection refused');
  });
  client.connect();
}
main();
```

# Events

## Event: "registered"

Triggered when a device is registered on the cloud. Only apps (`'knot:app'`) and users receive this event.

### Arguments

An object containing the registered device

### Example

```javascript
{
  type: 'knot:gateway',
  metadata: {
    name: 'My KNoT Gateway'
  },
  knot: {
    id: '871a6907-45c0-4557-b783-6224f3de92e7',
    active: false
  }
}
```

## Event: "unregistered"

Triggered when a device is unregistered from the cloud. Only apps (`'knot:app'`) and users receive this event.

### Arguments

An object in following format:
- `id` **String** Device ID

### Example

```javascript
{
  id: '871a6907-45c0-4557-b783-6224f3de92e7'
}
```

## Event: "data"

Triggered when a device publishes data items. Only apps `'knot:app'` and users receive this event.

### Arguments

An object in the following format:

- `id` **String** Device ID.
- `sensorId` **Number** Sensor ID. Value between 0 and the maximum number of sensors defined for that thing.
- `value` **String|Boolean|Number** Sensor value. Strings must be Base64 encoded.

### Example

```javascript
{
  id: '35da7919-c9d1-4d39-ab4c-c3f2956771d7',
  sensorId: 1,
  value: 10.57
}
```

## Event: "command"

Triggered when a device of type `'knot:app'` sends a command. Currently supported commands are `getData` and `setData`. Only things (`'knot:thing'`) receive this event.

### Arguments

An object in the following format:
- `name` **String** Command name.
- `args` **Any** (Optional) Command-defined arguments.

### Example

```javascript
{
  name: 'getData',
  args: {
    id: 1,
    sensorIds: [2, 3]
  }
}
```