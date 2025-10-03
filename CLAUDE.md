# CLAUDE.md

CLAUDE CODEとのやり取りは基本的に日本語を使用します。

## Project Overview

Railsのアプリケーションプロジェクトで、TODOの追加、編集、削除、閲覧をするアプリです。

## ドキュメント

- [WEB API インターフェース仕様書](./webapi-interface.md) - REST APIの詳細仕様

## Development Commands

コンテナの起動:
- `docker compose up -d` - コンテナをバックグラウンドで起動
- `docker compose down` - コンテナを停止

コンテナ内でコマンドを実行:
- `docker compose exec api bundle install` - 依存関係のインストール
- `docker compose exec api ./bin/rails server -b 0.0.0.0` - 開発サーバーの起動
- `docker compose exec api ./bin/rails console` - Rails consoleの起動
- `docker compose exec api bundle exec rubocop` - Rubocopによるコード検証
- `docker compose exec api bundle exec rubocop -A` - Rubocop自動修正
- `docker compose exec api ./bin/rails db:migrate` - マイグレーションの実行
- `docker compose exec api ./bin/rails db:reset` - データベースのリセット
- `docker compose exec -e RAILS_ENV=test api bundle exec rspec` - RSpecテストの実行
- `docker compose exec front npm run server` - フロントエンド開発用サーバーの起動
- `docker compose exec front npm run build` - フロントエンドのbuild
- `docker compose exec front npm run server:dist` - フロントエンドのbuild済みコード用WEBサーバー
- `docker compose exec front npm run test` - フロントエンドのテスト実行
- `docker compose exec front npm run lint` - ESLintによるコード検証

## Architecture

Docker Composeで動作する。コンテナは以下の２つ。

- api: WEBAPI(Rails)
- front: フロントエンド(SPA)(React.js)

- ソースコード, Dockerfileは以下のそれぞれに配置する。
  - ./api
  - ./front
- docker-compose.ymlは最上位ディレクトリに配置する。
- 環境変数は.envファイルを利用し、docker-compose.ymlで指定して読み込む

### WEBAPI
- フレームワーク: Rails(現在の最新版)
- DB: SQLite
- リクエスト・レスポンスはJSON形式とする。
- 基本的にJSON形式のREST APIのみを提供し、画面表示はフロントエンドに任せる。

### フロントエンド
- React.js(もしくはNext.js)
- テストコード: Rspecで実装
- SPAとする。


## 仕様

- ログイン・ユーザー管理: Google OAuth 2.0による認証 + JWT
  - 認証方式: JWTトークンベース（ステートレス認証）
  - OAuth認証後にJWTトークンを発行し、フロントエンドのlocalStorageに保存
  - API呼び出し時はAuthorizationヘッダーで`Bearer <token>`形式でトークンを送信
  - トークン有効期限: 24時間
  - 未認証ユーザーは専用ログインページ(`/login`)にリダイレクト
  - 認証後はTODOリスト画面にリダイレクト
  - ログアウトはTODOリスト画面から可能（localStorageからトークンを削除）
- トップページ(`/`)はログインページ
- 認証後のメイン画面はTODOリスト(`/todos`)
- ログインページ、TODO一覧、TODOの新規登録、TODOの編集の画面構成とする。
  - 既存のTODOの追加、削除、変更が可能
  - 一覧画面で完了・未完了を切り替え可能
  - 一覧画面で削除が可能（削除前に確認ダイアログを表示する)
- TODOの項目
  - TODO名, 期限(年月日)、完了フラグ、優先度
  - 優先度: 高(2)、中(1)、低(0) ※デフォルトは中(1)
  - TODOは優先度の降順、期限の昇順で表示（優先度が同じ場合、期限なしは最初に表示）
  - 優先度による色分け表示: 高=赤、中=黄、低=緑
- バリデーション
  - TODO名: 必須入力、最大255文字
  - 優先度: 0, 1, 2のいずれか
- 表示、メッセージは日本語表示とする。
- ポップでカラフルなデザイン（グラデーション背景、カードスタイル）

## Google OAuth設定

Google Cloud Consoleで以下の設定が必要です:

1. Google Cloud Console (https://console.cloud.google.com/) でプロジェクトを作成
2. 「APIとサービス」→「認証情報」を選択
3. 「認証情報を作成」→「OAuthクライアントID」を選択
4. アプリケーションの種類: ウェブアプリケーション
5. 承認済みのリダイレクトURIを追加:
   - 開発環境: `http://localhost:3000/auth/google_oauth2/callback`
   - 本番環境: `https://your-domain.com/auth/google_oauth2/callback`
6. クライアントIDとクライアントシークレットを取得

環境変数の設定:

1. `.env.sample`をコピーして`.env`ファイルを作成:
```bash
cp .env.sample .env
```

2. `.env`ファイルを編集して、Google Cloud Consoleで取得した値を設定:
```
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

3. コンテナを再起動:
```bash
docker-compose down
docker-compose up -d
```

注意: `.env`ファイルは`.gitignore`に含まれているため、Gitにコミットされません。

## JWT認証の実装詳細

### バックエンド (Rails)

- **JWT gem**: `jwt` gemを使用
- **トークン生成**: `JsonWebToken`クラス (`api/app/lib/json_web_token.rb`)
  - `encode(payload, exp)`: JWTトークンを生成（デフォルト有効期限24時間）
  - `decode(token)`: JWTトークンを検証・デコード
- **認証フロー**:
  1. ユーザーがGoogle OAuthで認証
  2. `SessionsController`でJWTトークンを生成
  3. フロントエンドに`/login?token=<jwt>`形式でリダイレクト
  4. フロントエンドがトークンをlocalStorageに保存
- **API認証**: `ApplicationController`の`authorize_request`メソッドで全APIリクエストを検証
  - Authorizationヘッダーから`Bearer <token>`を取得
  - トークンをデコードして`@current_user`を設定
- **セッション設定**: OmniAuth用に最小限のセッションを設定（`/auth`パスのみ）

### フロントエンド (React)

- **トークン管理**: `src/utils/auth.js`
  - `setToken(token)`: localStorageにトークンを保存
  - `getToken()`: localStorageからトークンを取得
  - `removeToken()`: localStorageからトークンを削除
  - `isAuthenticated()`: トークンの有効性を確認
- **API クライアント**: `src/api/client.js`
  - Axiosインスタンスでリクエストインターセプターを設定
  - 自動的にAuthorizationヘッダーに`Bearer <token>`を追加
  - 401エラー時は自動的にログインページにリダイレクト
- **認証フロー**:
  1. Loginコンポーネントでトークンをクエリパラメータから取得
  2. localStorageに保存してTODO画面にリダイレクト
  3. 以降のAPI呼び出しは自動的にトークンを含む

## コーディング規約

### バックエンド (Rails)
- Rubocopでエラーにならないようにする
- `.rubocop.yml`に設定されたルールに従う

### フロントエンド (React)
- ESLintでエラーにならないようにする
- `.eslintrc.cjs`に設定されたルールに従う

## 自動テスト

WEBAPI, フロントエンドの双方において、ソースコード作成、変更後には、テストコード作成、テストコード実行を行い、テストが通ることを確認する。

