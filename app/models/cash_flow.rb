class CashFlow < ApplicationRecord
  belongs_to :account
  belongs_to :category
  has_and_belongs_to_many :tags, dependant: :destroy

  monetize :amount_cents

  validates :flow_date, presence: true
  validate :amount_currency_matches

  private
  def amount_currency_matches
    if amount.currency != account.currency
      errors.add :amount_cents, :currency, message: "Amount currency doesn't match Account currency"
    end
  end
end
