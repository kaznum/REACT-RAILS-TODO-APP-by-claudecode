require 'rails_helper'

RSpec.describe 'Api::Todos', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  describe 'GET /api/todos' do
    context '認証済みユーザーの場合' do
      before do
        allow_any_instance_of(Api::TodosController).to receive(:current_user).and_return(user)
        create_list(:todo, 3, user: user)
        create(:todo, user: other_user)
      end

      it 'ログインユーザーのTODOのみを返す' do
        get '/api/todos'
        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        expect(json.size).to eq(3)
      end

      it 'TODOを作成日時の降順で返す' do
        get '/api/todos'
        json = JSON.parse(response.body)
        expect(json.first['id']).to be > json.last['id']
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
      before do
        allow_any_instance_of(Api::TodosController).to receive(:current_user).and_return(user)
      end

      context '有効なパラメータの場合' do
        let(:valid_params) { { todo: { name: 'New TODO', due_date: '2025-12-31', completed: false } } }

        it 'TODOを作成する' do
          expect {
            post '/api/todos', params: valid_params
          }.to change(user.todos, :count).by(1)
        end

        it '201ステータスを返す' do
          post '/api/todos', params: valid_params
          expect(response).to have_http_status(:created)
        end

        it '作成したTODOを返す' do
          post '/api/todos', params: valid_params
          json = JSON.parse(response.body)
          expect(json['name']).to eq('New TODO')
        end
      end

      context '無効なパラメータの場合' do
        let(:invalid_params) { { todo: { name: '', due_date: '2025-12-31' } } }

        it 'TODOを作成しない' do
          expect {
            post '/api/todos', params: invalid_params
          }.not_to change(Todo, :count)
        end

        it '422ステータスを返す' do
          post '/api/todos', params: invalid_params
          expect(response).to have_http_status(:unprocessable_entity)
        end

        it 'エラーメッセージを返す' do
          post '/api/todos', params: invalid_params
          json = JSON.parse(response.body)
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
      before do
        allow_any_instance_of(Api::TodosController).to receive(:current_user).and_return(user)
      end

      context '有効なパラメータの場合' do
        it 'TODOを更新する' do
          put "/api/todos/#{todo.id}", params: { todo: { name: 'Updated Name' } }
          todo.reload
          expect(todo.name).to eq('Updated Name')
        end

        it '200ステータスを返す' do
          put "/api/todos/#{todo.id}", params: { todo: { completed: true } }
          expect(response).to have_http_status(:success)
        end
      end

      context '他のユーザーのTODOの場合' do
        let!(:other_todo) { create(:todo, user: other_user) }

        it '404エラーを返す' do
          put "/api/todos/#{other_todo.id}", params: { todo: { name: 'Hacked' } }
          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end

  describe 'DELETE /api/todos/:id' do
    let!(:todo) { create(:todo, user: user) }

    context '認証済みユーザーの場合' do
      before do
        allow_any_instance_of(Api::TodosController).to receive(:current_user).and_return(user)
      end

      it 'TODOを削除する' do
        expect {
          delete "/api/todos/#{todo.id}"
        }.to change(user.todos, :count).by(-1)
      end

      it '204ステータスを返す' do
        delete "/api/todos/#{todo.id}"
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
