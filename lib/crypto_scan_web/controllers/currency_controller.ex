defmodule CryptoScanWeb.CurrencyController do
  use CryptoScanWeb, :controller

  def show(conn, %{"name" => name}) do
    price = CryptoScan.price(name)
    description = CryptoScan.description(CryptoScan.getID(name))
    allPrices = CryptoScan.priceAllExchanges(name)

    follow = %CryptoScan.Connectors.Follow{
      user: "",
      currency: "",
      exchange: "",
    }
    follow = CryptoScan.Connectors.change_follow(follow)

    render(conn, "show.html", price: price, description: description, allPrices: allPrices, follow: follow)
  end
end
