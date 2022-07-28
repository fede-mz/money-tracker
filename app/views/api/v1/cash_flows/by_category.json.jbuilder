# frozen_string_literal: true
json.key_format! camelize: :lower

json.currency @currency
json.outcomes do
  json.partial! 'by_category_data', data: @outcomes
end
json.incomes do
  json.partial! 'by_category_data', data: @incomes
end
json.balance @balance.format
json.balance_cents @balance.cents