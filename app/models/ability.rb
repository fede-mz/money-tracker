# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    can :manage, Account do |account|
      account.user_id == user.id
    end
  end
end
