defmodule CryptoScan.Repo.Migrations.CreateFollows do
  use Ecto.Migration

  def change do
    create table(:follows) do
      add :currency, :string
      add :exchange, :string
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:follows, [:user_id])
  end
end
