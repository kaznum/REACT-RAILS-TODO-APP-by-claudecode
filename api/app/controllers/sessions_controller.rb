# frozen_string_literal: true

class SessionsController < ApplicationController
  skip_before_action :authorize_request

  def create
    user = User.from_omniauth(request.env['omniauth.auth'])
    token = JsonWebToken.encode(user_id: user.id)
    redirect_to "http://localhost:8080/login?token=#{token}"
  end

  def failure
    redirect_to 'http://localhost:8080/login?error=authentication_failed'
  end
end
