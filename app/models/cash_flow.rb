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

  # when a new cash flow is created, some of the snapshots can become invalid.
  after_save :invalidate_snapshots

  private
  def amount_currency_matches
    if amount.currency != account.currency
      errors.add :amount_cents, :currency, message: "Amount currency doesn't match Account currency"
    end
  end

  def invalidate_snapshots
    account.invalidate_snapshots(flow_date)
  end
end
