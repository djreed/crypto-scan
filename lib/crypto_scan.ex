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

  def priceAllExchanges(currency) do
    allExchanges = [priceFromExchange(currency, "Bitstamp"), priceFromExchange(currency, "BitTrex"),
    priceFromExchange(currency, "Coinbase"), priceFromExchange(currency, "Bitfinex"),
    priceFromExchange(currency, "Gemini"), priceFromExchange(currency, "Poloniex")]
    allExchanges
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
