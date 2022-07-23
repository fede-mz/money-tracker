Rails.application.routes.draw do
  get 'site/index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "site#index"
  # Catch-all for routes handled by front-end.
  get '*path', to: 'site#index', as: :react
end
