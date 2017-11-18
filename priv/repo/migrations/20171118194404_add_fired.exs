defmodule CryptoScan.Repo.Migrations.AddFired do
  use Ecto.Migration

  def change do
    alter table("alerts") do
      add :fired, :boolean, null: false, default: false
    end
  end
end
