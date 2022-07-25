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
end
