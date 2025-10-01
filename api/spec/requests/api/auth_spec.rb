# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::Auth', type: :request do
  let(:user) { create(:user) }

  describe 'GET /api/auth/check' do
    context 'ログイン済みの場合' do
      it '200ステータスを返す' do
        get '/api/auth/check', headers: auth_headers(user)
        expect(response).to have_http_status(:success)
      end

      it 'ユーザー情報とauthenticated: trueを返す' do
        get '/api/auth/check', headers: auth_headers(user)
        json = response.parsed_body
        expect(json['authenticated']).to be(true)
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

      it 'authenticated: falseを返す' do
        get '/api/auth/check'
        json = response.parsed_body
        expect(json['authenticated']).to be(false)
      end
    end
  end

  describe 'DELETE /api/auth/logout' do
    it '成功メッセージを返す' do
      delete '/api/auth/logout'
      json = response.parsed_body
      expect(json['message']).to eq('ログアウトしました')
    end

    it '200ステータスを返す' do
      delete '/api/auth/logout'
      expect(response).to have_http_status(:success)
    end
  end
end
