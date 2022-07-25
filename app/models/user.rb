class User < ApplicationRecord
  require 'securerandom'

  has_many :accounts
  has_many :categories
  has_many :tags

  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validates :password, presence: true
end
