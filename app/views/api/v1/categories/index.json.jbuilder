# frozen_string_literal: true
json.key_format! camelize: :lower
json.categories @categories do |category|
  json.id category.id
  json.title category.title
end
