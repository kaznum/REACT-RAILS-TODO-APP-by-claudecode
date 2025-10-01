# frozen_string_literal: true

class User < ApplicationRecord
  has_many :todos, dependent: :destroy

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validates :provider, presence: true
  validates :uid, presence: true

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.name = auth.info.name
    end
  end
end
