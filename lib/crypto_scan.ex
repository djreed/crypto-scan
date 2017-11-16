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
    data["USD"]
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
        "Ethereum Cash"
    end
  #LTC DASH AND ZEC NEEDED
    fullName
  end

  def getID(name) do
    if name == "BTC" do
      id = "1182"
    end
    if name == "ETH" do
      id = "7605"
    end
    if name == "BCH" do
      id = "202330"
    end
    if name == "ETC" do

    end
    if name == "LTC" do

    end
    if name == "DASH" do

    end
    if name == "ZEC" do

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
    allExchanges
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
