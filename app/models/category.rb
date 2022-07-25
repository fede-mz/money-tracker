class Category < ApplicationRecord
  belongs_to :user

  monetize :budget_cents

  validates :title, presence: true
  validates :title, uniqueness: { scope: :user_id }
end
