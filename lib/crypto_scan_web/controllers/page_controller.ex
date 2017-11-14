defmodule CryptoScanWeb.PageController do
  use CryptoScanWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def sampleCurrencyPage(conn, _params) do
    price = CryptoScan.price("BTC")
    description = CryptoScan.description("1182")
    allPrices = CryptoScan.priceAllExchanges("BTC")
    render(conn, "sampleCurrencyPage.html", price: price, description: description, allPrices: allPrices)
  end
end
