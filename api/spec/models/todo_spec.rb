require 'rails_helper'

RSpec.describe Todo, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_length_of(:name).is_at_most(255) }
    it { should validate_inclusion_of(:completed).in_array([true, false]) }
  end

  describe 'scopes' do
    let(:user) { create(:user) }
    let!(:completed_todo) { create(:todo, :completed, user: user) }
    let!(:incomplete_todo) { create(:todo, user: user) }

    describe '.completed' do
      it '完了したTODOのみを返す' do
        expect(Todo.completed).to include(completed_todo)
        expect(Todo.completed).not_to include(incomplete_todo)
      end
    end

    describe '.incomplete' do
      it '未完了のTODOのみを返す' do
        expect(Todo.incomplete).to include(incomplete_todo)
        expect(Todo.incomplete).not_to include(completed_todo)
      end
    end
  end

  describe 'default values' do
    it 'completedのデフォルト値はfalse' do
      todo = Todo.new(name: 'Test', user: create(:user))
      expect(todo.completed).to eq(false)
    end
  end
end
