require 'test_helper'

class AccountTest < ActiveSupport::TestCase
  test 'Account record with uniqueness title' do
    user1 = User.create!(
      name: 'Federico',
      email: 'fede.mz@gmail.com',
      password: 'password1'
    )
    user2 = User.create!(
      name: 'Unused',
      email: 'unused@gmail.com',
      password: 'password1'
    )

    account = Account.new(
      user: user1,
      title: 'Account 1',
      currency: 'EUR'
    )
    assert(account.save, "Account couldn't be saved")

    account = Account.new(
      user: user1,
      title: 'Account 2',
      currency: 'EUR'
    )
    assert(account.save, "Account couldn't be saved")

    account = Account.new(
      user: user1,
      title: 'Account 1',
      currency: 'EUR'
    )
    assert_not(account.save, 'Validations should have failed')

    account = Account.new(
      user: user2,
      title: 'Account 1',
      currency: 'EUR'
    )
    assert(account.save, "Account couldn't be saved")

  end

  test 'Balance and snapshots' do
    create_initial_data
    create_cash_flow
    assert_equal(1426_62, @account.balance.cents, 'balance calculated')
    assert_not_empty(@account.account_snapshots, 'snapshot should be created')
    CashFlow.create!(
      account: @account,
      category: @pay_category,
      flow_date: 1.month.ago,
      amount: Money.new(-26_62, 'EUR')
    )
    assert_empty(@account.account_snapshots, 'snapshot should be removed')
    assert_equal(1400_00, @account.balance.cents, 'balance calculated')
    assert_not_empty(@account.account_snapshots, 'snapshot should be created')
    CashFlow.create!(
      account: @account,
      category: @pay_category,
      flow_date: Date.current,
      amount: Money.new(-10_00, 'EUR')
    )
    assert_not_empty(@account.account_snapshots, 'snapshot should still exists')
    assert_equal(1390_00, @account.balance.cents, 'balance calculated')
  end
end
