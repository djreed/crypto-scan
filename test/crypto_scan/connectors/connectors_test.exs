defmodule CryptoScan.ConnectorsTest do
  use CryptoScan.DataCase

  alias CryptoScan.Connectors

  describe "follows" do
    alias CryptoScan.Connectors.Follow

    @valid_attrs %{currency: "some currency", exchange: "some exchange"}
    @update_attrs %{currency: "some updated currency", exchange: "some updated exchange"}
    @invalid_attrs %{currency: nil, exchange: nil}

    def follow_fixture(attrs \\ %{}) do
      {:ok, follow} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Connectors.create_follow()

      follow
    end

    test "list_follows/0 returns all follows" do
      follow = follow_fixture()
      assert Connectors.list_follows() == [follow]
    end

    test "get_follow!/1 returns the follow with given id" do
      follow = follow_fixture()
      assert Connectors.get_follow!(follow.id) == follow
    end

    test "create_follow/1 with valid data creates a follow" do
      assert {:ok, %Follow{} = follow} = Connectors.create_follow(@valid_attrs)
      assert follow.currency == "some currency"
      assert follow.exchange == "some exchange"
    end

    test "create_follow/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Connectors.create_follow(@invalid_attrs)
    end

    test "update_follow/2 with valid data updates the follow" do
      follow = follow_fixture()
      assert {:ok, follow} = Connectors.update_follow(follow, @update_attrs)
      assert %Follow{} = follow
      assert follow.currency == "some updated currency"
      assert follow.exchange == "some updated exchange"
    end

    test "update_follow/2 with invalid data returns error changeset" do
      follow = follow_fixture()
      assert {:error, %Ecto.Changeset{}} = Connectors.update_follow(follow, @invalid_attrs)
      assert follow == Connectors.get_follow!(follow.id)
    end

    test "delete_follow/1 deletes the follow" do
      follow = follow_fixture()
      assert {:ok, %Follow{}} = Connectors.delete_follow(follow)
      assert_raise Ecto.NoResultsError, fn -> Connectors.get_follow!(follow.id) end
    end

    test "change_follow/1 returns a follow changeset" do
      follow = follow_fixture()
      assert %Ecto.Changeset{} = Connectors.change_follow(follow)
    end
  end
end
