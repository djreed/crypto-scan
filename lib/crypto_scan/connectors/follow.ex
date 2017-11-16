defmodule CryptoScan.Connectors.Follow do
  use Ecto.Schema
  import Ecto.Changeset
  alias CryptoScan.Connectors.Follow


  schema "follows" do
    belongs_to :user, CryptoScan.Accounts.User
    field :currency, CryptoScan.Currency
    field :exchange, CryptoScan.Exchange

    timestamps()
  end

  @doc false
  def changeset(%Follow{} = follow, attrs) do
    follow
    |> cast(attrs, [:currency, :exchange, :user_id])
    |> validate_required([:currency, :exchange, :user_id])
  end
end
