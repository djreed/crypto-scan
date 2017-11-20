defmodule CryptoScan do
  @moduledoc """
  CryptoScan keeps the contexts that define your domain
  and business logic.

  Contexts are also responsible for managing your data, regardless
  if it comes from the database, an external API or others.
  """

  alias CryptoScan.Currency

  def coin_list do
    resp = HTTPoison.get!("https://www.cryptocompare.com/api/data/coinlist/")
    data = Poison.decode!(resp.body)
    data["Data"]
  end

  def price(currency) do
    resp = HTTPoison.get!("https://min-api.cryptocompare.com/data/price?fsym="
      <> currency
      <> "&tsyms=USD")
    data = Poison.decode!(resp.body)
    data["USD"]
  end

  def priceFromExchange(currency, exchange) do
    resp = HTTPoison.get!("https://min-api.cryptocompare.com/data/price?fsym="
      <> currency
      <> "&tsyms=USD&e="
      <> exchange)
    data = Poison.decode!(resp.body)
    if data["Response"] == "Error" do
      -1
    else
      data["USD"]
    end
  end

  def getFullName(name) do
    cond do
      name == Enum.at(Currency.values, 0) ->
        fullName = "Bitcoin"
      name == Enum.at(Currency.values, 1) ->
        fullName = "Ethereum"
      name == Enum.at(Currency.values, 2) ->
        fullName = "Bitcoin Cash"
      name == Enum.at(Currency.values, 3) ->
        fullName = "Ethereum Classic"
      name == Enum.at(Currency.values, 4) ->
        fullName = "Litecoin"
      name == Enum.at(Currency.values, 5) ->
        fullName = "Dash"
      name == Enum.at(Currency.values, 6) ->
        fullName = "Zcash"
    end
    fullName
  end

  def getID(name) do
    cond do
      name == Enum.at(Currency.values, 0) ->
        id = "1182"
      name == Enum.at(Currency.values, 1) ->
        id = "7605"
      name == Enum.at(Currency.values, 2) ->
        id = "202330"
      name == Enum.at(Currency.values, 3) ->
        id = "5324"
      name == Enum.at(Currency.values, 4) ->
        id = "3808"
      name == Enum.at(Currency.values, 5) ->
        id = "3807"
      name == Enum.at(Currency.values, 6) ->
        id = "24854"
    end
    id
  end

  def priceAllExchanges(currency) do
    allExchanges = [
      %{ name: "Bitstamp",
         currency: currency,
         exchangePrice: priceFromExchange(currency, "Bitstamp")},
      %{ name: "BitTrex",
         currency: currency,
         exchangePrice: priceFromExchange(currency, "BitTrex")},
      %{ name: "Coinbase",
         currency: currency, exchangePrice:
         priceFromExchange(currency, "Coinbase")},
      %{ name: "Bitfinex",
         currency: currency,
         exchangePrice: priceFromExchange(currency, "Bitfinex")},
      %{ name: "Gemini",
         currency: currency,
         exchangePrice: priceFromExchange(currency, "Gemini")},
      %{ name: "Poloniex",
         currency: currency,
         exchangePrice: priceFromExchange(currency, "Poloniex")}
    ]

    data = for exchange <- allExchanges do
      if exchange.exchangePrice != -1 do
        exchange
      end
    end

    data
  end

  def priceAllCurrencies(exchange) do
    allCurrencies = [
      %{
        name: "Bitcoin",
        abb: "BTC",
        currencyPrice: priceFromExchange("BTC", exchange)
      },
      %{
        name: "Ethereum",
        abb: "ETH",
        currencyPrice: priceFromExchange("ETH", exchange)
      },
      %{
        name: "Bitcoin Cash",
        abb: "BCH",
        currencyPrice: priceFromExchange("BCH", exchange)
      },
      %{
        name: "Ethereum Classic",
        abb: "ETC",
        currencyPrice: priceFromExchange("ETC", exchange)
      },
      %{
        name: "Litecoin",
        abb: "LTC",
        currencyPrice: priceFromExchange("LTC", exchange)
      },
      %{
        name: "Dash",
        abb: "DASH",
        currencyPrice: priceFromExchange("DASH", exchange)
      },
      %{
        name: "Zcash",
        abb: "ZEC",
        currencyPrice: priceFromExchange("ZEC", exchange)
      },
    ]

    data = for currency <- allCurrencies do
      if currency.currencyPrice != -1 do
        currency
      end
    end
  end

  def priceConverter(currencyToConvert, convertedCurrency) do
    resp = HTTPoison.get!("https://min-api.cryptocompare.com/data/price?fsym=" <> currencyToConvert <> "&tsyms=" <> convertedCurrency)
    data = Poison.decode!(resp.body)
  end

  def description(id) do
    resp = HTTPoison.get!("https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id=" <> id)
    data = Poison.decode!(resp.body)
    data["Data"]["General"]["Description"]
  end
end
