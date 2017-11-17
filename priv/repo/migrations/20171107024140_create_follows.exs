defmodule CryptoScan.Repo.Migrations.CreateFollows do
  use Ecto.Migration

  def change do
    create table(:follows) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :currency, :string, null: false
      add :exchange, :string, null: true

      timestamps()
    end

    create index(:follows, [:user_id])
  end
end
