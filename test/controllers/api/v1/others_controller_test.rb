require 'test_helper'

class Api::V1::OthersControllerTest < ActionDispatch::IntegrationTest

  setup do
    create_initial_data
  end

  test 'Categories list' do
    token = login_user

    # get accounts
    get '/api/v1/categories.json', headers: { Authorization: token }
    assert_response :success
    body = JSON.parse(response.body)

    assert_equal(2, body['categories'].size, 'should return 2 categories for the current user')
    assert_equal('Supermercado', body['categories'][1]['title'], 'should return a category title')
  end

  test 'Tags list' do
    Tag.create!(user: @user, title: 'Hogar')

    token = login_user

    # get accounts
    get '/api/v1/tags.json', headers: { Authorization: token }
    assert_response :success
    body = JSON.parse(response.body)

    assert_equal(1, body['tags'].size, 'should return 1 tags for the current user')
    assert_equal('Hogar', body['tags'][0]['title'], 'should return a tag title')
  end

end