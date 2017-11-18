defmodule CryptoScan.Feedback.Alert do
  use Ecto.Schema
  import Ecto.Changeset
  alias CryptoScan.Feedback.Alert


  schema "alerts" do
    field :user_id, :id
    field :breakpoint, :decimal
    field :comparator, CryptoScan.Comparator
    field :currency, CryptoScan.Currency
    field :exchange, CryptoScan.Exchange

    field :fired, :boolean

    timestamps()
  end

  @doc false
  def changeset(%Alert{} = alert, attrs) do
    alert
    |> cast(attrs, [:currency, :exchange, :comparator, :breakpoint])
    |> validate_required([:currency, :exchange, :comparator, :breakpoint])
  end
end
