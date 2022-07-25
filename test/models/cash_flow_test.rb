require 'test_helper'

class CashFlowTest < ActiveSupport::TestCase
  test 'CashFlow record' do

    user = User.create!(name: 'Federico', email: 'fede.mz@gmail.com', password: 'password1')
    assert_equal('EUR', user.primary_currency)
    account = Account.create!(user: user, title: 'Efectivo', currency: user.primary_currency)
    work_category = Category.create!(user:user, title: 'Trabajo')
    pay_category = Category.create!(user:user, title: 'Entretenimiento')

    cash_flow = CashFlow.new(
      account: account,
      category: work_category,
      amount: Money.new(100, user.primary_currency)
    )
    assert_not(cash_flow.save, 'validations should have failed')
    cash_flow.flow_date = Date.current
    assert(cash_flow.save, "it couldn't be saved")

    cash_flow = CashFlow.new(
      account: account,
      category: pay_category,
      flow_date: Date.current,
      amount: Money.new(-20, 'USD')
    )
    assert_not(cash_flow.save, 'currency validation should have failed')
    cash_flow.amount = Money.new(-20, user.primary_currency)
    assert(cash_flow.save, "it couldn't be saved")

    amount_balance = CashFlow.where(account: account).sum(:amount_cents)
    assert_equal(80, amount_balance, 'balance is wrong')
  end
end
