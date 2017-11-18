defmodule CryptoScanWeb.CurrencyController do
  use CryptoScanWeb, :controller

  alias CryptoScan.Connectors

  def index(conn, _params) do
    currencies = CryptoScan.Currency.values

    allCurrencies = for c <- currencies do
      %{
        fullName: CryptoScan.getFullName(c),
        abr: c,
        price: CryptoScan.price(c),
        description: CryptoScan.description(CryptoScan.getID(c))
      }
    end

    render(conn, "index.html", currencies: allCurrencies)
  end

  def show(conn, %{"name" => name}) do
    price = CryptoScan.price(name)
    description = CryptoScan.description(CryptoScan.getID(name))
    allPrices = CryptoScan.priceAllExchanges(name)
    fullName = CryptoScan.getFullName(name)

    follow = %Connectors.Follow{
      user: "",
      currency: "",
      exchange: "",
    }
    follow = Connectors.change_follow(follow)

    render(conn, "show.html",
      price: price,
      description: description,
      allPrices: allPrices,
      follow: follow,
      name: name,
      fullName: fullName)
  end

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
