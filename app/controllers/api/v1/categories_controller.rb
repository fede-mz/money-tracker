class Api::V1::CategoriesController < ApplicationController

  def index
    @categories = @current_user.categories
  end

end