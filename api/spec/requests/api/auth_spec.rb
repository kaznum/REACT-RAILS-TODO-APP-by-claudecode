# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::Auth', type: :request do
  let(:user) { create(:user) }

  describe 'GET /api/auth/check' do
    context 'ログイン済みの場合' do
      before do
        allow_any_instance_of(Api::AuthController).to receive(:current_user).and_return(user)
      end

      it '200ステータスを返す' do
        get '/api/auth/check'
        expect(response).to have_http_status(:success)
      end

      it 'ユーザー情報を返す' do
        get '/api/auth/check'
        json = response.parsed_body
        expect(json['user']['id']).to eq(user.id)
        expect(json['user']['name']).to eq(user.name)
        expect(json['user']['email']).to eq(user.email)
      end
    end

    context '未ログインの場合' do
      it '401ステータスを返す' do
        get '/api/auth/check'
        expect(response).to have_http_status(:unauthorized)
      end

      it 'エラーメッセージを返す' do
        get '/api/auth/check'
        json = response.parsed_body
        expect(json['error']).to eq('Unauthorized')
      end
    end
  end

  describe 'DELETE /api/auth/logout' do
    before do
      allow_any_instance_of(Api::AuthController).to receive(:session).and_return({ user_id: user.id })
    end

    it 'セッションをクリアする' do
      session = {}
      allow_any_instance_of(Api::AuthController).to receive(:session).and_return(session)
      delete '/api/auth/logout'
      expect(session[:user_id]).to be_nil
    end

    it '204ステータスを返す' do
      delete '/api/auth/logout'
      expect(response).to have_http_status(:no_content)
    end
  end
end
