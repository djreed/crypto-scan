defmodule CryptoScan do
  @moduledoc """
  CryptoScan keeps the contexts that define your domain
  and business logic.

  Contexts are also responsible for managing your data, regardless
  if it comes from the database, an external API or others.
  """

  def coin_list do
    resp = HTTPoison.get!("https://www.cryptocompare.com/api/data/coinlist/")
    data = Poison.decode!(resp.body)
    data["Data"]
  end

  def price(currency) do
    resp = HTTPoison.get!("https://min-api.cryptocompare.com/data/price?fsym=" <> currency <> "&tsyms=USD")
    data = Poison.decode!(resp.body)
    data["USD"]
  end

  def priceFromExchange(currency, exchange) do
    resp = HTTPoison.get!("https://min-api.cryptocompare.com/data/price?fsym=" <> currency <> "&tsyms=USD&e=" <> exchange)
    data = Poison.decode!(resp.body)
    if data["Response"] == "Error" do
      -1
    else
      data["USD"]
    end
  end

  def getFullName(name) do
    cond do
      name == "BTC" ->
        fullName = "Bitcoin"
      name == "ETH" ->
        fullName = "Ethereum"
      name == "BCH" ->
        fullName = "Bitcoin Cash"
      name == "ETC" ->
        fullName = "Ethereum Classic"
      name == "LTC" ->
        fullName = "Litecoin"
      name == "DASH" ->
        fullName = "Dash"
      name == "ZEC" ->
        fullName = "Zcash"
    end
    fullName
  end

  def getID(name) do
    cond do
      name == "BTC" ->
        id = "1182"
      name == "ETH" ->
        id = "7605"
      name == "BCH" ->
        id = "202330"
      name == "ETC" ->
        id = "5324"
      name == "LTC" ->
        id = "3808"
      name == "DASH" ->
        id = "3807"
      name == "ZEC" ->
        id = "24854"
    end
    id
  end

  def priceAllExchanges(currency) do
    allExchanges = [ %{ name: "Bitstamp", exchangePrice: priceFromExchange(currency, "Bitstamp")},
    %{ name: "BitTrex", exchangePrice: priceFromExchange(currency, "BitTrex")},
    %{ name: "Coinbase", exchangePrice: priceFromExchange(currency, "Coinbase")},
    %{ name: "Bitfinex", exchangePrice: priceFromExchange(currency, "Bitfinex")},
    %{ name: "Gemini", exchangePrice: priceFromExchange(currency, "Gemini")},
    %{ name: "Poloniex", exchangePrice: priceFromExchange(currency, "Poloniex")} ]

    data = for exchange <- allExchanges do
      if exchange.exchangePrice != -1 do
        exchange
      end
    end
    
    data
  end

  def priceAllCurrencies(exchange) do
    allCurrencies = [ %{ name: "Bitcoin", abb: "BTC", currencyPrice: priceFromExchange("BTC", exchange)},
    %{ name: "Ethereum", abb: "ETH", currencyPrice: priceFromExchange("ETH", exchange)},
    %{ name: "Bitcoin Cash", abb: "BCH", currencyPrice: priceFromExchange("BCH", exchange)},
    %{ name: "Ethereum Classic", abb: "ETC", currencyPrice: priceFromExchange("ETC", exchange)},
    %{ name: "Litecoin", abb: "LTC", currencyPrice: priceFromExchange("LTC", exchange)},
    %{ name: "Zcash", abb: "DASH", currencyPrice: priceFromExchange("DASH", exchange)},
    %{ name: exchange, abb: "ZEC", currencyPrice: priceFromExchange("ZEC", exchange)}, ]
    allCurrencies
  end

  def priceConverter(currencyToConvert, convertedCurrency) do
    resp = HTTPoison.get!("https://min-api.cryptocompare.com/data/price?fsym=" <> currencyToConvert <> "&tsyms=" <> convertedCurrency)
    data = Poison.decode!(resp.body)
    data
  end

  def description(id) do
    resp = HTTPoison.get!("https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id=" <> id)
    data = Poison.decode!(resp.body)
    data["Data"]["General"]["Description"]
  end
end
