# frozen_string_literal: true

# セッションストアの設定（OmniAuthのために最小限必要）
Rails.application.config.middleware.use ActionDispatch::Cookies
Rails.application.config.middleware.use ActionDispatch::Session::CookieStore,
                                        key: '_todo_app_session',
                                        same_site: :lax,
                                        secure: Rails.env.production?

# OmniAuth設定（テスト環境では不要）
unless Rails.env.test?
  Rails.application.config.middleware.use OmniAuth::Builder do
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
end
