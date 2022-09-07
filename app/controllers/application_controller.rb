# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include JsonWebToken

  before_action :authenticate_request

  def current_ability
    @current_user.ability
  end

  rescue_from CanCan::AccessDenied do |exception|
    respond_to do |format|
      format.json { head :forbidden, content_type: 'text/html' }
    end
  end

  rescue_from JWT::ExpiredSignature do |exception|
    respond_to do |format|
      format.json { head :forbidden, content_type: 'text/html' }
    end
  end


  private
  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    decoded = jwt_decode(header)
    @current_user = User.find(decoded[:user_id])
  end
end
