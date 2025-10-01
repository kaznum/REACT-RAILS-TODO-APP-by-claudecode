require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'associations' do
    it { should have_many(:todos).dependent(:destroy) }
  end

  describe 'validations' do
    subject { build(:user) }

    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:provider) }
    it { should validate_presence_of(:uid) }
    it { should validate_uniqueness_of(:email) }
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
        expect {
          User.from_omniauth(auth)
        }.to change(User, :count).by(1)
      end

      it '正しい属性でユーザーを作成する' do
        user = User.from_omniauth(auth)
        expect(user.email).to eq('test@example.com')
        expect(user.name).to eq('Test User')
        expect(user.provider).to eq('google_oauth2')
        expect(user.uid).to eq('12345')
      end
    end

    context '既存ユーザーの場合' do
      let!(:existing_user) { create(:user, provider: 'google_oauth2', uid: '12345') }

      it 'ユーザーを作成しない' do
        expect {
          User.from_omniauth(auth)
        }.not_to change(User, :count)
      end

      it '既存ユーザーを返す' do
        user = User.from_omniauth(auth)
        expect(user.id).to eq(existing_user.id)
      end
    end
  end
end
