Rails.application.routes.draw do
  get 'site/index'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  namespace :api, defaults: {format: 'json'} do
    namespace :v1 do
      post 'auth/login'
      resources :accounts, only: [:index, :show]
      resources :categories, only: [:index]
      resources :tags, only: [:index]
      resources :cash_flows, only: [:index, :create] do
        get 'by_category', on: :collection
      end
    end
  end

  # Defines the root path route ("/")
  root "site#index"
  # Catch-all for routes handled by front-end.
  get '*path', to: 'site#index', as: :react
end
