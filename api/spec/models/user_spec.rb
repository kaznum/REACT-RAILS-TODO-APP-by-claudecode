# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:todos).dependent(:destroy) }
  end

  describe 'validations' do
    subject { build(:user) }

    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:provider) }
    it { is_expected.to validate_presence_of(:uid) }
    it { is_expected.to validate_uniqueness_of(:email) }
  end

  describe '.from_omniauth' do
    let(:auth) do
      OmniAuth::AuthHash.new({
                               provider: 'google_oauth2',
                               uid: '12345',
                               info: {
                                 email: 'test@example.com',
                                 name: 'Test User'
                               }
                             })
    end

    context '新規ユーザーの場合' do
      it 'ユーザーを作成する' do
        expect do
          described_class.from_omniauth(auth)
        end.to change(described_class, :count).by(1)
      end

      it '正しい属性でユーザーを作成する' do
        user = described_class.from_omniauth(auth)
        expect(user.email).to eq('test@example.com')
        expect(user.name).to eq('Test User')
        expect(user.provider).to eq('google_oauth2')
        expect(user.uid).to eq('12345')
      end
    end

    context '既存ユーザーの場合' do
      let!(:existing_user) { create(:user, provider: 'google_oauth2', uid: '12345') }

      it 'ユーザーを作成しない' do
        expect do
          described_class.from_omniauth(auth)
        end.not_to change(described_class, :count)
      end

      it '既存ユーザーを返す' do
        user = described_class.from_omniauth(auth)
        expect(user.id).to eq(existing_user.id)
      end
    end
  end
end
