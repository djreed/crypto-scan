defmodule CryptoScanWeb.CurrencyController do
  use CryptoScanWeb, :controller

  alias CryptoScan.Connectors

  def index(conn, _params) do
    currencies = CryptoScan.Currency.values

    allCurrencies = for c <- currencies do
      %{
        fullName: CryptoScan.getFullName(c),
        abr: c,
        #price: CryptoScan.price(c),
        #description: CryptoScan.description(CryptoScan.getID(c))
      }
    end

    render(conn, "index.html", currencies: allCurrencies)
  end

  def show(conn, %{"name" => name}) do
    if !Enum.member? CryptoScan.Currency.values, name do
      conn
      |> put_flash(:error, "Currency abbreviation '" <> name <> "' does not exist.")
      |> redirect(to: currency_path(conn, :index))
    end

    fullName = CryptoScan.getFullName(name)
    price = CryptoScan.price(name)
    description = CryptoScan.description(CryptoScan.getID(name))
    allPrices = CryptoScan.priceAllExchanges(name)

    follow = %Connectors.Follow{
      user: "",
      currency: "",
      exchange: "",
    }
    follow = Connectors.change_follow(follow)

    render(conn, "show.html",
      name: name,
      fullName: fullName,
      price: price,
      description: description,
      allPrices: allPrices,
      follow: follow
    )
  end
end
