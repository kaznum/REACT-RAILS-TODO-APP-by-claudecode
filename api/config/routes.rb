Rails.application.routes.draw do
  # OmniAuth routes
  get '/auth/:provider/callback', to: 'sessions#create'
  get '/auth/failure', to: redirect('/')

  # API routes
  namespace :api do
    get '/auth/check', to: 'auth#check'
    delete '/auth/logout', to: 'auth#logout'
    resources :todos
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
