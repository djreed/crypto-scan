defmodule CryptoScanWeb.AlertController do
  use CryptoScanWeb, :controller

  alias CryptoScan.Feedback
  alias CryptoScan.Feedback.Alert

  def index(conn, _params) do
    alerts = Feedback.list_alerts()
    render(conn, "index.html", alerts: alerts)
  end

  def new(conn, _params) do
    changeset = Feedback.change_alert(%Alert{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"alert" => alert_params}) do
    case Feedback.create_alert(alert_params) do
      {:ok, alert} ->
        conn
        |> put_flash(:info, "Alert created successfully.")
        |> redirect(to: alert_path(conn, :show, alert))
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    alert = Feedback.get_alert!(id)
    render(conn, "show.html", alert: alert)
  end

  def edit(conn, %{"id" => id}) do
    alert = Feedback.get_alert!(id)
    changeset = Feedback.change_alert(alert)
    render(conn, "edit.html", alert: alert, changeset: changeset)
  end

  def update(conn, %{"id" => id, "alert" => alert_params}) do
    alert = Feedback.get_alert!(id)

    case Feedback.update_alert(alert, alert_params) do
      {:ok, alert} ->
        conn
        |> put_flash(:info, "Alert updated successfully.")
        |> redirect(to: alert_path(conn, :show, alert))
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", alert: alert, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    alert = Feedback.get_alert!(id)
    {:ok, _alert} = Feedback.delete_alert(alert)

    conn
    |> put_flash(:info, "Alert deleted successfully.")
    |> redirect(to: alert_path(conn, :index))
  end
end
