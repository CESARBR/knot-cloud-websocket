import EventEmitter from 'eventemitter3';
import WebSocket from 'isomorphic-ws';
import url from 'url';

const PROXY_EVENTS = ['close', 'error', 'unexpected-response', 'ping', 'pong', 'open'];

class Client extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
  }

  connect() {
    if (this.socket) {
      this.socket.close();
    }

    const uri = this.buildUri();
    this.socket = new WebSocket(uri);

    const onOpen = () => {
      const credentials = this.getCrendentials();
      this.identity(credentials);
      this.socket.removeEventListener('open', onOpen);
    };

    this.socket.addEventListener('message', this.onMessage.bind(this));
    this.socket.addEventListener('open', onOpen);
    PROXY_EVENTS.forEach(this.setupProxy.bind(this));
  }

  close() {
    if (!this.socket) {
      return;
    }

    this.closeAndClear();
  }

  identity(credentials) {
    this.sendFrame('identity', credentials);
  }

  register(properties) {
    this.sendFrame('register', properties);
  }

  updateMetadata(id, metadata) {
    this.sendFrame('metadata', { id, metadata });
  }

  getDevices(query) {
    this.sendFrame('devices', { query });
  }

  unregister(id) {
    this.sendFrame('unregister', { id });
  }

  createSessionToken(id) {
    this.sendFrame('token', { id });
  }

  updateSchema(schema) {
    this.sendFrame('schema', { schema });
  }

  activate(id) {
    this.sendFrame('activate', { id });
  }

  getData(id, sensorIds) {
    this.sendFrame('get-data', { id, sensorIds });
  }

  setData(id, data) {
    this.sendFrame('set-data', { id, data });
  }

  onMessage(event) {
    const message = this.parseFrame(event.data);
    if (message.type === 'error') {
      const errorMessage = (message.data && message.data.message) || 'Unexpected error';
      const error = new Error(errorMessage);
      error.frame = event.data;
      error.code = (message.data && message.data.code) || undefined;
      this.emit('error', error);
      return;
    }

    this.emit(message.type, message.data);
  }

  sendFrame(type, data) {
    const frame = this.formatFrame(type, data);
    this.socket.send(frame);
  }

  closeAndClear() {
    this.socket.close();
    this.socket = null;
  }

  setupProxy(eventName) {
    this.socket.addEventListener(eventName, (event) => {
      this.emit(eventName, event);
    });
  }

  buildUri() {
    const urlOptions = {
      hostname: this.options.hostname,
      port: this.options.port,
      pathname: '/ws',
    };
    urlOptions.protocol = urlOptions.port === 443 ? 'wss' : this.options.protocol || 'ws';

    return url.format(urlOptions);
  }

  getCrendentials() {
    return {
      id: this.options.id,
      token: this.options.token,
    };
  }

  formatFrame(type, data) {
    return JSON.stringify({ type, data });
  }

  parseFrame(frame) {
    const message = JSON.parse(frame);
    if (!message.type) {
      const error = new Error('Invalid frame');
      error.frame = frame;
      throw error;
    }
    return message;
  }
}

export default Client;
