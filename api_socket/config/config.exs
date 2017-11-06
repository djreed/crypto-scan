# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :api_socket,
  ecto_repos: [ApiSocket.Repo]

# Configures the endpoint
config :api_socket, ApiSocketWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "YbdNkd/ampoReSDzBn1rOy/cVPu0wwP8hLPBhGSeCcAvclZkMXcos/od8Zlrhbl9",
  render_errors: [view: ApiSocketWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: ApiSocket.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
