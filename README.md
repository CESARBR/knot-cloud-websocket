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
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

client.on('ready', () => {
  client.register({
    id: '6e5a681b2ae7be40',
    type: 'knot:thing',
    name: 'Door Lock',
  });
});
client.on('registered', (thing) => {
  console.log('Registered', thing);
  client.close();
});
client.connect();
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
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
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
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

client.on('ready', () => {
  console.log('Connection established');
});
client.on('error', (err) => {
  console.error(err);
  console.log('Connection refused');
});
client.connect();
```

## close(): &lt;Void&gt;

Closes the current connection.

### Example

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

client.on('ready', () => {
  console.log('Connection established');
  client.close();
});
client.on('error', (err) => {
  console.error(err);
  console.log('Connection refused');
  client.close();
});
client.connect();
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
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

client.on('ready', () => {
  client.register({
    id: '6e5a681b2ae7be40',
    type: 'knot:thing',
    name: 'Door Lock',
  });
});
client.on('registered', (thing) => {
  console.log(thing);
  client.close();
});
client.on('error', (err) => {
  console.error(err);
  console.log('Connection refused');
  client.close();
});
client.connect();
// { type: 'knot:thing',
//   metadata: { name: 'Door Lock' },
//   knot:
//    { gateways: [ '78159106-41ca-4022-95e8-2511695ce64c' ],
//      id: '6e5a681b2ae7be40' },
//   token: '40ad864d503488eda9b629825876d46cb1356bdf' }
```

## unregister(id): &lt;Void&gt;

Removes a device from the cloud. Receives the `'unregistered'` message when succeeds and `'error'` otherwise.

### Arguments

- `id` **String** Device ID.

### Example
```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

client.on('ready', () => {
  client.unregister('6e5a681b2ae7be40');
});
client.on('unregistered', () => {
  client.close();
});
client.on('error', (err) => {
  console.error(err);
  console.log('Connection refused');
  client.close();
});
client.connect();
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
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

client.on('ready', () => {
  client.getDevices({
    type: 'knot:thing',
  });
});
client.on('devices', (devices) => {
  console.log(devices);
  client.close();
});
client.on('error', (err) => {
  console.error(err);
  console.log('Connection refused');
  client.close();
});
client.connect();
// [ { type: 'knot:thing',
//     metadata: { name: 'Door Lock' },
//     knot:
//      { gateways: [ '78159106-41ca-4022-95e8-2511695ce64c' ],
//        id: '6e5a681b2ae7be40' } } ]
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
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

client.on('ready', () => {
  client.createSessionToken('6e5a681b2ae7be40');
});
client.on('created', (token) => {
  console.log(token);
  client.close();
});
client.on('error', (err) => {
  console.error(err);
  console.log('Connection refused');
  client.close();
});
client.connect();
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
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

client.on('ready', () => {
  client.revokeSessionToken('6e5a681b2ae7be40', 'a0ab6f486633ddc87dceecc98e88d7ffee60a402');
});
client.on('revoked', () => {
  client.close();
});
client.on('error', (err) => {
  console.error(err);
  console.log('Connection refused');
  client.close();
});
client.connect();
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
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '6e5a681b2ae7be40',
  token: 'a0ab6f486633ddc87dceecc98e88d7ffee60a402',
});

client.on('ready', () => {
  client.updateSchema([
    {
      sensorId: 253,
      typeId: 0xFFF1,
      valueType: 3,
      unit: 0,
      name: 'Lock'
    }
  ]);
});
client.on('updated', () => {
  client.close();
});
client.on('error', (err) => {
  console.error(err);
  console.log('Connection refused');
  client.close();
});
client.connect();
```

## activate(id): &lt;Void&gt;

Activates a gateway. Receives the `'activated'` message when succeeds and `'error'` otherwise.

### Arguments

- `id` **String** Device ID.

