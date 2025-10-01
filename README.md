# TODO管理アプリ

Rails API + React.js で構築されたTODO管理アプリケーションです。Google OAuth 2.0認証とJWTトークンベースの認証を実装しています。

## 機能

- **ユーザー認証**: Google OAuth 2.0によるソーシャルログイン
- **JWT認証**: ステートレスなトークンベース認証（クロスドメイン対応）
- **TODO管理**:
  - TODOの作成、編集、削除
  - 完了/未完了の切り替え
  - 期限の設定と管理
  - 期限順での自動ソート（期限なしは最初に表示）
- **レスポンシブデザイン**: ポップでカラフルなグラデーション背景とカードスタイル

## 技術スタック

### バックエンド
- **フレームワーク**: Ruby on Rails 7.1
- **データベース**: SQLite3
- **認証**:
  - Google OAuth 2.0 (omniauth-google-oauth2)
  - JWT (json web token)
- **テスト**: RSpec
- **コード品質**: RuboCop

### フロントエンド
- **フレームワーク**: React.js + Vite
- **ルーティング**: React Router
- **HTTP クライアント**: Axios
- **スタイル**: SCSS
- **テスト**: Vitest + React Testing Library
- **コード品質**: ESLint

### インフラ
- **コンテナ**: Docker + Docker Compose
- **開発環境**:
  - API: http://localhost:3000
  - フロントエンド: http://localhost:8080

## セットアップ

### 前提条件

- Docker Desktop
- Google Cloud Console アカウント（OAuth設定用）

### 1. リポジトリのクローン

```bash
git clone https://github.com/kaznum/REACT-RAILS-TODO-APP-by-claudecode.git
cd REACT-RAILS-TODO-APP-by-claudecode
```

### 2. Google OAuth 2.0の設定

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. 「APIとサービス」→「認証情報」を選択
3. 「認証情報を作成」→「OAuthクライアントID」を選択
4. アプリケーションの種類: **ウェブアプリケーション**
5. 承認済みのリダイレクトURIを追加:
   ```
   http://localhost:3000/auth/google_oauth2/callback
   ```
6. クライアントIDとクライアントシークレットを取得

### 3. 環境変数の設定

```bash
cp .env.sample .env
```

`.env`ファイルを編集して、Google OAuth認証情報を設定:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### 4. アプリケーションの起動

```bash
# コンテナのビルドと起動
docker compose up -d

# データベースのセットアップ
docker compose exec api ./bin/rails db:create db:migrate

# APIサーバーの起動
docker compose exec api ./bin/rails server -b 0.0.0.0

# フロントエンドサーバーの起動（別ターミナル）
docker compose exec front npm run server
```

### 5. アプリケーションへアクセス

ブラウザで http://localhost:8080 にアクセス

## 開発コマンド

### コンテナ操作

```bash
# コンテナ起動
docker compose up -d

# コンテナ停止
docker compose down

# ログ確認
docker compose logs -f
```

### バックエンド（Rails）

```bash
# 依存関係のインストール
docker compose exec api bundle install

# Rails console
docker compose exec api ./bin/rails console

# マイグレーション実行
docker compose exec api ./bin/rails db:migrate

# データベースリセット
docker compose exec api ./bin/rails db:reset

# テスト実行
docker compose exec -e RAILS_ENV=test api bundle exec rspec

# コード検証（RuboCop）
docker compose exec api bundle exec rubocop

# 自動修正
docker compose exec api bundle exec rubocop -A
```

### フロントエンド（React）

```bash
# 依存関係のインストール
docker compose exec front npm install

# 開発サーバー起動
docker compose exec front npm run server

# ビルド
docker compose exec front npm run build

# ビルド済みコードのプレビュー
docker compose exec front npm run server:dist

# テスト実行
docker compose exec front npm run test

# コード検証（ESLint）
docker compose exec front npm run lint
```

## プロジェクト構成

```
.
├── api/                      # Rails API
│   ├── app/
│   │   ├── controllers/     # コントローラー
│   │   ├── models/          # モデル
│   │   └── lib/             # ライブラリ（JWT等）
│   ├── config/              # 設定ファイル
│   ├── db/                  # データベース
│   └── spec/                # RSpecテスト
│
├── front/                    # React フロントエンド
│   ├── src/
│   │   ├── api/            # APIクライアント
│   │   ├── components/     # Reactコンポーネント
│   │   ├── pages/          # ページコンポーネント
│   │   ├── styles/         # SCSSスタイル
│   │   └── utils/          # ユーティリティ（JWT等）
│   └── dist/               # ビルド成果物
│
├── docker-compose.yml       # Docker Compose設定
├── .env                     # 環境変数（Git管理外）
└── CLAUDE.md               # プロジェクト仕様書
```

## 認証フロー

### JWT認証の仕組み

1. ユーザーが「Googleでログイン」ボタンをクリック
2. Google OAuth 2.0で認証
3. バックエンドがJWTトークンを生成（有効期限: 24時間）
4. フロントエンドがトークンをlocalStorageに保存
5. 以降のAPI呼び出しで`Authorization: Bearer <token>`ヘッダーを自動付与
6. バックエンドがトークンを検証してユーザーを特定

### 主要ファイル

**バックエンド:**
- `api/app/lib/json_web_token.rb` - JWT生成・検証
- `api/app/controllers/application_controller.rb` - JWT認証ミドルウェア
- `api/app/controllers/sessions_controller.rb` - OAuth処理とJWT発行

**フロントエンド:**
- `front/src/utils/auth.js` - トークン管理
- `front/src/api/client.js` - Axiosインターセプター設定

## テスト

### バックエンドテスト

```bash
# 全テスト実行
docker compose exec -e RAILS_ENV=test api bundle exec rspec

# 特定のテストファイルを実行
docker compose exec -e RAILS_ENV=test api bundle exec rspec spec/models/todo_spec.rb
```

### フロントエンドテスト

```bash
# 全テスト実行
docker compose exec front npm run test

# ウォッチモード
docker compose exec front npm run test -- --watch
```

## API仕様

詳細なAPI仕様は [webapi-interface.md](./webapi-interface.md) を参照してください。

### 主要エンドポイント

- `POST /auth/google_oauth2` - Google OAuth認証開始
- `GET /api/auth/check` - 認証状態確認
- `DELETE /api/auth/logout` - ログアウト
- `GET /api/todos` - TODO一覧取得
- `POST /api/todos` - TODO作成
- `PUT /api/todos/:id` - TODO更新
- `DELETE /api/todos/:id` - TODO削除

## トラブルシューティング

### ログインできない

- `.env`ファイルのGoogle OAuth認証情報が正しいか確認
- Google Cloud ConsoleでリダイレクトURIが正しく設定されているか確認
- コンテナを再起動: `docker compose restart`

### データベースエラー

```bash
# データベースをリセット
docker compose exec api ./bin/rails db:drop db:create db:migrate
```

### フロントエンドが起動しない

```bash
# node_modulesを再インストール
docker compose exec front rm -rf node_modules
docker compose exec front npm install
```

## ライセンス

This project is open source and available under the MIT License.

## 開発者向け情報

詳細な開発ガイドラインは [CLAUDE.md](./CLAUDE.md) を参照してください。
