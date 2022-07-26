require 'test_helper'

class Api::V1::AuthControllerTest < ActionDispatch::IntegrationTest
  test 'controller should not allow wrong username' do
    create_initial_data

    post '/api/v1/auth/login.json', params: {email: "fede_mz@hotmail.com", password: "password1"}
    assert_response :unauthorized
  end
end