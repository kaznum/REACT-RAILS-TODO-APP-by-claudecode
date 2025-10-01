# frozen_string_literal: true

module Api
  class AuthController < ApplicationController
    def check
      if current_user
        render json: {
          authenticated: true,
          user: { id: current_user.id, name: current_user.name, email: current_user.email }
        }
      else
        render json: { authenticated: false }, status: :unauthorized
      end
    end

    def logout
      # JWT is stateless, so logout is handled client-side by removing the token
      render json: { message: 'ログアウトしました' }
    end
  end
end
