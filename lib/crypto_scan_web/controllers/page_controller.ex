defmodule CryptoScanWeb.PageController do
  use CryptoScanWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def sampleCurrencyPage(conn, _params) do
    price = CryptoScan.price("BTC")
    description = CryptoScan.description("1182")
    allPrices = CryptoScan.priceAllExchanges("BTC")

    follow = %CryptoScan.Connectors.Follow{
      user: "",
      currency: "",
      exchange: "",
    }
    follow = CryptoScan.Connectors.change_follow(follow)

    render(conn, "sampleCurrencyPage.html", price: price, description: description, allPrices: allPrices, follow: follow)
  end

  def sampleExchangePage(conn, _params) do
    allPrices = CryptoScan.priceAllCurrencies("Coinbase")

    follow = %CryptoScan.Connectors.Follow{
      user: "",
      currency: "",
      exchange: "",
    }
    follow = CryptoScan.Connectors.change_follow(follow)

    render(conn, "sampleExchangePage.html", allPrices: allPrices, follow: follow)
  end
end
