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
require.register("js/app.js", function(exports, require, module) {
"use strict";

require("phoenix_html");

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
"use strict";

var streamUrl = "https://streamer.cryptocompare.com/";
var fsym = "BTC";
var tsym = "USD";
var currentSubs;
var currentSubsText = "";
var dataUrl = "https://min-api.cryptocompare.com/data/subs?fsym=" + fsym + "&tsyms=" + tsym;
var socket = io(streamUrl);

$.getJSON(dataUrl, function (data) {
        currentSubs = data['USD']['TRADES'];
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
        console.log(incomingTrade);
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

require.register("js/utilities.js", function(exports, require, module) {
'use strict';

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

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('js/app');
//# sourceMappingURL=./app.js-6f0981485f7d21e1801638b98389d558.map