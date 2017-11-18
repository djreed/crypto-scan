defmodule EmailAlert do
  @moduledoc """
  Documentation for EmailTest.
  """

  @doc """
  Hello world.

  ## Examples

      iex> EmailTest.hello
      :world

  """
  def hello do
    :world
  end

  def email(email, alert) do
    EmailAlert.Email.welcome_email(email, alert) |> EmailAlert.Mailer.deliver_now
  end
end

defmodule EmailAlert.Mailer do
  use Bamboo.Mailer, otp_app: :crypto_scan
end

# Define your emails
defmodule EmailAlert.Email do
  import Bamboo.Email

  def welcome_email(email, alert) do
    new_email(
      to: email,
      from: "automated@crypto-scan.com",
      subject: "Threshold Crossed",
      html_body: "<strong>Your alert has been triggered.</strong> " <> alert.currency <> " on "
      <> alert.exchange <> " is now " <> alert.comparator <> " $" <>
      Decimal.to_string(alert.breakpoint) <> "."
      )
  end

end
