defmodule CryptoScan.Currency do
  use Exnumerator,
    values: [
      "BTC",  # Bitcoin
      "ETH",  # Etherium
      "BCH",  # Bitcoin Cash
      "ETC",  # Etherium Classic
      "LTC",  # Litecoin
      "DASH", # Digital Cash
      "ZEC"   # ZCash
    ]
end
