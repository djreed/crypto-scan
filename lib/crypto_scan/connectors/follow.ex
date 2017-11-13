defmodule CryptoScan.Connectors.Follow do
  use Ecto.Schema
  import Ecto.Changeset
  alias CryptoScan.Connectors.Follow


  schema "follows" do
    field :user_id, :id
    field :currency, CryptoScan.Currency
    field :exchange, CryptoScan.Exchange

    timestamps()
  end

  @doc false
  def changeset(%Follow{} = follow, attrs) do
    follow
    |> cast(attrs, [:currency, :exchange])
    |> validate_required([:currency, :exchange])
  end
end
