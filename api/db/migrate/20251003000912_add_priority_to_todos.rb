# frozen_string_literal: true

class AddPriorityToTodos < ActiveRecord::Migration[7.1]
  def change
    add_column :todos, :priority, :integer, default: 1, null: false
  end
end
