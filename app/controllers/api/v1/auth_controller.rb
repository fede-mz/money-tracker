# frozen_string_literal: true

class Api::V1::AuthController < ApplicationController
  skip_before_action :authenticate_request, only: :login

  def login
    @user = User.find_by_email(params[:email])
    if @user&.authenticate(params[:password])
      @token = jwt_encode(user_id: @user.id)
    else
      render json: { error: 'wrong email or password.' }, status: :unauthorized
    end
  end
end