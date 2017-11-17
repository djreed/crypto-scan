defmodule CryptoScan.Repo.Migrations.CreateAlerts do
  use Ecto.Migration

  def change do
    create table(:alerts) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :currency, :string, null: false
      add :exchange, :string, null: false
      add :comparator, :string
      add :breakpoint, :decimal

      add :fired, :boolean, null: false, default: false

      timestamps()
    end

    create index(:alerts, [:user_id])
  end
end
