# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Todo, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(255) }
    it { is_expected.to validate_inclusion_of(:completed).in_array([true, false]) }
  end

  describe 'scopes' do
    let(:user) { create(:user) }
    let!(:completed_todo) { create(:todo, :completed, user: user) }
    let!(:incomplete_todo) { create(:todo, user: user) }

    describe '.completed' do
      it '完了したTODOのみを返す' do
        expect(described_class.completed).to include(completed_todo)
        expect(described_class.completed).not_to include(incomplete_todo)
      end
    end

    describe '.incomplete' do
      it '未完了のTODOのみを返す' do
        expect(described_class.incomplete).to include(incomplete_todo)
        expect(described_class.incomplete).not_to include(completed_todo)
      end
    end
  end

  describe 'default values' do
    it 'completedのデフォルト値はfalse' do
      todo = described_class.new(name: 'Test', user: create(:user))
      expect(todo.completed).to be(false)
    end
  end
end
