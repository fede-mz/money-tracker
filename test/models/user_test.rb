require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test 'User record' do
    user = User.new(
      email: 'fede.mz@gmail.com'
    )
    assert_not(user.save, 'validations should have failed')

    user = User.new(
      name: 'Federico',
      email: 'fede.mz@gmail.com',
      password: 'password1'
    )
    assert(user.save, 'validations should have passed')
    assert_not_empty(user.password_digest)
  end
end
