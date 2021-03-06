(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};

require.register("phoenix/priv/static/phoenix.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "phoenix");
  (function() {
    (function (global, factory) {
typeof exports === 'object' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
factory(global.Phoenix = global.Phoenix || {});
}(this, (function (exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Phoenix Channels JavaScript client
 *
 * ## Socket Connection
 *
 * A single connection is established to the server and
 * channels are multiplexed over the connection.
 * Connect to the server using the `Socket` class:
 *
 * ```javascript
 *     let socket = new Socket("/socket", {params: {userToken: "123"}})
 *     socket.connect()
 * ```
 *
 * The `Socket` constructor takes the mount point of the socket,
 * the authentication params, as well as options that can be found in
 * the Socket docs, such as configuring the `LongPoll` transport, and
 * heartbeat.
 *
 * ## Channels
 *
 * Channels are isolated, concurrent processes on the server that
 * subscribe to topics and broker events between the client and server.
 * To join a channel, you must provide the topic, and channel params for
 * authorization. Here's an example chat room example where `"new_msg"`
 * events are listened for, messages are pushed to the server, and
 * the channel is joined with ok/error/timeout matches:
 *
 * ```javascript
 *     let channel = socket.channel("room:123", {token: roomToken})
 *     channel.on("new_msg", msg => console.log("Got message", msg) )
 *     $input.onEnter( e => {
 *       channel.push("new_msg", {body: e.target.val}, 10000)
 *        .receive("ok", (msg) => console.log("created message", msg) )
 *        .receive("error", (reasons) => console.log("create failed", reasons) )
 *        .receive("timeout", () => console.log("Networking issue...") )
 *     })
 *     channel.join()
 *       .receive("ok", ({messages}) => console.log("catching up", messages) )
 *       .receive("error", ({reason}) => console.log("failed join", reason) )
 *       .receive("timeout", () => console.log("Networking issue. Still waiting...") )
 *```
 *
 * ## Joining
 *
 * Creating a channel with `socket.channel(topic, params)`, binds the params to
 * `channel.params`, which are sent up on `channel.join()`.
 * Subsequent rejoins will send up the modified params for
 * updating authorization params, or passing up last_message_id information.
 * Successful joins receive an "ok" status, while unsuccessful joins
 * receive "error".
 *
 * ## Duplicate Join Subscriptions
 *
 * While the client may join any number of topics on any number of channels,
 * the client may only hold a single subscription for each unique topic at any
 * given time. When attempting to create a duplicate subscription,
 * the server will close the existing channel, log a warning, and
 * spawn a new channel for the topic. The client will have their
 * `channel.onClose` callbacks fired for the existing channel, and the new
 * channel join will have its receive hooks processed as normal.
 *
 * ## Pushing Messages
 *
 * From the previous example, we can see that pushing messages to the server
 * can be done with `channel.push(eventName, payload)` and we can optionally
 * receive responses from the push. Additionally, we can use
 * `receive("timeout", callback)` to abort waiting for our other `receive` hooks
 *  and take action after some period of waiting. The default timeout is 5000ms.
 *
 *
 * ## Socket Hooks
 *
 * Lifecycle events of the multiplexed connection can be hooked into via
 * `socket.onError()` and `socket.onClose()` events, ie:
 *
 * ```javascript
 *     socket.onError( () => console.log("there was an error with the connection!") )
 *     socket.onClose( () => console.log("the connection dropped") )
 * ```
 *
 *
 * ## Channel Hooks
 *
 * For each joined channel, you can bind to `onError` and `onClose` events
 * to monitor the channel lifecycle, ie:
 *
 * ```javascript
 *     channel.onError( () => console.log("there was an error!") )
 *     channel.onClose( () => console.log("the channel has gone away gracefully") )
 * ```
 *
 * ### onError hooks
 *
 * `onError` hooks are invoked if the socket connection drops, or the channel
 * crashes on the server. In either case, a channel rejoin is attempted
 * automatically in an exponential backoff manner.
 *
 * ### onClose hooks
 *
 * `onClose` hooks are invoked only in two cases. 1) the channel explicitly
 * closed on the server, or 2). The client explicitly closed, by calling
 * `channel.leave()`
 *
 *
 * ## Presence
 *
 * The `Presence` object provides features for syncing presence information
 * from the server with the client and handling presences joining and leaving.
 *
 * ### Syncing initial state from the server
 *
 * `Presence.syncState` is used to sync the list of presences on the server
 * with the client's state. An optional `onJoin` and `onLeave` callback can
 * be provided to react to changes in the client's local presences across
 * disconnects and reconnects with the server.
 *
 * `Presence.syncDiff` is used to sync a diff of presence join and leave
 * events from the server, as they happen. Like `syncState`, `syncDiff`
 * accepts optional `onJoin` and `onLeave` callbacks to react to a user
 * joining or leaving from a device.
 *
 * ### Listing Presences
 *
 * `Presence.list` is used to return a list of presence information
 * based on the local state of metadata. By default, all presence
 * metadata is returned, but a `listBy` function can be supplied to
 * allow the client to select which metadata to use for a given presence.
 * For example, you may have a user online from different devices with
 * a metadata status of "online", but they have set themselves to "away"
 * on another device. In this case, the app may choose to use the "away"
 * status for what appears on the UI. The example below defines a `listBy`
 * function which prioritizes the first metadata which was registered for
 * each user. This could be the first tab they opened, or the first device
 * they came online from:
 *
 * ```javascript
 *     let state = {}
 *     state = Presence.syncState(state, stateFromServer)
 *     let listBy = (id, {metas: [first, ...rest]}) => {
 *       first.count = rest.length + 1 // count of this user's presences
 *       first.id = id
 *       return first
 *     }
 *     let onlineUsers = Presence.list(state, listBy)
 * ```
 *
 *
 * ### Example Usage
 *```javascript
 *     // detect if user has joined for the 1st time or from another tab/device
 *     let onJoin = (id, current, newPres) => {
 *       if(!current){
 *         console.log("user has entered for the first time", newPres)
 *       } else {
 *         console.log("user additional presence", newPres)
 *       }
 *     }
 *     // detect if user has left from all tabs/devices, or is still present
 *     let onLeave = (id, current, leftPres) => {
 *       if(current.metas.length === 0){
 *         console.log("user has left from all devices", leftPres)
 *       } else {
 *         console.log("user left from a device", leftPres)
 *       }
 *     }
 *     let presences = {} // client's initial empty presence state
 *     // receive initial presence data from server, sent after join
 *     myChannel.on("presence_state", state => {
 *       presences = Presence.syncState(presences, state, onJoin, onLeave)
 *       displayUsers(Presence.list(presences))
 *     })
 *     // receive "presence_diff" from server, containing join/leave events
 *     myChannel.on("presence_diff", diff => {
 *       presences = Presence.syncDiff(presences, diff, onJoin, onLeave)
 *       this.setState({users: Presence.list(room.presences, listBy)})
 *     })
 * ```
 * @module phoenix
 */

var VSN = "2.0.0";
var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
var DEFAULT_TIMEOUT = 10000;
var WS_CLOSE_NORMAL = 1000;
var CHANNEL_STATES = {
  closed: "closed",
  errored: "errored",
  joined: "joined",
  joining: "joining",
  leaving: "leaving"
};
var CHANNEL_EVENTS = {
  close: "phx_close",
  error: "phx_error",
  join: "phx_join",
  reply: "phx_reply",
  leave: "phx_leave"
};
var CHANNEL_LIFECYCLE_EVENTS = [CHANNEL_EVENTS.close, CHANNEL_EVENTS.error, CHANNEL_EVENTS.join, CHANNEL_EVENTS.reply, CHANNEL_EVENTS.leave];
var TRANSPORTS = {
  longpoll: "longpoll",
  websocket: "websocket"
};

/**
 * Initializes the Push
 * @param {Channel} channel - The Channel
 * @param {string} event - The event, for example `"phx_join"`
 * @param {Object} payload - The payload, for example `{user_id: 123}`
 * @param {number} timeout - The push timeout in milliseconds
 */

var Push = function () {
  function Push(channel, event, payload, timeout) {
    _classCallCheck(this, Push);

    this.channel = channel;
    this.event = event;
    this.payload = payload || {};
    this.receivedResp = null;
    this.timeout = timeout;
    this.timeoutTimer = null;
    this.recHooks = [];
    this.sent = false;
  }

  /**
   *
   * @param {number} timeout
   */


  _createClass(Push, [{
    key: "resend",
    value: function resend(timeout) {
      this.timeout = timeout;
      this.reset();
      this.send();
    }

    /**
     *
     */

  }, {
    key: "send",
    value: function send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload,
        ref: this.ref,
        join_ref: this.channel.joinRef()
      });
    }

    /**
     *
     * @param {*} status
     * @param {*} callback
     */

  }, {
    key: "receive",
    value: function receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }

      this.recHooks.push({ status: status, callback: callback });
      return this;
    }

    // private

  }, {
    key: "reset",
    value: function reset() {
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
    }
  }, {
    key: "matchReceive",
    value: function matchReceive(_ref) {
      var status = _ref.status,
          response = _ref.response,
          ref = _ref.ref;

      this.recHooks.filter(function (h) {
        return h.status === status;
      }).forEach(function (h) {
        return h.callback(response);
      });
    }
  }, {
    key: "cancelRefEvent",
    value: function cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
  }, {
    key: "cancelTimeout",
    value: function cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  }, {
    key: "startTimeout",
    value: function startTimeout() {
      var _this = this;

      if (this.timeoutTimer) {
        this.cancelTimeout();
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);

      this.channel.on(this.refEvent, function (payload) {
        _this.cancelRefEvent();
        _this.cancelTimeout();
        _this.receivedResp = payload;
        _this.matchReceive(payload);
      });

      this.timeoutTimer = setTimeout(function () {
        _this.trigger("timeout", {});
      }, this.timeout);
    }
  }, {
    key: "hasReceived",
    value: function hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
  }, {
    key: "trigger",
    value: function trigger(status, response) {
      this.channel.trigger(this.refEvent, { status: status, response: response });
    }
  }]);

  return Push;
}();

/**
 *
 * @param {string} topic
 * @param {Object} params
 * @param {Socket} socket
 */


