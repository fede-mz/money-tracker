# frozen_string_literal: true

class CashFlow < ApplicationRecord
  belongs_to :account
  belongs_to :category
  has_and_belongs_to_many :tags, dependant: :destroy

  monetize :amount_cents

  validates :flow_date, presence: true
  validates :amount_cents, numericality: { other_than: 0 }
  validate :amount_currency_matches

  scope :for_current_user, ->(user) { includes(:account).where(accounts: { user: user }) }
  scope :in_range, ->(from_date, to_date) { where('flow_date >= ? and flow_date <= ?', from_date, to_date) }

  # skip records used for balancing Accounts
  scope :incomes, -> { where('amount_cents > 0').where(is_balance: false) }
  scope :outcomes, -> { where('amount_cents < 0').where(is_balance: false) }

  # when a new cash flow is created, cache can become invalid.
  after_save :invalidate_cache
  before_destroy :invalidate_cache

  private
  def amount_currency_matches
    if amount.currency != account.currency
      errors.add :amount_cents, :currency, message: "Amount currency doesn't match Account currency"
    end
  end

  def invalidate_cache
    date = previous_changes[:flow_date].nil? ? flow_date : previous_changes[:flow_date].compact.min
    account.invalidate_cache(date)
  end
end
