defmodule CryptoScan.FeedbackTest do
  use CryptoScan.DataCase

  alias CryptoScan.Feedback

  describe "alerts" do
    alias CryptoScan.Feedback.Alert

    @valid_attrs %{breakpoint: "120.5", comparator: "some comparator", currency: "some currency", exchange: "some exchange"}
    @update_attrs %{breakpoint: "456.7", comparator: "some updated comparator", currency: "some updated currency", exchange: "some updated exchange"}
    @invalid_attrs %{breakpoint: nil, comparator: nil, currency: nil, exchange: nil}

    def alert_fixture(attrs \\ %{}) do
      {:ok, alert} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Feedback.create_alert()

      alert
    end

    test "list_alerts/0 returns all alerts" do
      alert = alert_fixture()
      assert Feedback.list_alerts() == [alert]
    end

    test "get_alert!/1 returns the alert with given id" do
      alert = alert_fixture()
      assert Feedback.get_alert!(alert.id) == alert
    end

    test "create_alert/1 with valid data creates a alert" do
      assert {:ok, %Alert{} = alert} = Feedback.create_alert(@valid_attrs)
      assert alert.breakpoint == Decimal.new("120.5")
      assert alert.comparator == "some comparator"
      assert alert.currency == "some currency"
      assert alert.exchange == "some exchange"
    end

    test "create_alert/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Feedback.create_alert(@invalid_attrs)
    end

    test "update_alert/2 with valid data updates the alert" do
      alert = alert_fixture()
      assert {:ok, alert} = Feedback.update_alert(alert, @update_attrs)
      assert %Alert{} = alert
      assert alert.breakpoint == Decimal.new("456.7")
      assert alert.comparator == "some updated comparator"
      assert alert.currency == "some updated currency"
      assert alert.exchange == "some updated exchange"
    end

    test "update_alert/2 with invalid data returns error changeset" do
      alert = alert_fixture()
      assert {:error, %Ecto.Changeset{}} = Feedback.update_alert(alert, @invalid_attrs)
      assert alert == Feedback.get_alert!(alert.id)
    end

    test "delete_alert/1 deletes the alert" do
      alert = alert_fixture()
      assert {:ok, %Alert{}} = Feedback.delete_alert(alert)
      assert_raise Ecto.NoResultsError, fn -> Feedback.get_alert!(alert.id) end
    end

    test "change_alert/1 returns a alert changeset" do
      alert = alert_fixture()
      assert %Ecto.Changeset{} = Feedback.change_alert(alert)
    end
  end
end
