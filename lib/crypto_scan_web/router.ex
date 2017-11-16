defmodule CryptoScanWeb.Router do
  use CryptoScanWeb, :router
  import MicroblogWeb.Plugs

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_user
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :fetch_user
  end

  scope "/", CryptoScanWeb do
    pipe_through :browser # Use the default browser stack

    resources "/users", UserController

    resources "/follows", FollowController

    resources "/alerts", AlertController

    post "/sessions", SessionController, :login
    delete "/sessions", SessionController, :logout

    get "/", PageController, :index
    get "/sampleCurrencyPage", PageController, :sampleCurrencyPage
    get "/sampleExchangePage", PageController, :sampleExchangePage
  end

  # Other scopes may use custom stacks.
  # scope "/api", CryptoScanWeb do
  #   pipe_through :api
  # end
end
