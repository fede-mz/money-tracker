# frozen_string_literal: true

class Account < ApplicationRecord
  belongs_to :user

  has_many :cash_flows

  validates :title, presence: true
  validates :title, uniqueness: { scope: :user_id }
  validates :currency, presence: true

  scope :for_current_user, ->(user) { where(user: user) }

  # returns the balance for this account.
  # Performance concerns: cash_flows records can grow fast
  #  using cache, we only need to calculate the balance for records outside the cache
  def balance
    prev_month = 1.month.ago.end_of_month.to_date
    prev_month_balance = Rails.cache.fetch("#{cache_key_with_version}/prev_month_balance/#{prev_month.strftime('%Y-%m-%d')}", expires_in: 24.hours) do
      cash_flows_for_balance = cash_flows.where('flow_date <= ?', prev_month)
      cash_flows_for_balance.pluck(:amount_cents).sum
    end
    cash_flow_balance = cash_flows.where('flow_date > ?', prev_month).pluck(:amount_cents).sum
    Money.new(prev_month_balance + cash_flow_balance, currency)
  end

  # when a new cash flow is created, cache can become invalid.
  def invalidate_cache(date)
    prev_month = 1.month.ago.end_of_month.to_date
    unless date.after?(prev_month)
      self.touch
    end
  end
end
