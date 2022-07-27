# frozen_string_literal: true
json.key_format! camelize: :lower

json.total Money.new(data.map(&:last).sum, @currency).format
json.total_cents data.map(&:last).sum
json.by_categories data do |detail|
  json.category do
    json.id detail.first
    json.title Category.find(detail.first).title
  end
  json.amount Money.new(detail.second, @currency).format
  json.amount_cents detail.second
end