var Channel = exports.Channel = function () {
  function Channel(topic, params, socket) {
    var _this2 = this;

    _classCallCheck(this, Channel);

    this.state = CHANNEL_STATES.closed;
    this.topic = topic;
    this.params = params || {};
    this.socket = socket;
    this.bindings = [];
    this.timeout = this.socket.timeout;
    this.joinedOnce = false;
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
    this.pushBuffer = [];
    this.rejoinTimer = new Timer(function () {
      return _this2.rejoinUntilConnected();
    }, this.socket.reconnectAfterMs);
    this.joinPush.receive("ok", function () {
      _this2.state = CHANNEL_STATES.joined;
      _this2.rejoinTimer.reset();
      _this2.pushBuffer.forEach(function (pushEvent) {
        return pushEvent.send();
      });
      _this2.pushBuffer = [];
    });
    this.onClose(function () {
      _this2.rejoinTimer.reset();
      _this2.socket.log("channel", "close " + _this2.topic + " " + _this2.joinRef());
      _this2.state = CHANNEL_STATES.closed;
      _this2.socket.remove(_this2);
    });
    this.onError(function (reason) {
      if (_this2.isLeaving() || _this2.isClosed()) {
        return;
      }
      _this2.socket.log("channel", "error " + _this2.topic, reason);
      _this2.state = CHANNEL_STATES.errored;
      _this2.rejoinTimer.scheduleTimeout();
    });
    this.joinPush.receive("timeout", function () {
      if (!_this2.isJoining()) {
        return;
      }
      _this2.socket.log("channel", "timeout " + _this2.topic + " (" + _this2.joinRef() + ")", _this2.joinPush.timeout);
      var leavePush = new Push(_this2, CHANNEL_EVENTS.leave, {}, _this2.timeout);
      leavePush.send();
      _this2.state = CHANNEL_STATES.errored;
      _this2.joinPush.reset();
      _this2.rejoinTimer.scheduleTimeout();
    });
    this.on(CHANNEL_EVENTS.reply, function (payload, ref) {
      _this2.trigger(_this2.replyEventName(ref), payload);
    });
  }

  _createClass(Channel, [{
    key: "rejoinUntilConnected",
    value: function rejoinUntilConnected() {
      this.rejoinTimer.scheduleTimeout();
      if (this.socket.isConnected()) {
        this.rejoin();
      }
    }
  }, {
    key: "join",
    value: function join() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.timeout;

      if (this.joinedOnce) {
        throw "tried to join multiple times. 'join' can only be called a single time per channel instance";
      } else {
        this.joinedOnce = true;
        this.rejoin(timeout);
        return this.joinPush;
      }
    }
  }, {
    key: "onClose",
    value: function onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
  }, {
    key: "onError",
    value: function onError(callback) {
      this.on(CHANNEL_EVENTS.error, function (reason) {
        return callback(reason);
      });
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      this.bindings.push({ event: event, callback: callback });
    }
  }, {
    key: "off",
    value: function off(event) {
      this.bindings = this.bindings.filter(function (bind) {
        return bind.event !== event;
      });
    }
  }, {
    key: "canPush",
    value: function canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
  }, {
    key: "push",
    value: function push(event, payload) {
      var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.timeout;

      if (!this.joinedOnce) {
        throw "tried to push '" + event + "' to '" + this.topic + "' before joining. Use channel.join() before pushing events";
      }
      var pushEvent = new Push(this, event, payload, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }

      return pushEvent;
    }

    /** Leaves the channel
     *
     * Unsubscribes from server events, and
     * instructs channel to terminate on server
     *
     * Triggers onClose() hooks
     *
     * To receive leave acknowledgements, use the a `receive`
     * hook to bind to the server ack, ie:
     *
     * ```javascript
     *     channel.leave().receive("ok", () => alert("left!") )
     * ```
     */

  }, {
    key: "leave",
    value: function leave() {
      var _this3 = this;

      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.timeout;

      this.state = CHANNEL_STATES.leaving;
      var onClose = function onClose() {
        _this3.socket.log("channel", "leave " + _this3.topic);
        _this3.trigger(CHANNEL_EVENTS.close, "leave");
      };
      var leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
      leavePush.receive("ok", function () {
        return onClose();
      }).receive("timeout", function () {
        return onClose();
      });
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }

      return leavePush;
    }

    /**
     * Overridable message hook
     *
     * Receives all events for specialized message handling
     * before dispatching to the channel callbacks.
     *
     * Must return the payload, modified or unmodified
     */

  }, {
    key: "onMessage",
    value: function onMessage(event, payload, ref) {
      return payload;
    }

    // private

  }, {
    key: "isMember",
    value: function isMember(topic, event, payload, joinRef) {
      if (this.topic !== topic) {
        return false;
      }
      var isLifecycleEvent = CHANNEL_LIFECYCLE_EVENTS.indexOf(event) >= 0;

      if (joinRef && isLifecycleEvent && joinRef !== this.joinRef()) {
        this.socket.log("channel", "dropping outdated message", { topic: topic, event: event, payload: payload, joinRef: joinRef });
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: "joinRef",
    value: function joinRef() {
      return this.joinPush.ref;
    }
  }, {
    key: "sendJoin",
    value: function sendJoin(timeout) {
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
  }, {
    key: "rejoin",
    value: function rejoin() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.timeout;
      if (this.isLeaving()) {
        return;
      }
      this.sendJoin(timeout);
    }
  }, {
    key: "trigger",
    value: function trigger(event, payload, ref, joinRef) {
      var _this4 = this;

      var handledPayload = this.onMessage(event, payload, ref, joinRef);
      if (payload && !handledPayload) {
        throw "channel onMessage callbacks must return the payload, modified or unmodified";
      }

      this.bindings.filter(function (bind) {
        return bind.event === event;
      }).map(function (bind) {
        return bind.callback(handledPayload, ref, joinRef || _this4.joinRef());
      });
    }
  }, {
    key: "replyEventName",
    value: function replyEventName(ref) {
      return "chan_reply_" + ref;
    }
  }, {
    key: "isClosed",
    value: function isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
  }, {
    key: "isErrored",
    value: function isErrored() {
      return this.state === CHANNEL_STATES.errored;
    }
  }, {
    key: "isJoined",
    value: function isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
  }, {
    key: "isJoining",
    value: function isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
  }, {
    key: "isLeaving",
    value: function isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
  }]);

  return Channel;
}();

var Serializer = {
  encode: function encode(msg, callback) {
    var payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
    return callback(JSON.stringify(payload));
  },
  decode: function decode(rawPayload, callback) {
    var _JSON$parse = JSON.parse(rawPayload),
        _JSON$parse2 = _slicedToArray(_JSON$parse, 5),
        join_ref = _JSON$parse2[0],
        ref = _JSON$parse2[1],
        topic = _JSON$parse2[2],
        event = _JSON$parse2[3],
        payload = _JSON$parse2[4];

    return callback({ join_ref: join_ref, ref: ref, topic: topic, event: event, payload: payload });
  }
};

/** Initializes the Socket
 *
 *
 * For IE8 support use an ES5-shim (https://github.com/es-shims/es5-shim)
 *
 * @param {string} endPoint - The string WebSocket endpoint, ie, `"ws://example.com/socket"`,
 *                                               `"wss://example.com"`
 *                                               `"/socket"` (inherited host & protocol)
 * @param {Object} opts - Optional configuration
 * @param {string} opts.transport - The Websocket Transport, for example WebSocket or Phoenix.LongPoll.
 *
 * Defaults to WebSocket with automatic LongPoll fallback.
 * @param {Function} opts.encode - The function to encode outgoing messages.
 *
 * Defaults to JSON:
 *
 * ```javascript
 * (payload, callback) => callback(JSON.stringify(payload))
 * ```
 *
 * @param {Function} opts.decode - The function to decode incoming messages.
 *
 * Defaults to JSON:
 *
 * ```javascript
 * (payload, callback) => callback(JSON.parse(payload))
 * ```
 *
 * @param {number} opts.timeout - The default timeout in milliseconds to trigger push timeouts.
 *
 * Defaults `DEFAULT_TIMEOUT`
 * @param {number} opts.heartbeatIntervalMs - The millisec interval to send a heartbeat message
 * @param {number} opts.reconnectAfterMs - The optional function that returns the millsec reconnect interval.
 *
 * Defaults to stepped backoff of:
 *
 * ```javascript
 *  function(tries){
 *    return [1000, 5000, 10000][tries - 1] || 10000
 *  }
 * ```
 * @param {Function} opts.logger - The optional function for specialized logging, ie:
 * ```javascript
 * logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
 * ```
 *
 * @param {number}  opts.longpollerTimeout - The maximum timeout of a long poll AJAX request.
 *
 * Defaults to 20s (double the server long poll timer).
 *
 * @param {Object}  opts.params - The optional params to pass when connecting
 *
 *
*/

var Socket = exports.Socket = function () {
  function Socket(endPoint) {
    var _this5 = this;

    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Socket);

    this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
    this.channels = [];
    this.sendBuffer = [];
    this.ref = 0;
    this.timeout = opts.timeout || DEFAULT_TIMEOUT;
    this.transport = opts.transport || window.WebSocket || LongPoll;
    this.defaultEncoder = Serializer.encode;
    this.defaultDecoder = Serializer.decode;
    if (this.transport !== LongPoll) {
      this.encode = opts.encode || this.defaultEncoder;
      this.decode = opts.decode || this.defaultDecoder;
    } else {
      this.encode = this.defaultEncoder;
      this.decode = this.defaultDecoder;
    }
    this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 30000;
    this.reconnectAfterMs = opts.reconnectAfterMs || function (tries) {
      return [1000, 2000, 5000, 10000][tries - 1] || 10000;
    };
    this.logger = opts.logger || function () {}; // noop
    this.longpollerTimeout = opts.longpollerTimeout || 20000;
    this.params = opts.params || {};
    this.endPoint = endPoint + "/" + TRANSPORTS.websocket;
    this.heartbeatTimer = null;
    this.pendingHeartbeatRef = null;
    this.reconnectTimer = new Timer(function () {
      _this5.disconnect(function () {
        return _this5.connect();
      });
    }, this.reconnectAfterMs);
  }

  _createClass(Socket, [{
    key: "protocol",
    value: function protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
  }, {
    key: "endPointURL",
    value: function endPointURL() {
      var uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params), { vsn: VSN });
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return this.protocol() + ":" + uri;
      }

      return this.protocol() + "://" + location.host + uri;
    }
  }, {
    key: "disconnect",
    value: function disconnect(callback, code, reason) {
      if (this.conn) {
        this.conn.onclose = function () {}; // noop
        if (code) {
          this.conn.close(code, reason || "");
        } else {
          this.conn.close();
        }
        this.conn = null;
      }
      callback && callback();
    }

    /**
     *
     * @param {Object} params - The params to send when connecting, for example `{user_id: userToken}`
     */

  }, {
    key: "connect",
    value: function connect(params) {
      var _this6 = this;

      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = params;
      }
      if (this.conn) {
        return;
      }

      this.conn = new this.transport(this.endPointURL());
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = function () {
        return _this6.onConnOpen();
      };
      this.conn.onerror = function (error) {
        return _this6.onConnError(error);
      };
      this.conn.onmessage = function (event) {
        return _this6.onConnMessage(event);
      };
      this.conn.onclose = function (event) {
        return _this6.onConnClose(event);
      };
    }

    /**
     * Logs the message. Override `this.logger` for specialized logging. noops by default
     * @param {string} kind
     * @param {string} msg
     * @param {Object} data
     */

  }, {
    key: "log",
    value: function log(kind, msg, data) {
      this.logger(kind, msg, data);
    }

    // Registers callbacks for connection state change events
    //
    // Examples
    //
    //    socket.onError(function(error){ alert("An error occurred") })
    //

  }, {
    key: "onOpen",
    value: function onOpen(callback) {
      this.stateChangeCallbacks.open.push(callback);
    }
  }, {
    key: "onClose",
    value: function onClose(callback) {
      this.stateChangeCallbacks.close.push(callback);
    }
  }, {
    key: "onError",
    value: function onError(callback) {
      this.stateChangeCallbacks.error.push(callback);
    }
  }, {
    key: "onMessage",
    value: function onMessage(callback) {
      this.stateChangeCallbacks.message.push(callback);
    }
  }, {
    key: "onConnOpen",
    value: function onConnOpen() {
      var _this7 = this;

      this.log("transport", "connected to " + this.endPointURL());
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      if (!this.conn.skipHeartbeat) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(function () {
          return _this7.sendHeartbeat();
        }, this.heartbeatIntervalMs);
      }
      this.stateChangeCallbacks.open.forEach(function (callback) {
        return callback();
      });
    }
  }, {
    key: "onConnClose",
    value: function onConnClose(event) {
      this.log("transport", "close", event);
      this.triggerChanError();
      clearInterval(this.heartbeatTimer);
      this.reconnectTimer.scheduleTimeout();
      this.stateChangeCallbacks.close.forEach(function (callback) {
        return callback(event);
      });
    }
  }, {
    key: "onConnError",
    value: function onConnError(error) {
      this.log("transport", error);
      this.triggerChanError();
      this.stateChangeCallbacks.error.forEach(function (callback) {
        return callback(error);
      });
    }
  }, {
    key: "triggerChanError",
    value: function triggerChanError() {
      this.channels.forEach(function (channel) {
        return channel.trigger(CHANNEL_EVENTS.error);
      });
    }
  }, {
    key: "connectionState",
    value: function connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      return this.connectionState() === "open";
    }
  }, {
    key: "remove",
    value: function remove(channel) {
      this.channels = this.channels.filter(function (c) {
        return c.joinRef() !== channel.joinRef();
      });
    }
  }, {
    key: "channel",
    value: function channel(topic) {
      var chanParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
  }, {
    key: "push",
    value: function push(data) {
      var _this8 = this;

      var topic = data.topic,
          event = data.event,
          payload = data.payload,
          ref = data.ref,
          join_ref = data.join_ref;

      var callback = function callback() {
        _this8.encode(data, function (result) {
          _this8.conn.send(result);
        });
      };
      this.log("push", topic + " " + event + " (" + join_ref + ", " + ref + ")", payload);
      if (this.isConnected()) {
        callback();
      } else {
        this.sendBuffer.push(callback);
      }
    }

    /**
     * Return the next message ref, accounting for overflows
     */

  }, {
    key: "makeRef",
    value: function makeRef() {
      var newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }

      return this.ref.toString();
    }
  }, {
    key: "sendHeartbeat",
    value: function sendHeartbeat() {
      if (!this.isConnected()) {
        return;
      }
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
        this.conn.close(WS_CLOSE_NORMAL, "hearbeat timeout");
        return;
      }
      this.pendingHeartbeatRef = this.makeRef();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
    }
  }, {
    key: "flushSendBuffer",
    value: function flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach(function (callback) {
          return callback();
        });
        this.sendBuffer = [];
      }
    }
  }, {
    key: "onConnMessage",
    value: function onConnMessage(rawMessage) {
      var _this9 = this;

      this.decode(rawMessage.data, function (msg) {
        var topic = msg.topic,
            event = msg.event,
            payload = msg.payload,
            ref = msg.ref,
            join_ref = msg.join_ref;

        if (ref && ref === _this9.pendingHeartbeatRef) {
          _this9.pendingHeartbeatRef = null;
        }

        _this9.log("receive", (payload.status || "") + " " + topic + " " + event + " " + (ref && "(" + ref + ")" || ""), payload);
        _this9.channels.filter(function (channel) {
          return channel.isMember(topic, event, payload, join_ref);
        }).forEach(function (channel) {
          return channel.trigger(event, payload, ref, join_ref);
        });
        _this9.stateChangeCallbacks.message.forEach(function (callback) {
          return callback(msg);
        });
      });
    }
  }]);

  return Socket;
}();

