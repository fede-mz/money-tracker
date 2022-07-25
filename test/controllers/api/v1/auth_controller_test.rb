require 'test_helper'

class Api::V1::AuthControllerTest < ActionDispatch::IntegrationTest
  test 'controller should allow login' do
    User.create!(name: 'Federico', email: 'fede.mz@gmail.com', password: 'password1')

    post '/api/v1/auth/login.json', params: {email: "fede_mz@hotmail.com", password: "password1"}
    assert_response :unauthorized

    post '/api/v1/auth/login.json', params: {email: "fede.mz@gmail.com", password: "password1"}
    assert_response :success

    body = JSON.parse(response.body)
    assert_not_empty body['token']
  end
end