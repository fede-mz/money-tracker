# README

This application is a simple way to track income and expenses/outcomes/payments.

Note: This is for personal purposes and it's still in development.

## Versions
* Ruby version: 3.1.2
* Rails version: 7.0.3
* Node: 16.16.0

## Prerequisites
Ruby, Rails and Bundler

Node, NPM and Yarn

## Database:
SQLite 3

## Setup
* `bundle install`
* `bundle exec rake db:create db:migrate db:seed`
* `yarn`

## Start the Server
* `bundle exec rails s`

## Testing
* `bundle exec rake db:test:prepare`
* `bundle exec rails test`

Take a look at the branch `testing_with_cypress` for a WIP on E2E testing with cypress.

## Future Features
* Manage Accounts, Categories and Tags (create tags while typing in CashFlowForm)
* Outcomes by category, allow filtering by tags
* Allow the user to have more than one currency (and convert currencies to show a single result)
* Compare Outcome by Category with the budget
* Calculate an average of outcomes for the last X months.
  * Make sure that annual payments are proportionally computed
  * example: car insurance is billed annually, so we should take that amount and divide by 12 to know the average 