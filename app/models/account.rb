class Account < ApplicationRecord
  belongs_to :user

  validates :title, presence: true
  validates :currency, presence: true
end