var LongPoll = exports.LongPoll = function () {
  function LongPoll(endPoint) {
    _classCallCheck(this, LongPoll);

    this.endPoint = null;
    this.token = null;
    this.skipHeartbeat = true;
    this.onopen = function () {}; // noop
    this.onerror = function () {}; // noop
    this.onmessage = function () {}; // noop
    this.onclose = function () {}; // noop
    this.pollEndpoint = this.normalizeEndpoint(endPoint);
    this.readyState = SOCKET_STATES.connecting;

    this.poll();
  }

  _createClass(LongPoll, [{
    key: "normalizeEndpoint",
    value: function normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)\/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
  }, {
    key: "endpointURL",
    value: function endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
  }, {
    key: "closeAndRetry",
    value: function closeAndRetry() {
      this.close();
      this.readyState = SOCKET_STATES.connecting;
    }
  }, {
    key: "ontimeout",
    value: function ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry();
    }
  }, {
    key: "poll",
    value: function poll() {
      var _this10 = this;

      if (!(this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting)) {
        return;
      }

      Ajax.request("GET", this.endpointURL(), "application/json", null, this.timeout, this.ontimeout.bind(this), function (resp) {
        if (resp) {
          var status = resp.status,
              token = resp.token,
              messages = resp.messages;

          _this10.token = token;
        } else {
          var status = 0;
        }

        switch (status) {
          case 200:
            messages.forEach(function (msg) {
              return _this10.onmessage({ data: msg });
            });
            _this10.poll();
            break;
          case 204:
            _this10.poll();
            break;
          case 410:
            _this10.readyState = SOCKET_STATES.open;
            _this10.onopen();
            _this10.poll();
            break;
          case 0:
          case 500:
            _this10.onerror();
            _this10.closeAndRetry();
            break;
          default:
            throw "unhandled poll status " + status;
        }
      });
    }
  }, {
    key: "send",
    value: function send(body) {
      var _this11 = this;

      Ajax.request("POST", this.endpointURL(), "application/json", body, this.timeout, this.onerror.bind(this, "timeout"), function (resp) {
        if (!resp || resp.status !== 200) {
          _this11.onerror(resp && resp.status);
          _this11.closeAndRetry();
        }
      });
    }
  }, {
    key: "close",
    value: function close(code, reason) {
      this.readyState = SOCKET_STATES.closed;
      this.onclose();
    }
  }]);

  return LongPoll;
}();

var Ajax = exports.Ajax = function () {
  function Ajax() {
    _classCallCheck(this, Ajax);
  }

  _createClass(Ajax, null, [{
    key: "request",
    value: function request(method, endPoint, accept, body, timeout, ontimeout, callback) {
      if (window.XDomainRequest) {
        var req = new XDomainRequest(); // IE8, IE9
        this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else {
        var _req = window.XMLHttpRequest ? new window.XMLHttpRequest() : // IE7+, Firefox, Chrome, Opera, Safari
        new ActiveXObject("Microsoft.XMLHTTP"); // IE6, IE5
        this.xhrRequest(_req, method, endPoint, accept, body, timeout, ontimeout, callback);
      }
    }
  }, {
    key: "xdomainRequest",
    value: function xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      var _this12 = this;

      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = function () {
        var response = _this12.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }

      // Work around bug in IE9 that requires an attached onprogress handler
      req.onprogress = function () {};

      req.send(body);
    }
  }, {
    key: "xhrRequest",
    value: function xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
      var _this13 = this;

      req.open(method, endPoint, true);
      req.timeout = timeout;
      req.setRequestHeader("Content-Type", accept);
      req.onerror = function () {
        callback && callback(null);
      };
      req.onreadystatechange = function () {
        if (req.readyState === _this13.states.complete && callback) {
          var response = _this13.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }

      req.send(body);
    }
  }, {
    key: "parseJSON",
    value: function parseJSON(resp) {
      if (!resp || resp === "") {
        return null;
      }

      try {
        return JSON.parse(resp);
      } catch (e) {
        console && console.log("failed to parse JSON response", resp);
        return null;
      }
    }
  }, {
    key: "serialize",
    value: function serialize(obj, parentKey) {
      var queryStr = [];
      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue;
        }
        var paramKey = parentKey ? parentKey + "[" + key + "]" : key;
        var paramVal = obj[key];
        if ((typeof paramVal === "undefined" ? "undefined" : _typeof(paramVal)) === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
  }, {
    key: "appendParams",
    value: function appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }

      var prefix = url.match(/\?/) ? "&" : "?";
      return "" + url + prefix + this.serialize(params);
    }
  }]);

  return Ajax;
}();

Ajax.states = { complete: 4 };

var Presence = exports.Presence = {
  syncState: function syncState(currentState, newState, onJoin, onLeave) {
    var _this14 = this;

    var state = this.clone(currentState);
    var joins = {};
    var leaves = {};

    this.map(state, function (key, presence) {
      if (!newState[key]) {
        leaves[key] = presence;
      }
    });
    this.map(newState, function (key, newPresence) {
      var currentPresence = state[key];
      if (currentPresence) {
        var newRefs = newPresence.metas.map(function (m) {
          return m.phx_ref;
        });
        var curRefs = currentPresence.metas.map(function (m) {
          return m.phx_ref;
        });
        var joinedMetas = newPresence.metas.filter(function (m) {
          return curRefs.indexOf(m.phx_ref) < 0;
        });
        var leftMetas = currentPresence.metas.filter(function (m) {
          return newRefs.indexOf(m.phx_ref) < 0;
        });
        if (joinedMetas.length > 0) {
          joins[key] = newPresence;
          joins[key].metas = joinedMetas;
        }
        if (leftMetas.length > 0) {
          leaves[key] = _this14.clone(currentPresence);
          leaves[key].metas = leftMetas;
        }
      } else {
        joins[key] = newPresence;
      }
    });
    return this.syncDiff(state, { joins: joins, leaves: leaves }, onJoin, onLeave);
  },
  syncDiff: function syncDiff(currentState, _ref2, onJoin, onLeave) {
    var joins = _ref2.joins,
        leaves = _ref2.leaves;

    var state = this.clone(currentState);
    if (!onJoin) {
      onJoin = function onJoin() {};
    }
    if (!onLeave) {
      onLeave = function onLeave() {};
    }

    this.map(joins, function (key, newPresence) {
      var currentPresence = state[key];
      state[key] = newPresence;
      if (currentPresence) {
        var _state$key$metas;

        (_state$key$metas = state[key].metas).unshift.apply(_state$key$metas, _toConsumableArray(currentPresence.metas));
      }
      onJoin(key, currentPresence, newPresence);
    });
    this.map(leaves, function (key, leftPresence) {
      var currentPresence = state[key];
      if (!currentPresence) {
        return;
      }
      var refsToRemove = leftPresence.metas.map(function (m) {
        return m.phx_ref;
      });
      currentPresence.metas = currentPresence.metas.filter(function (p) {
        return refsToRemove.indexOf(p.phx_ref) < 0;
      });
      onLeave(key, currentPresence, leftPresence);
      if (currentPresence.metas.length === 0) {
        delete state[key];
      }
    });
    return state;
  },
  list: function list(presences, chooser) {
    if (!chooser) {
      chooser = function chooser(key, pres) {
        return pres;
      };
    }

    return this.map(presences, function (key, presence) {
      return chooser(key, presence);
    });
  },


  // private

  map: function map(obj, func) {
    return Object.getOwnPropertyNames(obj).map(function (key) {
      return func(key, obj[key]);
    });
  },
  clone: function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};

/**
 *
 * Creates a timer that accepts a `timerCalc` function to perform
 * calculated timeout retries, such as exponential backoff.
 *
 * ## Examples
 *
 * ```javascript
 *    let reconnectTimer = new Timer(() => this.connect(), function(tries){
 *      return [1000, 5000, 10000][tries - 1] || 10000
 *    })
 *    reconnectTimer.scheduleTimeout() // fires after 1000
 *    reconnectTimer.scheduleTimeout() // fires after 5000
 *    reconnectTimer.reset()
 *    reconnectTimer.scheduleTimeout() // fires after 1000
 * ```
 * @param {Function} callback
 * @param {Function} timerCalc
 */

