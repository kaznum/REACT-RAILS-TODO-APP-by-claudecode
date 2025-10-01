# frozen_string_literal: true

class SessionsController < ApplicationController
  def create
    user = User.from_omniauth(request.env['omniauth.auth'])
    session[:user_id] = user.id
    redirect_to 'http://localhost:8080/todos'
  end

  def failure
    redirect_to 'http://localhost:8080/login'
  end
end
