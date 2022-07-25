class Tag < ApplicationRecord
  belongs_to :user

  validates :title, presence: true
  validates :title, uniqueness: { scope: :user_id }
end
