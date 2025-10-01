# frozen_string_literal: true

class ApplicationController < ActionController::API
  before_action :authorize_request

  attr_reader :current_user

  private

  def authorize_request
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    decoded = JsonWebToken.decode(token) if token
    @current_user = User.find(decoded[:user_id]) if decoded
  rescue ActiveRecord::RecordNotFound
    @current_user = nil
  end

  def authenticate_user!
    render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user
  end
end
