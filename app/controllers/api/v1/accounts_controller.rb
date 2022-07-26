class Api::V1::AccountsController < ApplicationController
  load_and_authorize_resource

  def index
    @accounts = Account.for_current_user(@current_user)
  end

  def show; end

end
