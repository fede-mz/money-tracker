# frozen_string_literal: true
json.key_format! camelize: :lower
json.cash_flow do
  json.id @cash_flow.id
  json.flow_date @cash_flow.flow_date.strftime('%Y-%m-%d')
  json.account do
    json.id @cash_flow.account.id
    json.title @cash_flow.account.title
  end
  json.category do
    json.id @cash_flow.category.id
    json.title @cash_flow.category.title
  end
  json.tags @cash_flow.tags.map do |tag|
    json.id tag.id
    json.title tag.title
  end
  json.description @cash_flow.description
  json.amount @cash_flow.amount.format
  json.amount_cents @cash_flow.amount_cents
  json.is_balance @cash_flow.is_balance
end
