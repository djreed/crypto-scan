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

$.getJSON(dataUrl, function(data) {
    //currentSubs = data['USD']['TRADES']['0~Bitstamp~BTC~USD'];
    if (currency) {
        currentSubs = [
            "0~Bitstamp~" + fsym + "~USD",
            "0~BitTrex~" + fsym + "~USD",
            "0~Coinbase~" + fsym + "~USD",
            "0~Bitfinex~" + fsym + "~USD",
            "0~Gemini~" + fsym + "~USD",
            "0~Poloniex~" + fsym + "~USD"
        ];
    }
    else {
        currentSubs = [
            "0~" + exchange + "~BTC~USD",
            "0~" + exchange + "~ETH~USD",
            "0~" + exchange + "~BCH~USD",
            "0~" + exchange + "~ETC~USD",
            "0~" + exchange + "~LTC~USD",
            "0~" + exchange + "~DASH~USD",
            "0~" + exchange + "~ZEC~USD"
        ];
    }

    console.log(currentSubs);
    for (var i = 0; i < currentSubs.length; i++) {
        currentSubsText += currentSubs[i] + ", ";
    }
    $('#sub-exchanges').text(currentSubsText);
    socket.emit('SubAdd', { subs: currentSubs });
});

socket.on('m', function(currentData) {
    var tradeField = currentData.substr(0, currentData.indexOf("~"));
    if (tradeField == CCC.STATIC.TYPE.TRADE) {
        transformData(currentData);
    }
});

var transformData = function(data) {
    var coinfsym = CCC.STATIC.CURRENCY.getSymbol(fsym);
    var cointsym = CCC.STATIC.CURRENCY.getSymbol(tsym)
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
    }
    else if (incomingTrade['F'] & 2) {
        newTrade['Type'] = "BUY";
    }
    else {
        newTrade['Type'] = "UNKNOWN";
    }

    displayData(newTrade);
};

var displayData = function(dataUnpacked) {
    var maxTableSize = 30;
    var length = $('table tr').length;
    $('#trades').after(
        "<tr class=" + dataUnpacked.Type + "><th>" + dataUnpacked.Market + "</th><th>" + dataUnpacked.Type + "</th><th>" + dataUnpacked.ID + "</th><th>" + dataUnpacked.Price + "</th><th>" + dataUnpacked.Quantity + "</th><th>" + dataUnpacked.Total + "</th></tr>"
    );

    if (length >= (maxTableSize)) {
        $('table tr:last').remove();
    }
};

$('#unsubscribe').click(function() {
    console.log('Unsubscribing to streamers');
    $('#subscribe').removeClass('subon');
    $(this).addClass('subon');
    $('#stream-text').text('Stream stopped');
    socket.emit('SubRemove', { subs: currentSubs });
    $('#sub-exchanges').text("");
});

$('#subscribe').click(function() {
    console.log('Subscribing to streamers')
    $('#unsubscribe').removeClass('subon');
    $(this).addClass('subon');
    $('#stream-text').text("Streaming...");
    socket.emit('SubAdd', { subs: currentSubs });
    $('#sub-exchanges').text(currentSubsText);
});