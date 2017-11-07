defmodule CryptoScanWeb.PageController do
  use CryptoScanWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
