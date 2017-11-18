defmodule CryptoScanWeb.ExchangeController do
  use CryptoScanWeb, :controller

  def index(conn, _params) do
    exchanges = CryptoScan.Exchange.values

    render(conn, "index.html", exchanges: exchanges)
  end

  def show(conn, %{"name" => name}) do
    allPrices = CryptoScan.priceAllCurrencies(name)

    follow = %CryptoScan.Connectors.Follow{
      user: "",
      currency: "",
      exchange: "",
    }
    follow = CryptoScan.Connectors.change_follow(follow)

    render(conn, "show.html", allPrices: allPrices, follow: follow, name: name)
  end
end
