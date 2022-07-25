# frozen_string_literal: true
json.key_format! camelize: :lower
json.cash_flows @cash_flows do |cash_flow|
  json.id cash_flow.id
  json.flow_date cash_flow.flow_date.strftime('%Y-%m-%d')
  json.account do
    json.id cash_flow.account.id
    json.title cash_flow.account.title
  end
  json.category do
    json.id cash_flow.category.id
    json.title cash_flow.category.title
  end
  json.tags cash_flow.tags.map do |tag|
    json.id tag.id
    json.title tag.title
  end
  json.amount cash_flow.amount.format
  json.is_balance cash_flow.is_balance
end