var Timer = function () {
  function Timer(callback, timerCalc) {
    _classCallCheck(this, Timer);

    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = null;
    this.tries = 0;
  }

  _createClass(Timer, [{
    key: "reset",
    value: function reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }

    /**
     * Cancels any previous scheduleTimeout and schedules callback
     */

  }, {
    key: "scheduleTimeout",
    value: function scheduleTimeout() {
      var _this15 = this;

      clearTimeout(this.timer);

      this.timer = setTimeout(function () {
        _this15.tries = _this15.tries + 1;
        _this15.callback();
      }, this.timerCalc(this.tries + 1));
    }
  }]);

  return Timer;
}();

})));
  })();
});

require.register("phoenix_html/priv/static/phoenix_html.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "phoenix_html");
  (function() {
    "use strict";

(function() {
  function buildHiddenInput(name, value) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
  }

  function handleLinkClick(link) {
    var message = link.getAttribute("data-confirm");
    if(message && !window.confirm(message)) {
        return;
    }

    var to = link.getAttribute("data-to"),
        method = buildHiddenInput("_method", link.getAttribute("data-method")),
        csrf = buildHiddenInput("_csrf_token", link.getAttribute("data-csrf")),
        form = document.createElement("form");

    form.method = (link.getAttribute("data-method") === "get") ? "get" : "post";
    form.action = to;
    form.style.display = "hidden";

    form.appendChild(csrf);
    form.appendChild(method);
    document.body.appendChild(form);
    form.submit();
  }

  window.addEventListener("click", function(e) {
    var element = e.target;

    while (element && element.getAttribute) {
      if(element.getAttribute("data-method")) {
        handleLinkClick(element);
        e.preventDefault();
        return false;
      } else {
        element = element.parentNode;
      }
    }
  }, false);
})();
  })();
});
require.register("js/app.js", function(exports, require, module) {
"use strict";

require("phoenix_html");

var _stream = require("./stream");

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

});

;require.register("js/current.js", function(exports, require, module) {
'use strict';

$(document).ready(function () {

    var currentPrice = {};
    var socket = io.connect('https://streamer.cryptocompare.com/');
    // Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
    // Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
    // For aggregate quote updates use CCCAGG as market
    var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~BCH~USD', '5~CCCAGG~ETC~USD', '5~CCCAGG~LTC~USD', '5~CCCAGG~DASH~USD', '5~CCCAGG~ZEC~USD'];
    socket.emit('SubAdd', { subs: subscription });
    socket.on("m", function (message) {
        var messageType = message.substring(0, message.indexOf("~"));
        var res = {};
        if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
            res = CCC.CURRENT.unpack(message);
            dataUnpack(res);
        }
    });

    var dataUnpack = function dataUnpack(data) {
        var from = data['FROMSYMBOL'];
        var to = data['TOSYMBOL'];
        var fsym = CCC.STATIC.CURRENCY.getSymbol(from);
        var tsym = CCC.STATIC.CURRENCY.getSymbol(to);
        var pair = from + to;
        console.log(data);

        if (!currentPrice.hasOwnProperty(pair)) {
            currentPrice[pair] = {};
        }

        for (var key in data) {
            currentPrice[pair][key] = data[key];
        }

        if (currentPrice[pair]['LASTTRADEID']) {
            currentPrice[pair]['LASTTRADEID'] = parseInt(currentPrice[pair]['LASTTRADEID']).toFixed(0);
        }
        currentPrice[pair]['CHANGE24HOUR'] = CCC.convertValueToDisplay(tsym, currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']);
        currentPrice[pair]['CHANGE24HOURPCT'] = ((currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']) / currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%";;
        displayData(currentPrice[pair], from, tsym, fsym);
    };

    var displayData = function displayData(current, from, tsym, fsym) {
        //console.log(current);

        var priceDirection = current.FLAGS;

        for (var key in current) {

            if (key == 'CHANGE24HOURPCT') {
                $('#' + key + '_' + from).text(' (' + current[key] + ')');
            } else if (key == 'LASTVOLUMETO' || key == 'VOLUME24HOURTO') {
                $('#' + key + '_' + from).text(CCC.convertValueToDisplay(tsym, current[key]));
            } else if (key == 'LASTVOLUME' || key == 'VOLUME24HOUR' || key == 'OPEN24HOUR' || key == 'OPENHOUR' || key == 'HIGH24HOUR' || key == 'HIGHHOUR' || key == 'LOWHOUR' || key == 'LOW24HOUR') {
                $('#' + key + '_' + from).text(CCC.convertValueToDisplay(fsym, current[key]));
            } else {
                $('#' + key + '_' + from).text(current[key]);
            }
        }

        $('#PRICE_' + from).removeClass();
        if (priceDirection & 1) {
            $('#PRICE_' + from).addClass("up");
        } else if (priceDirection & 2) {
            $('#PRICE_' + from).addClass("down");
        }
        if (current['PRICE'] > current['OPEN24HOUR']) {
            $('#CHANGE24HOURPCT_' + from).removeClass();
            $('#CHANGE24HOURPCT_' + from).addClass("up");
        } else if (current['PRICE'] < current['OPEN24HOUR']) {
            $('#CHANGE24HOURPCT_' + from).removeClass();
            $('#CHANGE24HOURPCT_' + from).addClass("down");
        }
    };
});
$(document).ready(function () {

    var currentPrice = {};

    var socket = io.connect('https://streamer.cryptocompare.com/');
    // Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
    // Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
    // For aggregate quote updates use CCCAGG as market

    var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~BCH~USD', '5~CCCAGG~ETC~USD', '5~CCCAGG~LTC~USD', '5~CCCAGG~DASH~USD', '5~CCCAGG~ZEC~USD'];

    socket.emit('SubAdd', { subs: subscription });

    socket.on("m", function (message) {
        var messageType = message.substring(0, message.indexOf("~"));
        var res = {};
        if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
            res = CCC.CURRENT.unpack(message);
            dataUnpack(res);
        }
    });

    var dataUnpack = function dataUnpack(data) {
        var from = data['FROMSYMBOL'];
        var to = data['TOSYMBOL'];
        var fsym = CCC.STATIC.CURRENCY.getSymbol(from);
        var tsym = CCC.STATIC.CURRENCY.getSymbol(to);
        var pair = from + to;

        //console.log(data);

        if (!currentPrice.hasOwnProperty(pair)) {
            currentPrice[pair] = {};
        }

        for (var key in data) {
            currentPrice[pair][key] = data[key];
        }

        if (currentPrice[pair]['LASTTRADEID']) {
            currentPrice[pair]['LASTTRADEID'] = parseInt(currentPrice[pair]['LASTTRADEID']).toFixed(0);
        }
        currentPrice[pair]['CHANGE24HOUR'] = CCC.convertValueToDisplay(tsym, currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']);
        currentPrice[pair]['CHANGE24HOURPCT'] = ((currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']) / currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%";;
        displayData(currentPrice[pair], from, tsym, fsym);
    };

    var displayData = function displayData(current, from, tsym, fsym) {
        //console.log(current);

        var priceDirection = current.FLAGS;

        for (var key in current) {

            if (key == 'CHANGE24HOURPCT') {
                $('#' + key + '_' + from).text(' (' + current[key] + ')');
            } else if (key == 'LASTVOLUMETO' || key == 'VOLUME24HOURTO') {
                $('#' + key + '_' + from).text(CCC.convertValueToDisplay(tsym, current[key]));
            } else if (key == 'LASTVOLUME' || key == 'VOLUME24HOUR' || key == 'OPEN24HOUR' || key == 'OPENHOUR' || key == 'HIGH24HOUR' || key == 'HIGHHOUR' || key == 'LOWHOUR' || key == 'LOW24HOUR') {
                $('#' + key + '_' + from).text(CCC.convertValueToDisplay(fsym, current[key]));
            } else {
                if (key == 'LASTMARKET') {
                    $('#' + current[key] + "_" + from + "_PRICE").text(current['PRICE']);
                }

                $('#' + key + '_' + from).text(current[key]);
            }
        }

        $('#PRICE_' + from).removeClass();
        if (priceDirection & 1) {
            $('#PRICE_' + from).addClass("up");
        } else if (priceDirection & 2) {
            $('#PRICE_' + from).addClass("down");
        }
        if (current['PRICE'] > current['OPEN24HOUR']) {
            $('#CHANGE24HOURPCT_' + from).removeClass();
            $('#CHANGE24HOURPCT_' + from).addClass("up");
        } else if (current['PRICE'] < current['OPEN24HOUR']) {
            $('#CHANGE24HOURPCT_' + from).removeClass();
            $('#CHANGE24HOURPCT_' + from).addClass("down");
        }
    };
});

});

require.register("js/socket.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _phoenix = require("phoenix");

var socket = new _phoenix.Socket("/socket", { params: { token: window.userToken } });

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/web/endpoint.ex":
socket.connect();

// Now that you are connected, you can join channels with a topic:
var channel = socket.channel("topic:subtopic", {});
channel.join().receive("ok", function (resp) {
  console.log("Joined successfully", resp);
}).receive("error", function (resp) {
  console.log("Unable to join", resp);
});

exports.default = socket;

});

require.register("js/stream.js", function(exports, require, module) {
'use strict';

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
/*         STREAM UTILITIES          */
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

var CCC = CCC || {};

CCC.STATIC = CCC.STATIC || {};

CCC.STATIC.TYPE = {
    'TRADE': '0',
    'FEEDNEWS': '1',
    'CURRENT': '2',
    'LOADCOMPLATE': '3',
    'COINPAIRS': '4',
    'CURRENTAGG': '5',
    'TOPLIST': '6',
    'TOPLISTCHANGE': '7',
    'ORDERBOOK': '8',
    'FULLORDERBOOK': '9',
    'ACTIVATION': '10',

    'TRADECATCHUP': '100',
    'NEWSCATCHUP': '101',

    'TRADECATCHUPCOMPLETE': '300',
    'NEWSCATCHUPCOMPLETE': '301'

};

CCC.STATIC.CURRENCY = CCC.STATIC.CURRENCY || {};

CCC.STATIC.CURRENCY.SYMBOL = {
    'BTC': 'Ƀ',
    'LTC': 'Ł',
    'DAO': 'Ð',
    'USD': '$',
    'CNY': '¥',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'PLN': 'zł',
    'RUB': '₽',
    'ETH': 'Ξ',
    'GOLD': 'Gold g',
    'INR': '₹',
    'BRL': 'R$'
};

CCC.STATIC.CURRENCY.getSymbol = function (symbol) {
    return CCC.STATIC.CURRENCY.SYMBOL[symbol] || symbol;
};

CCC.STATIC.UTIL = {
    exchangeNameMapping: {
        'CCCAGG': 'CryptoCompare Index',
        'BTCChina': 'BTCC'
    },
    isMobile: function isMobile(userAgent) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4))) return true;
        return false;
    },
    convertToMB: function convertToMB(bytes) {
        return (parseInt(bytes, 10) / 1024 / 1024).toFixed(2) + ' MB';
    },
    getNameForExchange: function getNameForExchange(exchangeName) {
        if (this.exchangeNameMapping.hasOwnProperty(exchangeName)) {
            return this.exchangeNameMapping[exchangeName];
        }
        return exchangeName;
    },
    noExponents: function noExponents(value) {
        var data = String(value).split(/[eE]/);
        if (data.length == 1) return data[0];

        var z = '',
            sign = value < 0 ? '-' : '',
            str = data[0].replace('.', ''),
            mag = Number(data[1]) + 1;

        if (mag < 0) {
            z = sign + '0.';
            while (mag++) {
                z += '0';
            }return z + str.replace(/^\-/, '');
        }
        mag -= str.length;
        while (mag--) {
            z += '0';
        }return str + z;
    },
    reduceFloatVal: function reduceFloatVal(value) {
        value = parseFloat(value);
        if (value > 1) {
            value = Math.round(value * 100) / 100;
            return value;
        }
        if (value >= 0.00001000) {
            return parseFloat(value.toPrecision(4));
        }
        if (value >= 0.00000100) {
            return parseFloat(value.toPrecision(3));
        }
        if (value >= 0.00000010) {
            return parseFloat(value.toPrecision(2));
        }
        return parseFloat(value.toPrecision(1));
    },
    reduceReal: function reduceReal(value) {
        value = parseFloat(value);
        return parseFloat(value.toFixed(8));
    },
    convertCurrentKeyToAll: function convertCurrentKeyToAll(key) {
        var valuesArray = key.split("~");
        valuesArray[0] = CCC.STATIC.TYPE.CURRENTAGG;
        valuesArray[1] = 'CCCAGG';
        return valuesArray.join('~');
    },
    convertCurrentKeyToTrade: function convertCurrentKeyToTrade(key) {
        var valuesArray = key.split("~");
        valuesArray[0] = CCC.STATIC.TYPE.TRADE;
        return valuesArray.join('~');
    },
    convertValueToDisplay: function convertValueToDisplay(symbol, value, filterNumberFunctionAngularJS, type, fullNumbers) {
        var prefix = '';
        var valueSign = 1;
        value = parseFloat(value);
        var valueAbs = Math.abs(value);
        var decimalsOnBigNumbers = 2;
        var decimalsOnNormalNumbers = 2;
        var decimalsOnSmallNumbers = 4;
        if (fullNumbers === true) {
            decimalsOnBigNumbers = 2;
            decimalsOnNormalNumbers = 0;
            decimalsOnSmallNumbers = 4;
        }
        if (type == "8decimals") {
            decimalsOnBigNumbers = 4;
            decimalsOnNormalNumbers = 8;
            decimalsOnSmallNumbers = 8;
            if (value < 0.0001 && value >= 0.00001) {
                decimalsOnSmallNumbers = 4;
            }
            if (value < 0.001 && value >= 0.0001) {
                decimalsOnSmallNumbers = 5;
            }
            if (value < 0.01 && value >= 0.001) {
                decimalsOnSmallNumbers = 6;
            }
            if (value < 0.1 && value >= 0.01) {
                decimalsOnSmallNumbers = 7;
            }
        }
        if (symbol != '') {
            prefix = symbol + ' ';
        }
        if (value < 0) {
            valueSign = -1;
        }
        if (value == 0) {
            return prefix + '0';
        }

        if (value < 0.00001000 && value >= 0.00000100 && decimalsOnSmallNumbers > 3) {
            decimalsOnSmallNumbers = 3;
        }
        if (value < 0.00000100 && value >= 0.00000010 && decimalsOnSmallNumbers > 2) {
            decimalsOnSmallNumbers = 2;
        }
        if (value < 0.00000010 && decimalsOnSmallNumbers > 1) {
            decimalsOnSmallNumbers = 1;
        }

        if (type == "short" || type == "8decimals") {
            if (valueAbs > 10000000000) {
                valueAbs = valueAbs / 1000000000;
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnBigNumbers) + ' B';
            }
            if (valueAbs > 10000000) {
                valueAbs = valueAbs / 1000000;
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnBigNumbers) + ' M';
            }
            if (valueAbs > 10000) {
                valueAbs = valueAbs / 1000;
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnBigNumbers) + ' K';
            }
            if (type == "8decimals" && valueAbs >= 100) {
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnBigNumbers);
            }
            if (valueAbs >= 1) {
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnNormalNumbers);
            }
            return prefix + (valueSign * valueAbs).toPrecision(decimalsOnSmallNumbers);
        } else {
            if (valueAbs >= 1) {
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnNormalNumbers);
            }

            return prefix + this.noExponents((valueSign * valueAbs).toPrecision(decimalsOnSmallNumbers));
        }
    }
};

