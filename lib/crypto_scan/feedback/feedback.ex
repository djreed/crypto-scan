defmodule CryptoScan.Feedback do
  @moduledoc """
  The Feedback context.
  """

  import Ecto.Query, warn: false
  alias CryptoScan.Repo

  alias CryptoScan.Feedback.Alert

  @doc """
  Returns the list of alerts.

  ## Examples

      iex> list_alerts()
      [%Alert{}, ...]

  """
  def list_alerts do
    Repo.all(Alert)
  end

  @doc """
  Gets a single alert.

  Raises `Ecto.NoResultsError` if the Alert does not exist.

  ## Examples

      iex> get_alert!(123)
      %Alert{}

      iex> get_alert!(456)
      ** (Ecto.NoResultsError)

  """
  def get_alert!(id), do: Repo.get!(Alert, id)

  @doc """
  Creates a alert.

  ## Examples

      iex> create_alert(%{field: value})
      {:ok, %Alert{}}

      iex> create_alert(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_alert(attrs \\ %{}) do
    %Alert{}
    |> Alert.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a alert.

  ## Examples

      iex> update_alert(alert, %{field: new_value})
      {:ok, %Alert{}}

      iex> update_alert(alert, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_alert(%Alert{} = alert, attrs) do
    alert
    |> Alert.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Alert.

  ## Examples

      iex> delete_alert(alert)
      {:ok, %Alert{}}

      iex> delete_alert(alert)
      {:error, %Ecto.Changeset{}}

  """
  def delete_alert(%Alert{} = alert) do
    Repo.delete(alert)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking alert changes.

  ## Examples

      iex> change_alert(alert)
      %Ecto.Changeset{source: %Alert{}}

  """
  def change_alert(%Alert{} = alert) do
    Alert.changeset(alert, %{})
  end

  def fire_alert(%Alert{} = alert) do
    alert
    |> Alert.changeset(%{fired: "true"})
    |> Repo.update()
  end

  def emailAlerts do
    alerts = CryptoScan.Feedback.list_alerts

    for alert <- alerts do
      price = CryptoScan.priceFromExchange(alert.currency, alert.exchange)
      if (alert.comparator == CryptoScan.Comparator.values[0]) do
        if (price < alert.breakpoint and !alert.fired) do
          user = CryptoScan.Accounts.get_user!(alert.user_id)
          EmailAlert.email(user.email, alert)
          fire_alert(alert)
        end
      else
        if (alert.comparator == CryptoScan.Comparator.values[1]) do
          if (price > alert.breakpoint and !alert.fired) do
            user = CryptoScan.Accounts.get_user!(alert.user_id)
            EmailAlert.email(user.email, alert)
            fire_alert(alert)
          end
        end
      end
    end
  end
end
