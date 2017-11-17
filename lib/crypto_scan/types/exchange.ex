defmodule CryptoScan.Exchange do
  use Exnumerator,
    values: [
      "Bitstamp",
      "BitTrex",
      "Coinbase",
      "Bitfinex",
      "Gemini",
      "Poloniex"
    ]
end