CCC.TRADE = CCC.TRADE || {};
/*
   trade fields binary values always in the last ~
 */

CCC.TRADE.FLAGS = {
    'SELL': 0x1 // hex for binary 1
    , 'BUY': 0x2 // hex for binary 10
    , 'UNKNOWN': 0x4 // hex for binary 100
};

CCC.TRADE.FIELDS = {
    'T': 0x0 // hex for binary 0, it is a special case of fields that are always there TYPE
    , 'M': 0x0 // hex for binary 0, it is a special case of fields that are always there MARKET
    , 'FSYM': 0x0 // hex for binary 0, it is a special case of fields that are always there FROM SYMBOL
    , 'TSYM': 0x0 // hex for binary 0, it is a special case of fields that are always there TO SYMBOL
    , 'F': 0x0 // hex for binary 0, it is a special case of fields that are always there FLAGS
    , 'ID': 0x1 // hex for binary 1                                                       ID
    , 'TS': 0x2 // hex for binary 10                                                      TIMESTAMP
    , 'Q': 0x4 // hex for binary 100                                                     QUANTITY
    , 'P': 0x8 // hex for binary 1000                                                    PRICE
    , 'TOTAL': 0x10 // hex for binary 10000                                                   TOTAL

};

CCC.TRADE.DISPLAY = CCC.TRADE.DISPLAY || {};
CCC.TRADE.DISPLAY.FIELDS = {
    'T': { "Show": false },
    'M': { "Show": true, 'Filter': 'Market' },
    'FSYM': { "Show": true, 'Filter': 'CurrencySymbol' },
    'TSYM': { "Show": true, 'Filter': 'CurrencySymbol' },
    'F': { "Show": true, 'Filter': 'TradeFlag' },
    'ID': { "Show": true, 'Filter': 'Text' },
    'TS': { 'Show': true, 'Filter': 'Date', 'Format': 'yyyy MMMM dd HH:mm:ss' },
    'Q': { 'Show': true, 'Filter': 'Number', 'Symbol': 'FSYM' },
    'P': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TSYM' },
    'TOTAL': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TSYM' }

};

CCC.TRADE.pack = function (tradeObject) {
    var mask = 0;
    var packedTrade = '';
    for (var field in tradeObject) {
        packedTrade += '~' + tradeObject[field];
        mask |= this.FIELDS[field];
    }
    return packedTrade.substr(1) + '~' + mask.toString(16);
};

CCC.TRADE.unpack = function (tradeString) {
    var valuesArray = tradeString.split("~");
    var valuesArrayLenght = valuesArray.length;
    var mask = valuesArray[valuesArrayLenght - 1];
    var maskInt = parseInt(mask, 16);
    var unpackedTrade = {};
    var currentField = 0;
    for (var property in this.FIELDS) {
        if (this.FIELDS[property] === 0) {
            unpackedTrade[property] = valuesArray[currentField];
            currentField++;
        } else if (maskInt & this.FIELDS[property]) {
            unpackedTrade[property] = valuesArray[currentField];
            currentField++;
        }
    }

    return unpackedTrade;
};

CCC.TRADE.getKey = function (tradeObject) {
    return tradeObject['T'] + '~' + tradeObject['M'] + '~' + tradeObject['FSYM'] + '~' + tradeObject['TSYM'];
};

CCC.CURRENT = CCC.CURRENT || {};
/*
   current fields mask values always in the last ~
 */

CCC.CURRENT.FLAGS = {
    'PRICEUP': 0x1 // hex for binary 1
    , 'PRICEDOWN': 0x2 // hex for binary 10
    , 'PRICEUNCHANGED': 0x4 // hex for binary 100
    , 'BIDUP': 0x8 // hex for binary 1000
    , 'BIDDOWN': 0x10 // hex for binary 10000
    , 'BIDUNCHANGED': 0x20 // hex for binary 100000
    , 'OFFERUP': 0x40 // hex for binary 1000000
    , 'OFFERDOWN': 0x80 // hex for binary 10000000
    , 'OFFERUNCHANGED': 0x100 // hex for binary 100000000
    , 'AVGUP': 0x200 // hex for binary 1000000000
    , 'AVGDOWN': 0x400 // hex for binary 10000000000
    , 'AVGUNCHANGED': 0x800 // hex for binary 100000000000
};

CCC.CURRENT.FIELDS = {
    'TYPE': 0x0 // hex for binary 0, it is a special case of fields that are always there
    , 'MARKET': 0x0 // hex for binary 0, it is a special case of fields that are always there
    , 'FROMSYMBOL': 0x0 // hex for binary 0, it is a special case of fields that are always there
    , 'TOSYMBOL': 0x0 // hex for binary 0, it is a special case of fields that are always there
    , 'FLAGS': 0x0 // hex for binary 0, it is a special case of fields that are always there
    , 'PRICE': 0x1 // hex for binary 1
    , 'BID': 0x2 // hex for binary 10
    , 'OFFER': 0x4 // hex for binary 100
    , 'LASTUPDATE': 0x8 // hex for binary 1000
    , 'AVG': 0x10 // hex for binary 10000
    , 'LASTVOLUME': 0x20 // hex for binary 100000
    , 'LASTVOLUMETO': 0x40 // hex for binary 1000000
    , 'LASTTRADEID': 0x80 // hex for binary 10000000
    , 'VOLUMEHOUR': 0x100 // hex for binary 100000000
    , 'VOLUMEHOURTO': 0x200 // hex for binary 1000000000
    , 'VOLUME24HOUR': 0x400 // hex for binary 10000000000
    , 'VOLUME24HOURTO': 0x800 // hex for binary 100000000000
    , 'OPENHOUR': 0x1000 // hex for binary 1000000000000
    , 'HIGHHOUR': 0x2000 // hex for binary 10000000000000
    , 'LOWHOUR': 0x4000 // hex for binary 100000000000000
    , 'OPEN24HOUR': 0x8000 // hex for binary 1000000000000000
    , 'HIGH24HOUR': 0x10000 // hex for binary 10000000000000000
    , 'LOW24HOUR': 0x20000 // hex for binary 100000000000000000
    , 'LASTMARKET': 0x40000 // hex for binary 1000000000000000000, this is a special case and will only appear on CCCAGG messages
};

