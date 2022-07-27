# frozen_string_literal: true

class Account < ApplicationRecord
  belongs_to :user

  has_many :cash_flows
  has_many :account_snapshots

  validates :title, presence: true
  validates :title, uniqueness: { scope: :user_id }
  validates :currency, presence: true

  scope :for_current_user, ->(user) { where(user: user) }

  # returns the balance for this account.
  # Performance concerns: cash_flows records can grow fast
  #  using snapshots, we only need to calculate the balance for
  #  those records outside the snapshot
  def balance
    prev_month = 1.month.ago.end_of_month.to_date
    snapshot = account_snapshots.order(snapshot_date: :desc).first
    if snapshot.blank? || snapshot.snapshot_date != prev_month
      # need a new snapshot
      cash_flows_for_balance = cash_flows.where('flow_date <= ?', prev_month)
      cash_flows_for_balance.where('flow_date > ?', snapshot.snapshot_date) if snapshot.present?
      cash_flow_balance = cash_flows_for_balance.pluck(:amount_cents).sum
      cash_flow_balance = cash_flow_balance + snapshot.balance_cents if snapshot.present?
      snapshot = AccountSnapshot.create!(
        account: self,
        snapshot_date: prev_month,
        balance: Money.new(cash_flow_balance, currency)
      )
    end
    cash_flow_balance = cash_flows.where('flow_date > ?', prev_month).pluck(:amount_cents).sum
    snapshot.balance + Money.new(cash_flow_balance, currency)
  end

  # when a new cash flow is created, some of the snapshots can become invalid.
  def invalidate_snapshots(date)
    account_snapshots.where('snapshot_date >= ?', date).destroy_all
  end
end
