ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  def create_initial_data
    @user = User.create!(name: 'Federico', email: 'fede.mz@gmail.com', password: 'password1')
    @account = Account.create!(user: @user, title: 'Efectivo', currency: @user.primary_currency)
    @balance_category = Category.create!(user: @user, title: 'Balance')
    @pay_category = Category.create!(user: @user, title: 'Supermercado')
  end

  def create_cash_flow
    CashFlow.create!(
      account: @account,
      category: @balance_category,
      flow_date: 1.month.ago,
      amount: Money.new(800_00, 'EUR')
    )
    CashFlow.create!(
      account: @account,
      category: @balance_category,
      flow_date: 1.month.ago.end_of_month,
      amount: Money.new(700_00, 'EUR')
    )
    cash_flows = [-12_23, -33_04, -28_11].map do |amount|
      CashFlow.create!(
        account: @account,
        category: @pay_category,
        flow_date: Date.current.beginning_of_month,
        amount: Money.new(amount, 'EUR')
      )
    end
    %w(Comida Limpieza).each { |tag| cash_flows[1].tags << Tag.create!(user: @user, title: tag) }
  end

  def login_user
    post '/api/v1/auth/login.json', params: { email: 'fede.mz@gmail.com', password: 'password1' }
    assert_response :success
    body = JSON.parse(response.body)
    assert_not_empty body['token']
    body['token']
  end

end
