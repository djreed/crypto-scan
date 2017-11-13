defmodule CryptoScan.Exchange do
  use Exnumerator,
    values: [
      "Bitstamp",
      "Bittrex",
      "Coinbase",
      "Bitfinex",
      "Gemini",
      "Poloniex"
    ]
end
