use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :crypto_scan, CryptoScanWeb.Endpoint,
  secret_key_base: "Hc06SRmduMNfdJd08WUcvXEEoBcqTW0AZAncZkki04tl0uzl9D+b2f0XIhCH5emw"

# Configure your database
config :crypto_scan, CryptoScan.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "crypto_scan_prod",
  pool_size: 15