CCC.CURRENT.DISPLAY = CCC.CURRENT.DISPLAY || {};
CCC.CURRENT.DISPLAY.FIELDS = {
    'TYPE': { 'Show': false },
    'MARKET': { 'Show': true, 'Filter': 'Market' },
    'FROMSYMBOL': { 'Show': false },
    'TOSYMBOL': { 'Show': false },
    'FLAGS': { 'Show': false },
    'PRICE': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'BID': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'OFFER': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LASTUPDATE': { 'Show': true, 'Filter': 'Date', 'Format': 'yyyy MMMM dd HH:mm:ss' },
    'AVG': { 'Show': true, ' Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LASTVOLUME': { 'Show': true, 'Filter': 'Number', 'Symbol': 'FROMSYMBOL' },
    'LASTVOLUMETO': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LASTTRADEID': { 'Show': true, 'Filter': 'String' },
    'VOLUMEHOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'FROMSYMBOL' },
    'VOLUMEHOURTO': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'VOLUME24HOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'FROMSYMBOL' },
    'VOLUME24HOURTO': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'OPENHOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'HIGHHOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LOWHOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'OPEN24HOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'HIGH24HOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LOW24HOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LASTMARKET': { 'Show': true, 'Filter': 'String' }
};

CCC.CURRENT.pack = function (currentObject) {
    var mask = 0;
    var packedCurrent = '';
    for (var property in this.FIELDS) {
        if (currentObject.hasOwnProperty(property)) {
            packedCurrent += '~' + currentObject[property];
            mask |= this.FIELDS[property];
        }
    }
    //removing first character beacsue it is a ~
    return packedCurrent.substr(1) + '~' + mask.toString(16);
};

CCC.CURRENT.unpack = function (value) {
    var valuesArray = value.split("~");
    var valuesArrayLenght = valuesArray.length;
    var mask = valuesArray[valuesArrayLenght - 1];
    var maskInt = parseInt(mask, 16);
    var unpackedCurrent = {};
    var currentField = 0;
    for (var property in this.FIELDS) {
        if (this.FIELDS[property] === 0) {
            unpackedCurrent[property] = valuesArray[currentField];
            currentField++;
        } else if (maskInt & this.FIELDS[property]) {
            //i know this is a hack, for cccagg, future code please don't hate me:(, i did this to avoid
            //subscribing to trades as well in order to show the last market
            if (property === 'LASTMARKET') {
                unpackedCurrent[property] = valuesArray[currentField];
            } else {
                unpackedCurrent[property] = parseFloat(valuesArray[currentField]);
            }
            currentField++;
        }
    }

    return unpackedCurrent;
};
CCC.CURRENT.getKey = function (currentObject) {
    return currentObject['TYPE'] + '~' + currentObject['MARKET'] + '~' + currentObject['FROMSYMBOL'] + '~' + currentObject['TOSYMBOL'];
};
CCC.CURRENT.getKeyFromStreamerData = function (streamerData) {
    var valuesArray = streamerData.split("~");
    return valuesArray[0] + '~' + valuesArray[1] + '~' + valuesArray[2] + '~' + valuesArray[3];
};

CCC.noExponents = function (value) {
    var data = String(value).split(/[eE]/);
    if (data.length == 1) return data[0];

    var z = '',
        sign = value < 0 ? '-' : '',
        str = data[0].replace('.', ''),
        mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) {
            z += '0';
        }return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--) {
        z += '0';
    }return str + z;
};

CCC.filterNumberFunctionPolyfill = function (value, decimals) {
    var decimalsDenominator = Math.pow(10, decimals);
    var numberWithCorrectDecimals = Math.round(value * decimalsDenominator) / decimalsDenominator;
    var parts = numberWithCorrectDecimals.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};

CCC.convertValueToDisplay = function (symbol, value, type, fullNumbers) {
    var prefix = '';
    var valueSign = 1;
    value = parseFloat(value);
    var valueAbs = Math.abs(value);
    var decimalsOnBigNumbers = 2;
    var decimalsOnNormalNumbers = 2;
    var decimalsOnSmallNumbers = 4;
    if (fullNumbers === true) {
        decimalsOnBigNumbers = 2;
        decimalsOnNormalNumbers = 0;
        decimalsOnSmallNumbers = 4;
    }
    if (symbol != '') {
        prefix = symbol + ' ';
    }
    if (value < 0) {
        valueSign = -1;
    }

    if (value == 0) {
        return prefix + '0';
    }

    if (value < 0.00001000 && value >= 0.00000100 && decimalsOnSmallNumbers > 3) {
        decimalsOnSmallNumbers = 3;
    }
    if (value < 0.00000100 && value >= 0.00000010 && decimalsOnSmallNumbers > 2) {
        decimalsOnSmallNumbers = 2;
    }
    if (value < 0.00000010 && value >= 0.00000001 && decimalsOnSmallNumbers > 1) {
        decimalsOnSmallNumbers = 1;
    }

    if (type == "short") {
        if (valueAbs > 10000000000) {
            valueAbs = valueAbs / 1000000000;
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnBigNumbers) + ' B';
        }
        if (valueAbs > 10000000) {
            valueAbs = valueAbs / 1000000;
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnBigNumbers) + ' M';
        }
        if (valueAbs > 10000) {
            valueAbs = valueAbs / 1000;
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnBigNumbers) + ' K';
        }
        if (valueAbs >= 1) {
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnNormalNumbers);
        }
        return prefix + (valueSign * valueAbs).toPrecision(decimalsOnSmallNumbers);
    } else {
        if (valueAbs >= 1) {
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnNormalNumbers);
        }

        return prefix + CCC.noExponents((valueSign * valueAbs).toPrecision(decimalsOnSmallNumbers));
    }
};

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
/*         STREAM JAVASCRIPT         */
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

var streamUrl = "https://streamer.cryptocompare.com/";
var socket = io(streamUrl);
// Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
// Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
// For aggregate quote updates use CCCAGG as market

var currency = document.getElementById('currencyAbbreviation');
if (currency) {
    var fsym = currency.innerText;
}
var tsym = "USD";
var exchangeDiv = document.getElementById('exchange');
if (exchangeDiv) {
    var exchange = exchangeDiv.innerText;
}

var currentSubs;
var currentSubsText = "";
var dataUrl = "https://min-api.cryptocompare.com/data/subs?fsym=" + fsym + "&tsyms=" + tsym;

$.getJSON(dataUrl, function (data) {
    //currentSubs = data['USD']['TRADES']['0~Bitstamp~BTC~USD'];
    if (currency) {
        currentSubs = ["0~Bitstamp~" + fsym + "~USD", "0~BitTrex~" + fsym + "~USD", "0~Coinbase~" + fsym + "~USD", "0~Bitfinex~" + fsym + "~USD", "0~Gemini~" + fsym + "~USD", "0~Poloniex~" + fsym + "~USD"];
    } else {
        currentSubs = ["0~" + exchange + "~BTC~USD", "0~" + exchange + "~ETH~USD", "0~" + exchange + "~BCH~USD", "0~" + exchange + "~ETC~USD", "0~" + exchange + "~LTC~USD", "0~" + exchange + "~DASH~USD", "0~" + exchange + "~ZEC~USD"];
    }

    //console.log(currentSubs);
    for (var i = 0; i < currentSubs.length; i++) {
        currentSubsText += currentSubs[i] + ", ";
    }
    $('#sub-exchanges').text(currentSubsText);
    socket.emit('SubAdd', { subs: currentSubs });
});

socket.on('m', function (currentData) {
    var tradeField = currentData.substr(0, currentData.indexOf("~"));
    if (tradeField == CCC.STATIC.TYPE.TRADE) {
        transformData(currentData);
    }
});

var transformData = function transformData(data) {
    var coinfsym = CCC.STATIC.CURRENCY.getSymbol(fsym);
    var cointsym = CCC.STATIC.CURRENCY.getSymbol(tsym);

    var incomingTrade = CCC.TRADE.unpack(data);
    //console.log(incomingTrade);
    var newTrade = {
        Market: incomingTrade['M'],
        Type: incomingTrade['T'],
        ID: incomingTrade['ID'],
        Price: CCC.convertValueToDisplay(cointsym, incomingTrade['P']),
        Quantity: CCC.convertValueToDisplay(coinfsym, incomingTrade['Q']),
        Total: CCC.convertValueToDisplay(cointsym, incomingTrade['TOTAL'])
    };

    if (incomingTrade['F'] & 1) {
        newTrade['Type'] = "SELL";
    } else if (incomingTrade['F'] & 2) {
        newTrade['Type'] = "BUY";
    } else {
        newTrade['Type'] = "UNKNOWN";
    }

    displayDataTrade(newTrade);
};

var displayDataTrade = function displayDataTrade(dataUnpacked) {
    //console.log(dataUnpacked);

    var maxTableSize = 30;
    var length = $('table tr').length;
    $('#trades').after("<tr class=" + dataUnpacked.Type + ">" + "<th>" + dataUnpacked.Market + "</th>" + "<th>" + dataUnpacked.Type + "</th>" + "<th>" + dataUnpacked.ID + "</th>" + "<th>" + dataUnpacked.Price + "</th>" + "<th>" + dataUnpacked.Quantity + "</th>" + "<th>" + dataUnpacked.Total + "</th>" + "</tr>");

    if (length >= maxTableSize) {
        $('table tr:last').remove();
    }
};

///////////////////////////////////////
/*     Aggregate price streaming     */
///////////////////////////////////////

$(document).ready(function () {
    var currentPrice = {};

    var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~BCH~USD', '5~CCCAGG~ETC~USD', '5~CCCAGG~LTC~USD', '5~CCCAGG~DASH~USD', '5~CCCAGG~ZEC~USD'];

    socket.emit('SubAdd', { subs: subscription });

    socket.on("m", function (message) {
        var messageType = message.substring(0, message.indexOf("~"));
        var res = {};
        if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
            res = CCC.CURRENT.unpack(message);
            dataUnpack(res);
        }
    });

    var dataUnpack = function dataUnpack(data) {
        var from = data['FROMSYMBOL'];
        var to = data['TOSYMBOL'];
        var fsym = CCC.STATIC.CURRENCY.getSymbol(from);
        var tsym = CCC.STATIC.CURRENCY.getSymbol(to);
        var pair = from + to;

        if (!currentPrice.hasOwnProperty(pair)) {
            currentPrice[pair] = {};
        }

        for (var key in data) {
            currentPrice[pair][key] = data[key];
        }

        if (currentPrice[pair]['LASTTRADEID']) {
            currentPrice[pair]['LASTTRADEID'] = parseInt(currentPrice[pair]['LASTTRADEID']).toFixed(0);
        }
        currentPrice[pair]['CHANGE24HOUR'] = CCC.convertValueToDisplay(tsym, currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']);
        currentPrice[pair]['CHANGE24HOURPCT'] = ((currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']) / currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%";;
        displayData(currentPrice[pair], from, tsym, fsym);
    };

    var displayData = function displayData(current, from, tsym, fsym) {
        var priceDirection = current.FLAGS;

        for (var key in current) {

            if (key == 'CHANGE24HOURPCT') {
                $('#' + key + '_' + from).text(' (' + current[key] + ')');
            } else if (key == 'LASTVOLUMETO' || key == 'VOLUME24HOURTO') {
                $('#' + key + '_' + from).text(CCC.convertValueToDisplay(tsym, current[key]));
            } else if (key == 'LASTVOLUME' || key == 'VOLUME24HOUR' || key == 'OPEN24HOUR' || key == 'OPENHOUR' || key == 'HIGH24HOUR' || key == 'HIGHHOUR' || key == 'LOWHOUR' || key == 'LOW24HOUR') {
                $('#' + key + '_' + from).text(CCC.convertValueToDisplay(fsym, current[key]));
            } else {
                if (key == 'LASTMARKET') {
                    $('#' + current[key] + "_" + from + "_PRICE").text(current['PRICE']);
                }

                $('#' + key + '_' + from).text(current[key]);
            }
        }

        $('#PRICE_' + from).removeClass();
        if (priceDirection & 1) {
            $('#PRICE_' + from).addClass("up");
        } else if (priceDirection & 2) {
            $('#PRICE_' + from).addClass("down");
        }
        if (current['PRICE'] > current['OPEN24HOUR']) {
            $('#CHANGE24HOURPCT_' + from).removeClass();
            $('#CHANGE24HOURPCT_' + from).addClass("up");
        } else if (current['PRICE'] < current['OPEN24HOUR']) {
            $('#CHANGE24HOURPCT_' + from).removeClass();
            $('#CHANGE24HOURPCT_' + from).addClass("down");
        }
    };
});

});

