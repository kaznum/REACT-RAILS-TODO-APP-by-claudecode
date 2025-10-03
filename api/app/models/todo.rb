# frozen_string_literal: true

class Todo < ApplicationRecord
  belongs_to :user

  # 優先度の定義: 0=低, 1=中, 2=高
  PRIORITY_LOW = 0
  PRIORITY_MEDIUM = 1
  PRIORITY_HIGH = 2

  validates :name, presence: true, length: { maximum: 255 }
  validates :completed, inclusion: { in: [true, false] }
  validates :priority, inclusion: { in: [PRIORITY_LOW, PRIORITY_MEDIUM, PRIORITY_HIGH] }

  scope :completed, -> { where(completed: true) }
  scope :incomplete, -> { where(completed: false) }
end
