require 'test_helper'

class Api::V1::AccountsControllerTest < ActionDispatch::IntegrationTest

  setup do
    create_initial_data
  end

  test 'Account list and balance' do
    create_cash_flow

    token = login_user

    # get accounts
    get '/api/v1/accounts.json', headers: { Authorization: token }
    assert_response :success
    body = JSON.parse(response.body)

    assert_equal(1, body['accounts'].size, 'should return 1 account for the current user')
    account_id = body['accounts'][0]['id']

    # get account detail with balance
    get "/api/v1/accounts/#{account_id}.json", headers: { Authorization: token }
    assert_response :success
    body = JSON.parse(response.body)

    assert_equal('€1.426,62', body['account']['balance'], 'should return the current balance')
  end

  test 'Unauthorized access to Account' do
    user2 = User.create!(name: 'Unused', email: 'unused@gmail.com', password: 'password1')
    account2 = Account.create!(user: user2, title: 'Efectivo', currency: user2.primary_currency)

    token = login_user

    # get account detail with balance
    get "/api/v1/accounts/#{account2.id}.json", headers: { Authorization: token }
    assert_response :forbidden

  end
end