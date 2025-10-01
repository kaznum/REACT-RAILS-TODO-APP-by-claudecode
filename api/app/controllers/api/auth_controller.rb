module Api
  class AuthController < ApplicationController
    def check
      if current_user
        render json: { user: { id: current_user.id, name: current_user.name, email: current_user.email } }
      else
        render json: { error: 'Unauthorized' }, status: :unauthorized
      end
    end

    def logout
      session[:user_id] = nil
      head :no_content
    end
  end
end
