require 'test_helper'

class Api::V1::CashFlowControllerTest < ActionDispatch::IntegrationTest
  test 'controller should return cash_flow for current user (after login) and month' do
    user = User.create!(name: 'Federico', email: 'fede.mz@gmail.com', password: 'password1')
    account = Account.create!(user: user, title: 'Efectivo', currency: user.primary_currency)
    balance_category = Category.create!(user:user, title: 'Balance')
    pay_category = Category.create!(user:user, title: 'Super')

    CashFlow.create!(
      account: account,
      category: balance_category,
      flow_date: 1.month.ago,
      amount: Money.new(1500_00, 'EUR')
    )
    cash_flows = [-12_23, -33_04, -28_11].map do |amount|
      CashFlow.create!(
        account: account,
        category: pay_category,
        flow_date: Date.current,
        amount: Money.new(amount, 'EUR')
      )
    end
    %w[Comida Limpieza].each { |tag| cash_flows[1].tags << Tag.create!(user: user, title: tag) }

    user2 = User.create!(name: 'Unused', email: 'unused@gmail.com', password: 'password1')
    account2 = Account.create!(user: user2, title: 'Efectivo', currency: user2.primary_currency)
    pay_category2 = Category.create!(user: user2, title: 'Super')
    CashFlow.create!(
      account: account2,
      category: pay_category2,
      flow_date: Date.current,
      amount: Money.new(-15_00, 'EUR')
    )

    # login
    post '/api/v1/auth/login.json', params: {email: "fede.mz@gmail.com", password: "password1"}
    body = JSON.parse(response.body)
    token = body['token']

    # get cash flow
    get '/api/v1/cash_flows.json', headers: { Authorization: token }
    body = JSON.parse(response.body)

    assert_equal(3, body['cashFlows'].size, 'should return 3 cash_flows for the current user/month')
    assert_equal('€-12,23', body['cashFlows'][0]['amount'], 'first result should be the first we created')
    assert_not_empty(body['cashFlows'][1]['tags'].select { |tag| tag['title'] == 'Limpieza' }, 'second result should have a tag created')

  end
end