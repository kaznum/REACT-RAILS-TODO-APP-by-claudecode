FactoryBot.define do
  factory :todo do
    sequence(:name) { |n| "TODO #{n}" }
    due_date { 1.week.from_now.to_date }
    completed { false }
    association :user

    trait :completed do
      completed { true }
    end

    trait :overdue do
      due_date { 1.week.ago.to_date }
    end
  end
end
