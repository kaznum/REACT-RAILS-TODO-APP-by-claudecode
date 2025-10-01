# frozen_string_literal: true

class Todo < ApplicationRecord
  belongs_to :user

  validates :name, presence: true, length: { maximum: 255 }
  validates :completed, inclusion: { in: [true, false] }

  scope :completed, -> { where(completed: true) }
  scope :incomplete, -> { where(completed: false) }
end
