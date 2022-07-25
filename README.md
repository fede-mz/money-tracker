# README

This application is a simple way to track income and expenses.

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

## Future Features
* Add a way to record annual payments and reminders
* Make sure that for the meaning average, annual payments are proportionally computed