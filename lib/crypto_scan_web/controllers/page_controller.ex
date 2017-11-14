defmodule CryptoScanWeb.PageController do
  use CryptoScanWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def sampleCurrencyPage(conn, _params) do
    map = CryptoScan.price("BTC")
    price = map["USD"]
    description = CryptoScan.description("1182")
    render(conn, "sampleCurrencyPage.html", price: price, description: description)
  end
end
