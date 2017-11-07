defmodule CryptoScan.Repo.Migrations.CreateAlerts do
  use Ecto.Migration

  def change do
    create table(:alerts) do
      add :currency, :string
      add :exchange, :string
      add :comparator, :string
      add :breakpoint, :decimal
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:alerts, [:user_id])
  end
end
