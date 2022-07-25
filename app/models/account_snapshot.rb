class AccountSnapshot < ApplicationRecord
  belongs_to :account

  monetize :balance_cents

  validates :snapshot_date, presence: true
end
