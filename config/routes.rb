Rails.application.routes.draw do
  get 'site/index'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  namespace :api, defaults: {format: 'json'} do
    namespace :v1 do
      post 'auth/login'
      resources :cash_flows, only: [:index]
    end
  end

  # Defines the root path route ("/")
  root "site#index"
  # Catch-all for routes handled by front-end.
  get '*path', to: 'site#index', as: :react
end
