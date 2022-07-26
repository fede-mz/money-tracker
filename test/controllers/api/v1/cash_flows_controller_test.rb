require 'test_helper'

class Api::V1::CashFlowsControllerTest < ActionDispatch::IntegrationTest

  setup do
    create_initial_data
  end

  test 'controller should return cash_flow for current user (after login) and month' do
    create_cash_flow

    #adding an extra cash_flow for another user
    user2 = User.create!(name: 'Unused', email: 'unused@gmail.com', password: 'password1')
    account2 = Account.create!(user: user2, title: 'Efectivo', currency: user2.primary_currency)
    pay_category2 = Category.create!(user: user2, title: 'Supermercado')
    CashFlow.create!(
      account: account2,
      category: pay_category2,
      flow_date: Date.current,
      amount: Money.new(-15_00, 'EUR')
    )

    token = login_user

    # get cash flow
    get '/api/v1/cash_flows.json', headers: { Authorization: token }
    assert_response :success
    body = JSON.parse(response.body)

    assert_equal(3, body['cashFlows'].size, 'should return 3 cash_flows for the current user/month')
    assert_equal('€-12,23', body['cashFlows'][0]['amount'], 'first result should be the first we created')
    assert_not_empty(body['cashFlows'][1]['tags'].select { |tag| tag['title'] == 'Limpieza' }, 'second result should have a tag created')

    # get cash flow for previous month
    get '/api/v1/cash_flows.json', params: {
      from_date: 1.month.ago.beginning_of_month.strftime("%Y-%m-%d"),
      to_date: 1.month.ago.end_of_month.strftime("%Y-%m-%d"),
    }, headers: { Authorization: token }
    assert_response :success
    body = JSON.parse(response.body)

    assert_equal(2, body['cashFlows'].size, 'should return 2 cash_flows for the previous month')
  end

  test 'create cash_flow record and delete it' do
    token = login_user

    post '/api/v1/cash_flows.json', params: {
      cash_flow: {
        account_id: @account.id,
        category_id: @pay_category.id,
        description: 'testing',
        flow_date: Date.current.strftime('%Y-%m-%d'),
        amount: -120.22,
        is_balance: false,
        tags: [
          { title: 'Comida' },
          { title: 'Hogar' },
        ]
      }
    }, headers: { Authorization: token }
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal(1, body['cashFlow']['id'], 'should return cash_flow json')

    post '/api/v1/cash_flows.json', params: {
      cash_flow: {
        account_id: @account.id,
        category_id: @pay_category.id,
        description: 'testing',
        is_balance: false
      }
    }, headers: { Authorization: token }
    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert_not_empty(body['errors']['flow_date'], 'should return errors')
    assert_not_empty(body['errors']['amount_cents'], 'should return errors')

    delete '/api/v1/cash_flows/1.json', headers: { Authorization: token }
    assert_response :success

    assert_equal(0, CashFlow.all.count, 'cash flow should be deleted')
  end

  test 'cash_flow by category' do
    create_cash_flow
    pay_category = Category.create!(user: @user, title: 'Movilidad')
    CashFlow.create!(
      account: @account,
      category: pay_category,
      flow_date: Date.current,
      amount: Money.new(-15_00, 'EUR')
    )

    token = login_user

    get '/api/v1/cash_flows/by_category.json', headers: { Authorization: token }
    assert_response :success
    body = JSON.parse(response.body)

    assert_equal(-8838, body['outcomes']['totalCents'], 'should return outcomes total')
    assert_equal(2, body['outcomes']['byCategories'].size, 'should return outcomes')
  end
end