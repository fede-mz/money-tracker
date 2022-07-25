# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
require 'csv'

user = User.create!(name: 'Federico', email: 'fede.mz@gmail.com', password: 'password1')

CSV.foreach(File.open('./db/seeds/cash_flow.csv'), headers: true) do |row|
  account = Account.find_or_create_by!(
    user: user, title: row['Account'], currency: user.primary_currency
  )
  category = Category.find_or_create_by!(
    user: user, title: row['Category']
  )
  cash_flow = CashFlow.create!(
    account: account,
    category: category,
    flow_date: row['Date'],
    amount: Money.new(row['Amount'].to_f*100, user.primary_currency),
    is_balance: row['Is For Balance?'] == 'yes'
  )
  row['Tags']&.split(';')&.each do |tag|
    cash_flow.tags << Tag.find_or_create_by!(
      user: user, title: tag
    )
  end
end