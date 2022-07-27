# frozen_string_literal: true
json.key_format! camelize: :lower
json.tags @tags do |tag|
  json.id tag.id
  json.title tag.title
end
