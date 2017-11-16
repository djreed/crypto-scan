defmodule CryptoScan.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias CryptoScan.Accounts.User

  schema "users" do
    field :email, :string
    field :name, :string
    field :password_hash, :string
    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true

    timestamps()
  end

  @doc false
  def changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:name, :email, :password, :password_confirmation])
    |> validate_confirmation(:password)
    |> validate_password(:password)
    |> put_pass_hash()
    |> unique_constraint(:email)
    |> validate_required([:name, :email, :password_hash])
  end

  ### Password validation ###
  # From Comeonin docs
  def validate_password(changeset, field, options \\ []) do
    validate_change(changeset, field, fn _, password ->
      case valid_password?(password) do
        {:ok, _} -> []
        {:error, msg} -> [{field, options[:message] || msg}]
      end
    end)
  end

  defp put_pass_hash(%Ecto.Changeset{valid?: true, changes:
                                     %{password: password}} = changeset) do
    change(changeset, Comeonin.Argon2.add_hash(password))
  end
  defp put_pass_hash(changeset), do: changeset

  defp valid_password?(password) when byte_size(password) > 7 do
    {:ok, password}
  end
  defp valid_password?(_), do: {:error, "The password is too short"}
  ### End of password validation ###

end
