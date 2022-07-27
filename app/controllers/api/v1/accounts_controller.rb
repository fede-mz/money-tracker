class Api::V1::AccountsController < ApplicationController
  load_and_authorize_resource

  def index
    @accounts = @current_user.accounts
  end

  def show; end

end
