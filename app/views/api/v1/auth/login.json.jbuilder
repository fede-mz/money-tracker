# frozen_string_literal: true
json.key_format! camelize: :lower

json.token @token
json.user do
  json.name @user.name
  json.primary_currency @user.primary_currency
end