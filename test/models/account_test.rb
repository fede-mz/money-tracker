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

  test 'Balance and cache' do
    create_initial_data
    create_cash_flow
    assert_equal(1426_62, @account.balance.cents, 'balance calculated')
    cache_key = @account.cache_key_with_version
    cash_flow_prev = CashFlow.create!(
      account: @account,
      category: @pay_category,
      flow_date: 1.month.ago,
      amount: Money.new(-26_62, 'EUR')
    )
    assert_not_equal(cache_key, @account.cache_key_with_version, 'cache key should have changed')
    assert_equal(1400_00, @account.balance.cents, 'balance calculated')
    cache_key = @account.cache_key_with_version
    cash_flow_curr = CashFlow.create!(
      account: @account,
      category: @pay_category,
      flow_date: Date.current,
      amount: Money.new(-10_00, 'EUR')
    )
    assert_equal(cache_key, @account.cache_key_with_version, 'cache key should be the same')
    assert_equal(1390_00, @account.balance.cents, 'balance calculated')
    cash_flow_curr.destroy!
    assert_equal(cache_key, @account.cache_key_with_version, 'cache key should be the same')
    cash_flow_prev.destroy!
    assert_not_equal(cache_key, @account.cache_key_with_version, 'cache key should have changed')
    cache_key = @account.cache_key_with_version
    cash_flow_new = CashFlow.create!(
      account: @account,
      category: @pay_category,
      flow_date: 1.month.ago,
      amount: Money.new(-20_00, 'EUR')
    )
    assert_equal(1406_62, @account.balance.cents, 'balance calculated')
    cash_flow_new.update!(flow_date: Date.current)
    assert_not_equal(cache_key, @account.cache_key_with_version, 'cache key should have changed')
  end
end