require.register("js/ticker.js", function(exports, require, module) {
"use strict";

var streamUrl = "https://streamer.cryptocompare.com/";
var currency = document.getElementById('currencyAbbreviation');
if (currency) {
    var fsym = currency.innerText;
}
var tsym = "USD";
if (!currency) {
    var exchange = document.getElementById('exchange').innerText;
}
var currentSubs;
var currentSubsText = "";
var dataUrl = "https://min-api.cryptocompare.com/data/subs?fsym=" + fsym + "&tsyms=" + tsym;
var socket = io(streamUrl);

$.getJSON(dataUrl, function (data) {
    //currentSubs = data['USD']['TRADES']['0~Bitstamp~BTC~USD'];
    if (currency) {
        currentSubs = ["0~Bitstamp~" + fsym + "~USD", "0~BitTrex~" + fsym + "~USD", "0~Coinbase~" + fsym + "~USD", "0~Bitfinex~" + fsym + "~USD", "0~Gemini~" + fsym + "~USD", "0~Poloniex~" + fsym + "~USD"];
    } else {
        currentSubs = ["0~" + exchange + "~BTC~USD", "0~" + exchange + "~ETH~USD", "0~" + exchange + "~BCH~USD", "0~" + exchange + "~ETC~USD", "0~" + exchange + "~LTC~USD", "0~" + exchange + "~DASH~USD", "0~" + exchange + "~ZEC~USD"];
    }

    console.log(currentSubs);
    for (var i = 0; i < currentSubs.length; i++) {
        currentSubsText += currentSubs[i] + ", ";
    }
    $('#sub-exchanges').text(currentSubsText);
    socket.emit('SubAdd', { subs: currentSubs });
});

socket.on('m', function (currentData) {
    var tradeField = currentData.substr(0, currentData.indexOf("~"));
    if (tradeField == CCC.STATIC.TYPE.TRADE) {
        transformData(currentData);
    }
});

var transformData = function transformData(data) {
    var coinfsym = CCC.STATIC.CURRENCY.getSymbol(fsym);
    var cointsym = CCC.STATIC.CURRENCY.getSymbol(tsym);
    var incomingTrade = CCC.TRADE.unpack(data);
    //console.log(incomingTrade);
    var newTrade = {
        Market: incomingTrade['M'],
        Type: incomingTrade['T'],
        ID: incomingTrade['ID'],
        Price: CCC.convertValueToDisplay(cointsym, incomingTrade['P']),
        Quantity: CCC.convertValueToDisplay(coinfsym, incomingTrade['Q']),
        Total: CCC.convertValueToDisplay(cointsym, incomingTrade['TOTAL'])
    };

    if (incomingTrade['F'] & 1) {
        newTrade['Type'] = "SELL";
    } else if (incomingTrade['F'] & 2) {
        newTrade['Type'] = "BUY";
    } else {
        newTrade['Type'] = "UNKNOWN";
    }

    displayData(newTrade);
};

var displayData = function displayData(dataUnpacked) {
    var maxTableSize = 30;
    var length = $('table tr').length;
    $('#trades').after("<tr class=" + dataUnpacked.Type + "><th>" + dataUnpacked.Market + "</th><th>" + dataUnpacked.Type + "</th><th>" + dataUnpacked.ID + "</th><th>" + dataUnpacked.Price + "</th><th>" + dataUnpacked.Quantity + "</th><th>" + dataUnpacked.Total + "</th></tr>");

    if (length >= maxTableSize) {
        $('table tr:last').remove();
    }
};

$('#unsubscribe').click(function () {
    console.log('Unsubscribing to streamers');
    $('#subscribe').removeClass('subon');
    $(this).addClass('subon');
    $('#stream-text').text('Stream stopped');
    socket.emit('SubRemove', { subs: currentSubs });
    $('#sub-exchanges').text("");
});

$('#subscribe').click(function () {
    console.log('Subscribing to streamers');
    $('#unsubscribe').removeClass('subon');
    $(this).addClass('subon');
    $('#stream-text').text("Streaming...");
    socket.emit('SubAdd', { subs: currentSubs });
    $('#sub-exchanges').text(currentSubsText);
});

});

require.register("js/utils.js", function(exports, require, module) {
'use strict';

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
/*         STREAM UTILITIES          */
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

var CCC = CCC || {};

CCC.STATIC = CCC.STATIC || {};

CCC.STATIC.TYPE = {
    'TRADE': '0',
    'FEEDNEWS': '1',
    'CURRENT': '2',
    'LOADCOMPLATE': '3',
    'COINPAIRS': '4',
    'CURRENTAGG': '5',
    'TOPLIST': '6',
    'TOPLISTCHANGE': '7',
    'ORDERBOOK': '8',
    'FULLORDERBOOK': '9',
    'ACTIVATION': '10',

    'TRADECATCHUP': '100',
    'NEWSCATCHUP': '101',

    'TRADECATCHUPCOMPLETE': '300',
    'NEWSCATCHUPCOMPLETE': '301'

};

CCC.STATIC.CURRENCY = CCC.STATIC.CURRENCY || {};

CCC.STATIC.CURRENCY.SYMBOL = {
    'BTC': 'Ƀ',
    'LTC': 'Ł',
    'DAO': 'Ð',
    'USD': '$',
    'CNY': '¥',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'PLN': 'zł',
    'RUB': '₽',
    'ETH': 'Ξ',
    'GOLD': 'Gold g',
    'INR': '₹',
    'BRL': 'R$'
};

CCC.STATIC.CURRENCY.getSymbol = function (symbol) {
    return CCC.STATIC.CURRENCY.SYMBOL[symbol] || symbol;
};

CCC.STATIC.UTIL = {
    exchangeNameMapping: {
        'CCCAGG': 'CryptoCompare Index',
        'BTCChina': 'BTCC'
    },
    isMobile: function isMobile(userAgent) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4))) return true;
        return false;
    },
    convertToMB: function convertToMB(bytes) {
        return (parseInt(bytes, 10) / 1024 / 1024).toFixed(2) + ' MB';
    },
    getNameForExchange: function getNameForExchange(exchangeName) {
        if (this.exchangeNameMapping.hasOwnProperty(exchangeName)) {
            return this.exchangeNameMapping[exchangeName];
        }
        return exchangeName;
    },
    noExponents: function noExponents(value) {
        var data = String(value).split(/[eE]/);
        if (data.length == 1) return data[0];

        var z = '',
            sign = value < 0 ? '-' : '',
            str = data[0].replace('.', ''),
            mag = Number(data[1]) + 1;

        if (mag < 0) {
            z = sign + '0.';
            while (mag++) {
                z += '0';
            }return z + str.replace(/^\-/, '');
        }
        mag -= str.length;
        while (mag--) {
            z += '0';
        }return str + z;
    },
    reduceFloatVal: function reduceFloatVal(value) {
        value = parseFloat(value);
        if (value > 1) {
            value = Math.round(value * 100) / 100;
            return value;
        }
        if (value >= 0.00001000) {
            return parseFloat(value.toPrecision(4));
        }
        if (value >= 0.00000100) {
            return parseFloat(value.toPrecision(3));
        }
        if (value >= 0.00000010) {
            return parseFloat(value.toPrecision(2));
        }
        return parseFloat(value.toPrecision(1));
    },
    reduceReal: function reduceReal(value) {
        value = parseFloat(value);
        return parseFloat(value.toFixed(8));
    },
    convertCurrentKeyToAll: function convertCurrentKeyToAll(key) {
        var valuesArray = key.split("~");
        valuesArray[0] = CCC.STATIC.TYPE.CURRENTAGG;
        valuesArray[1] = 'CCCAGG';
        return valuesArray.join('~');
    },
    convertCurrentKeyToTrade: function convertCurrentKeyToTrade(key) {
        var valuesArray = key.split("~");
        valuesArray[0] = CCC.STATIC.TYPE.TRADE;
        return valuesArray.join('~');
    },
    convertValueToDisplay: function convertValueToDisplay(symbol, value, filterNumberFunctionAngularJS, type, fullNumbers) {
        var prefix = '';
        var valueSign = 1;
        value = parseFloat(value);
        var valueAbs = Math.abs(value);
        var decimalsOnBigNumbers = 2;
        var decimalsOnNormalNumbers = 2;
        var decimalsOnSmallNumbers = 4;
        if (fullNumbers === true) {
            decimalsOnBigNumbers = 2;
            decimalsOnNormalNumbers = 0;
            decimalsOnSmallNumbers = 4;
        }
        if (type == "8decimals") {
            decimalsOnBigNumbers = 4;
            decimalsOnNormalNumbers = 8;
            decimalsOnSmallNumbers = 8;
            if (value < 0.0001 && value >= 0.00001) {
                decimalsOnSmallNumbers = 4;
            }
            if (value < 0.001 && value >= 0.0001) {
                decimalsOnSmallNumbers = 5;
            }
            if (value < 0.01 && value >= 0.001) {
                decimalsOnSmallNumbers = 6;
            }
            if (value < 0.1 && value >= 0.01) {
                decimalsOnSmallNumbers = 7;
            }
        }
        if (symbol != '') {
            prefix = symbol + ' ';
        }
        if (value < 0) {
            valueSign = -1;
        }
        if (value == 0) {
            return prefix + '0';
        }

        if (value < 0.00001000 && value >= 0.00000100 && decimalsOnSmallNumbers > 3) {
            decimalsOnSmallNumbers = 3;
        }
        if (value < 0.00000100 && value >= 0.00000010 && decimalsOnSmallNumbers > 2) {
            decimalsOnSmallNumbers = 2;
        }
        if (value < 0.00000010 && decimalsOnSmallNumbers > 1) {
            decimalsOnSmallNumbers = 1;
        }

        if (type == "short" || type == "8decimals") {
            if (valueAbs > 10000000000) {
                valueAbs = valueAbs / 1000000000;
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnBigNumbers) + ' B';
            }
            if (valueAbs > 10000000) {
                valueAbs = valueAbs / 1000000;
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnBigNumbers) + ' M';
            }
            if (valueAbs > 10000) {
                valueAbs = valueAbs / 1000;
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnBigNumbers) + ' K';
            }
            if (type == "8decimals" && valueAbs >= 100) {
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnBigNumbers);
            }
            if (valueAbs >= 1) {
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnNormalNumbers);
            }
            return prefix + (valueSign * valueAbs).toPrecision(decimalsOnSmallNumbers);
        } else {
            if (valueAbs >= 1) {
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnNormalNumbers);
            }

            return prefix + this.noExponents((valueSign * valueAbs).toPrecision(decimalsOnSmallNumbers));
        }
    }
};

CCC.TRADE = CCC.TRADE || {};
/*
   trade fields binary values always in the last ~
 */

CCC.TRADE.FLAGS = {
    'SELL': 0x1 // hex for binary 1
    , 'BUY': 0x2 // hex for binary 10
    , 'UNKNOWN': 0x4 // hex for binary 100
};

