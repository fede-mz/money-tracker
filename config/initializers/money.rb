# encoding : utf-8

MoneyRails.configure do |config|
  # https://github.com/RubyMoney/money-rails

  config.default_currency = :eur
  Money.locale_backend = :currency
  Money.rounding_mode = BigDecimal::ROUND_HALF_UP
end
