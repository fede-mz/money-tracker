class Api::V1::TagsController < ApplicationController

  def index
    @tags = @current_user.tags
  end

end