CCC.TRADE.FIELDS = {
    'T': 0x0 // hex for binary 0, it is a special case of fields that are always there TYPE
    , 'M': 0x0 // hex for binary 0, it is a special case of fields that are always there MARKET
    , 'FSYM': 0x0 // hex for binary 0, it is a special case of fields that are always there FROM SYMBOL
    , 'TSYM': 0x0 // hex for binary 0, it is a special case of fields that are always there TO SYMBOL
    , 'F': 0x0 // hex for binary 0, it is a special case of fields that are always there FLAGS
    , 'ID': 0x1 // hex for binary 1                                                       ID
    , 'TS': 0x2 // hex for binary 10                                                      TIMESTAMP
    , 'Q': 0x4 // hex for binary 100                                                     QUANTITY
    , 'P': 0x8 // hex for binary 1000                                                    PRICE
    , 'TOTAL': 0x10 // hex for binary 10000                                                   TOTAL

};

CCC.TRADE.DISPLAY = CCC.TRADE.DISPLAY || {};
CCC.TRADE.DISPLAY.FIELDS = {
    'T': { "Show": false },
    'M': { "Show": true, 'Filter': 'Market' },
    'FSYM': { "Show": true, 'Filter': 'CurrencySymbol' },
    'TSYM': { "Show": true, 'Filter': 'CurrencySymbol' },
    'F': { "Show": true, 'Filter': 'TradeFlag' },
    'ID': { "Show": true, 'Filter': 'Text' },
    'TS': { 'Show': true, 'Filter': 'Date', 'Format': 'yyyy MMMM dd HH:mm:ss' },
    'Q': { 'Show': true, 'Filter': 'Number', 'Symbol': 'FSYM' },
    'P': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TSYM' },
    'TOTAL': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TSYM' }

};

CCC.TRADE.pack = function (tradeObject) {
    var mask = 0;
    var packedTrade = '';
    for (var field in tradeObject) {
        packedTrade += '~' + tradeObject[field];
        mask |= this.FIELDS[field];
    }
    return packedTrade.substr(1) + '~' + mask.toString(16);
};

CCC.TRADE.unpack = function (tradeString) {
    var valuesArray = tradeString.split("~");
    var valuesArrayLenght = valuesArray.length;
    var mask = valuesArray[valuesArrayLenght - 1];
    var maskInt = parseInt(mask, 16);
    var unpackedTrade = {};
    var currentField = 0;
    for (var property in this.FIELDS) {
        if (this.FIELDS[property] === 0) {
            unpackedTrade[property] = valuesArray[currentField];
            currentField++;
        } else if (maskInt & this.FIELDS[property]) {
            unpackedTrade[property] = valuesArray[currentField];
            currentField++;
        }
    }

    return unpackedTrade;
};

CCC.TRADE.getKey = function (tradeObject) {
    return tradeObject['T'] + '~' + tradeObject['M'] + '~' + tradeObject['FSYM'] + '~' + tradeObject['TSYM'];
};

CCC.CURRENT = CCC.CURRENT || {};
/*
   current fields mask values always in the last ~
 */

CCC.CURRENT.FLAGS = {
    'PRICEUP': 0x1 // hex for binary 1
    , 'PRICEDOWN': 0x2 // hex for binary 10
    , 'PRICEUNCHANGED': 0x4 // hex for binary 100
    , 'BIDUP': 0x8 // hex for binary 1000
    , 'BIDDOWN': 0x10 // hex for binary 10000
    , 'BIDUNCHANGED': 0x20 // hex for binary 100000
    , 'OFFERUP': 0x40 // hex for binary 1000000
    , 'OFFERDOWN': 0x80 // hex for binary 10000000
    , 'OFFERUNCHANGED': 0x100 // hex for binary 100000000
    , 'AVGUP': 0x200 // hex for binary 1000000000
    , 'AVGDOWN': 0x400 // hex for binary 10000000000
    , 'AVGUNCHANGED': 0x800 // hex for binary 100000000000
};

CCC.CURRENT.FIELDS = {
    'TYPE': 0x0 // hex for binary 0, it is a special case of fields that are always there
    , 'MARKET': 0x0 // hex for binary 0, it is a special case of fields that are always there
    , 'FROMSYMBOL': 0x0 // hex for binary 0, it is a special case of fields that are always there
    , 'TOSYMBOL': 0x0 // hex for binary 0, it is a special case of fields that are always there
    , 'FLAGS': 0x0 // hex for binary 0, it is a special case of fields that are always there
    , 'PRICE': 0x1 // hex for binary 1
    , 'BID': 0x2 // hex for binary 10
    , 'OFFER': 0x4 // hex for binary 100
    , 'LASTUPDATE': 0x8 // hex for binary 1000
    , 'AVG': 0x10 // hex for binary 10000
    , 'LASTVOLUME': 0x20 // hex for binary 100000
    , 'LASTVOLUMETO': 0x40 // hex for binary 1000000
    , 'LASTTRADEID': 0x80 // hex for binary 10000000
    , 'VOLUMEHOUR': 0x100 // hex for binary 100000000
    , 'VOLUMEHOURTO': 0x200 // hex for binary 1000000000
    , 'VOLUME24HOUR': 0x400 // hex for binary 10000000000
    , 'VOLUME24HOURTO': 0x800 // hex for binary 100000000000
    , 'OPENHOUR': 0x1000 // hex for binary 1000000000000
    , 'HIGHHOUR': 0x2000 // hex for binary 10000000000000
    , 'LOWHOUR': 0x4000 // hex for binary 100000000000000
    , 'OPEN24HOUR': 0x8000 // hex for binary 1000000000000000
    , 'HIGH24HOUR': 0x10000 // hex for binary 10000000000000000
    , 'LOW24HOUR': 0x20000 // hex for binary 100000000000000000
    , 'LASTMARKET': 0x40000 // hex for binary 1000000000000000000, this is a special case and will only appear on CCCAGG messages
};

CCC.CURRENT.DISPLAY = CCC.CURRENT.DISPLAY || {};
CCC.CURRENT.DISPLAY.FIELDS = {
    'TYPE': { 'Show': false },
    'MARKET': { 'Show': true, 'Filter': 'Market' },
    'FROMSYMBOL': { 'Show': false },
    'TOSYMBOL': { 'Show': false },
    'FLAGS': { 'Show': false },
    'PRICE': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'BID': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'OFFER': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LASTUPDATE': { 'Show': true, 'Filter': 'Date', 'Format': 'yyyy MMMM dd HH:mm:ss' },
    'AVG': { 'Show': true, ' Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LASTVOLUME': { 'Show': true, 'Filter': 'Number', 'Symbol': 'FROMSYMBOL' },
    'LASTVOLUMETO': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LASTTRADEID': { 'Show': true, 'Filter': 'String' },
    'VOLUMEHOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'FROMSYMBOL' },
    'VOLUMEHOURTO': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'VOLUME24HOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'FROMSYMBOL' },
    'VOLUME24HOURTO': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'OPENHOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'HIGHHOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LOWHOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'OPEN24HOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'HIGH24HOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LOW24HOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LASTMARKET': { 'Show': true, 'Filter': 'String' }
};

CCC.CURRENT.pack = function (currentObject) {
    var mask = 0;
    var packedCurrent = '';
    for (var property in this.FIELDS) {
        if (currentObject.hasOwnProperty(property)) {
            packedCurrent += '~' + currentObject[property];
            mask |= this.FIELDS[property];
        }
    }
    //removing first character beacsue it is a ~
    return packedCurrent.substr(1) + '~' + mask.toString(16);
};

CCC.CURRENT.unpack = function (value) {
    var valuesArray = value.split("~");
    var valuesArrayLenght = valuesArray.length;
    var mask = valuesArray[valuesArrayLenght - 1];
    var maskInt = parseInt(mask, 16);
    var unpackedCurrent = {};
    var currentField = 0;
    for (var property in this.FIELDS) {
        if (this.FIELDS[property] === 0) {
            unpackedCurrent[property] = valuesArray[currentField];
            currentField++;
        } else if (maskInt & this.FIELDS[property]) {
            //i know this is a hack, for cccagg, future code please don't hate me:(, i did this to avoid
            //subscribing to trades as well in order to show the last market
            if (property === 'LASTMARKET') {
                unpackedCurrent[property] = valuesArray[currentField];
            } else {
                unpackedCurrent[property] = parseFloat(valuesArray[currentField]);
            }
            currentField++;
        }
    }

    return unpackedCurrent;
};
CCC.CURRENT.getKey = function (currentObject) {
    return currentObject['TYPE'] + '~' + currentObject['MARKET'] + '~' + currentObject['FROMSYMBOL'] + '~' + currentObject['TOSYMBOL'];
};
CCC.CURRENT.getKeyFromStreamerData = function (streamerData) {
    var valuesArray = streamerData.split("~");
    return valuesArray[0] + '~' + valuesArray[1] + '~' + valuesArray[2] + '~' + valuesArray[3];
};

CCC.noExponents = function (value) {
    var data = String(value).split(/[eE]/);
    if (data.length == 1) return data[0];

    var z = '',
        sign = value < 0 ? '-' : '',
        str = data[0].replace('.', ''),
        mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) {
            z += '0';
        }return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--) {
        z += '0';
    }return str + z;
};

CCC.filterNumberFunctionPolyfill = function (value, decimals) {
    var decimalsDenominator = Math.pow(10, decimals);
    var numberWithCorrectDecimals = Math.round(value * decimalsDenominator) / decimalsDenominator;
    var parts = numberWithCorrectDecimals.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};

CCC.convertValueToDisplay = function (symbol, value, type, fullNumbers) {
    var prefix = '';
    var valueSign = 1;
    value = parseFloat(value);
    var valueAbs = Math.abs(value);
    var decimalsOnBigNumbers = 2;
    var decimalsOnNormalNumbers = 2;
    var decimalsOnSmallNumbers = 4;
    if (fullNumbers === true) {
        decimalsOnBigNumbers = 2;
        decimalsOnNormalNumbers = 0;
        decimalsOnSmallNumbers = 4;
    }
    if (symbol != '') {
        prefix = symbol + ' ';
    }
    if (value < 0) {
        valueSign = -1;
    }

    if (value == 0) {
        return prefix + '0';
    }

    if (value < 0.00001000 && value >= 0.00000100 && decimalsOnSmallNumbers > 3) {
        decimalsOnSmallNumbers = 3;
    }
    if (value < 0.00000100 && value >= 0.00000010 && decimalsOnSmallNumbers > 2) {
        decimalsOnSmallNumbers = 2;
    }
    if (value < 0.00000010 && value >= 0.00000001 && decimalsOnSmallNumbers > 1) {
        decimalsOnSmallNumbers = 1;
    }

    if (type == "short") {
        if (valueAbs > 10000000000) {
            valueAbs = valueAbs / 1000000000;
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnBigNumbers) + ' B';
        }
        if (valueAbs > 10000000) {
            valueAbs = valueAbs / 1000000;
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnBigNumbers) + ' M';
        }
        if (valueAbs > 10000) {
            valueAbs = valueAbs / 1000;
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnBigNumbers) + ' K';
        }
        if (valueAbs >= 1) {
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnNormalNumbers);
        }
        return prefix + (valueSign * valueAbs).toPrecision(decimalsOnSmallNumbers);
    } else {
        if (valueAbs >= 1) {
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnNormalNumbers);
        }

        return prefix + CCC.noExponents((valueSign * valueAbs).toPrecision(decimalsOnSmallNumbers));
    }
};

});

require.alias("phoenix/priv/static/phoenix.js", "phoenix");
require.alias("phoenix_html/priv/static/phoenix_html.js", "phoenix_html");require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('js/app');
//# sourceMappingURL=./app.js-4916dd2d5c7dffa10bccff4628c7dc28.map