# frozen_string_literal: true

class CreateTodos < ActiveRecord::Migration[7.1]
  def change
    create_table :todos do |t|
      t.string :name, null: false
      t.date :due_date
      t.boolean :completed, default: false, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
