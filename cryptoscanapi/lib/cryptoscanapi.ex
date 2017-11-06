defmodule Cryptoscanapi do
  @moduledoc """
  Documentation for Cryptoscanapi.
  """

  @doc """
  Hello world.

  ## Examples

      iex> Cryptoscanapi.hello
      :world

  """

  def coin_list do
    resp = HTTPoison.get!("https://www.cryptocompare.com/api/data/coinlist/")
    data = Poison.decode!(resp.body)
    data["Data"]
  end

def price(currency) do
  resp = HTTPoison.get!("https://min-api.cryptocompare.com/data/price?fsym=" <> currency <> "&tsyms=USD")
  data = Poison.decode!(resp.body)
  data
end

def priceConverter(currencyToConvert, convertedCurrency) do
  resp = HTTPoison.get!("https://min-api.cryptocompare.com/data/price?fsym=" <> currencyToConvert <> "&tsyms=" <> convertedCurrency)
  data = Poison.decode!(resp.body)
  data
end

def bitcoinDescription do
  resp = HTTPoison.get!("https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id=1182 ")
  data = Poison.decode!(resp.body)
  data["Data"]["General"]["Description"]
end



  def hello do
    :world
  end
end
