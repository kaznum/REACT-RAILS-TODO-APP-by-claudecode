# frozen_string_literal: true

Rails.application.config.middleware.insert_after ActionDispatch::Session::CookieStore, OmniAuth::Builder do
  provider :google_oauth2, ENV.fetch('GOOGLE_CLIENT_ID', nil), ENV.fetch('GOOGLE_CLIENT_SECRET', nil),
           {
             scope: 'email,profile',
             prompt: 'select_account',
             image_aspect_ratio: 'square',
             image_size: 50,
             provider_ignores_state: true
           }
end

OmniAuth.config.allowed_request_methods = %i[post get]
OmniAuth.config.silence_get_warning = true
