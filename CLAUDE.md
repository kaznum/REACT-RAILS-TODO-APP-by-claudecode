# CLAUDE.md

CLAUDE CODEとのやり取りは基本的に日本語を使用します。

## Project Overview

Railsのアプリケーションプロジェクトで、TODOの追加、編集、削除、閲覧をするアプリです。

## Development Commands

コンテナの起動:
- `docker compose up -d` - コンテナをバックグラウンドで起動
- `docker compose down` - コンテナを停止

コンテナ内でコマンドを実行:
- `docker compose exec api bundle install` - 依存関係のインストール
- `docker compose exec api ./bin/rails server -b 0.0.0.0` - 開発サーバーの起動
- `docker compose exec api ./bin/rails console` - Rails consoleの起動
- `docker compose exec api ./bin/rubocop` - Rubocopによるコード検証
- `docker compose exec api ./bin/rails db:migrate` - マイグレーションの実行
- `docker compose exec api ./bin/rails db:reset` - データベースのリセット
- `docker compose exec -e RAILS_ENV=test api ./bin/rails spec` - RSpecテストの実行
- `docker compose exec front npm run server` - フロントエンド開発用サーバーの起動`
- `docker compose exec front npm run build` - フロントエンドのbuild`
- `docker compose exec front npm run server:dist` - フロントエンドのbuild済みコード用WEBサーバー`
- `docker-compose exec front npm run test` - フロントエンドのテスト実行

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

- ログイン・ユーザー管理: Google OAuth 2.0による認証
  - 未認証ユーザーは専用ログインページ(`/login`)にリダイレクト
  - 認証後はTODOリスト画面にリダイレクト
  - ログアウトはTODOリスト画面から可能
- トップページ(`/`)はログインページ
- 認証後のメイン画面はTODOリスト(`/todos`)
- ログインページ、TODO一覧、TODOの新規登録、TODOの編集の画面構成とする。
  - 既存のTODOの追加、削除、変更が可能
  - 一覧画面で完了・未完了を切り替え可能
  - 一覧画面で削除が可能（削除前に確認ダイアログを表示する)
- TODOの項目
  - TODO名, 期限(年月日)、完了フラグ
- バリデーション
  - TODO名: 必須入力、最大255文字
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

## コーディング規約

- rubocopでエラーにならないようにする。

## 自動テスト

WEBAPI, フロントエンドの双方において、ソースコード作成、変更後には、テストコード作成、テストコード実行を行い、テストが通ることを確認する。

