# frozen_string_literal: true
json.key_format! camelize: :lower
json.accounts @accounts do |account|
  json.id account.id
  json.title account.title
  json.currency account.currency
  json.balance account.balance.format
end
