FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    sequence(:name) { |n| "Test User #{n}" }
    provider { 'google_oauth2' }
    sequence(:uid) { |n| "google_#{n}" }
  end
end
