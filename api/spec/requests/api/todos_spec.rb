# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::Todos', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  describe 'GET /api/todos' do
    context '認証済みユーザーの場合' do
      it 'ログインユーザーのTODOのみを返す' do
        create_list(:todo, 3, user: user)
        create(:todo, user: other_user)

        get '/api/todos', headers: auth_headers(user)
        expect(response).to have_http_status(:success)
        json = response.parsed_body
        expect(json.size).to eq(3)
      end

      it 'TODOを期限の昇順で返す（期限なしは最初）' do
        # 期限なし、期限あり（古い）、期限あり（新しい）のTODOを作成
        create(:todo, user: user, name: '期限なし', due_date: nil)
        create(:todo, user: user, name: '期限早い', due_date: 1.day.from_now)
        create(:todo, user: user, name: '期限遅い', due_date: 3.days.from_now)

        get '/api/todos', headers: auth_headers(user)
        json = response.parsed_body

        # 期限なしが最初、その後期限の昇順
        expect(json.pluck('name')).to eq(%w[期限なし 期限早い 期限遅い])
      end
    end

    context '未認証ユーザーの場合' do
      it '401エラーを返す' do
        get '/api/todos'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /api/todos' do
    context '認証済みユーザーの場合' do
      context '有効なパラメータの場合' do
        let(:valid_params) { { todo: { name: 'New TODO', due_date: '2025-12-31', completed: false } } }

        it 'TODOを作成する' do
          expect do
            post '/api/todos', params: valid_params, headers: auth_headers(user)
          end.to change(user.todos, :count).by(1)
        end

        it '201ステータスを返す' do
          post '/api/todos', params: valid_params, headers: auth_headers(user)
          expect(response).to have_http_status(:created)
        end

        it '作成したTODOを返す' do
          post '/api/todos', params: valid_params, headers: auth_headers(user)
          json = response.parsed_body
          expect(json['name']).to eq('New TODO')
        end
      end

      context '無効なパラメータの場合' do
        let(:invalid_params) { { todo: { name: '', due_date: '2025-12-31' } } }

        it 'TODOを作成しない' do
          expect do
            post '/api/todos', params: invalid_params, headers: auth_headers(user)
          end.not_to change(Todo, :count)
        end

        it '422ステータスを返す' do
          post '/api/todos', params: invalid_params, headers: auth_headers(user)
          expect(response).to have_http_status(:unprocessable_entity)
        end

        it 'エラーメッセージを返す' do
          post '/api/todos', params: invalid_params, headers: auth_headers(user)
          json = response.parsed_body
          expect(json['errors']).to be_present
        end
      end
    end

    context '未認証ユーザーの場合' do
      it '401エラーを返す' do
        post '/api/todos', params: { todo: { name: 'Test' } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PUT /api/todos/:id' do
    let!(:todo) { create(:todo, user: user, name: 'Original Name') }

    context '認証済みユーザーの場合' do
      context '有効なパラメータの場合' do
        it 'TODOを更新する' do
          put "/api/todos/#{todo.id}", params: { todo: { name: 'Updated Name' } }, headers: auth_headers(user)
          todo.reload
          expect(todo.name).to eq('Updated Name')
        end

        it '200ステータスを返す' do
          put "/api/todos/#{todo.id}", params: { todo: { completed: true } }, headers: auth_headers(user)
          expect(response).to have_http_status(:success)
        end
      end

      context '他のユーザーのTODOの場合' do
        let!(:other_todo) { create(:todo, user: other_user) }

        it '404エラーを返す' do
          put "/api/todos/#{other_todo.id}", params: { todo: { name: 'Hacked' } }, headers: auth_headers(user)
          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end

  describe 'DELETE /api/todos/:id' do
    let!(:todo) { create(:todo, user: user) }

    context '認証済みユーザーの場合' do
      it 'TODOを削除する' do
        expect do
          delete "/api/todos/#{todo.id}", headers: auth_headers(user)
        end.to change(user.todos, :count).by(-1)
      end

      it '204ステータスを返す' do
        delete "/api/todos/#{todo.id}", headers: auth_headers(user)
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