### Example
```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

client.on('ready', () => {
  client.activate('871a6907-45c0-4557-b783-6224f3de92e7');
});
client.on('activated', () => {
  client.close();
});
client.on('error', (err) => {
  console.error(err);
  console.log('Connection refused');
  client.close();
});
client.connect();
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
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

client.on('ready', () => {
  client.updateMetadata('6e5a681b2ae7be40', {
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
  client.close();
});
client.connect();
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
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '6e5a681b2ae7be40',
  token: 'a0ab6f486633ddc87dceecc98e88d7ffee60a402',
});

client.on('ready', () => {
  client.publishData(253, true);
});
client.on('published', () => {
  client.close();
});
client.on('error', (err) => {
  console.error(err);
  console.log('Connection refused');
  client.close();
});
client.connect();
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
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

client.on('ready', () => {
  client.getData('6e5a681b2ae7be40', [253]);
});
client.on('data', (data) => {
  console.log(JSON.stringify(data, null, 2));
});
client.on('error', (err) => {
  console.error(err);
  console.log('Connection refused');
  client.close();
});
client.connect();
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
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

client.on('ready', () => {
  client.setData('6e5a681b2ae7be40', [{ sensorId: 253, value: false }]);
});
client.on('sent', () => {
  client.close();
});
client.on('error', (err) => {
  console.error(err);
  console.log('Connection refused');
  client.close();
});
client.connect();
```

## on(name, handler): &lt;Void&gt;

Registers an event handler. See next section for details on events.

### Arguments

- `name` **String** Event name
- `handler` **Function** Event handler.

### Example

```javascript
const KNoTCloudWebSocket = require('@cesarbr/knot-cloud-websocket');
const client = new KNoTCloudWebSocket({
  protocol: 'wss',
  hostname: 'ws.knot.cloud',
  port: 443,
  pathname: '/',
  id: '78159106-41ca-4022-95e8-2511695ce64c',
  token: 'd5265dbc4576a88f8654a8fc2c4d46a6d7b85574',
});

client.on('registered', (message) => {
  console.log('Who?', message.from);
  console.log('What?', message.payload);
  client.close();
});
client.on('error', (err) => {
  console.error(err);
  console.log('Connection refused');
  client.close();
});
client.connect();
```

# Events

Events can be listened to by registering a handler with `on()`. The handler will receive an object in the following format:
* `from` **String** ID of the device generating the event.
* `payload` **Any** (Optional) Event-defined payload.

## Event: "registered"

Triggered when a device is registered on the cloud. Only apps (`'knot:app'`) and users receive this event.

### Payload

An object containing the registered device.

### Example

```javascript
{
  from: '78159106-41ca-4022-95e8-2511695ce64c',
  payload: {
    type: 'knot:thing',
    metadata: { name: 'Door Lock' },
    knot: {
      gateways: [ '78159106-41ca-4022-95e8-2511695ce64c' ],
      id: '6e5a681b2ae7be40',
    },
  },
}
```

## Event: "unregistered"

Triggered when a device is unregistered from the cloud. Only apps (`'knot:app'`) and users receive this event.

### Payload

No payload. The ID of the unregistered device will come in the `from` field.

### Example

```javascript
{
  from: '6e5a681b2ae7be40'
}
```

## Event: "data"

Triggered when a device publishes data items. Only apps `'knot:app'` and users receive this event.

### Payload

An object in the following format:

- `sensorId` **Number** Sensor ID. Value between 0 and the maximum number of sensors defined for that thing.
- `value` **String|Boolean|Number** Sensor value. Strings must be Base64 encoded.

### Example

```javascript
{
  from: '6e5a681b2ae7be40',
  payload: {
    sensorId: 253,
    value: true,
  },
}
```

## Event: "command"

Triggered when a device of type `'knot:app'` sends a command. Currently supported commands are `getData` and `setData`. Only things (`'knot:thing'`) receive this event.

### Payload

An object in the following format:
- `name` **String** Command name.
- `args` **Any** (Optional) Command-defined arguments.

### Example

```javascript
{
  from: '78159106-41ca-4022-95e8-2511695ce64c',
  payload: {
    name: 'getData',
    args: [253],
  },
}
```