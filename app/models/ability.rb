# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    can :manage, Account do |account|
      account.user_id == user.id
    end
    can :manage, Category do |category|
      category.user_id == user.id
    end
    can :manage, Tag do |tag|
      tag.user_id == user.id
    end
    can :manage, CashFlow do |cash_flow|
      cash_flow.account.user_id == user.id
    end
  end
end
