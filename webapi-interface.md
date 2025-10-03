# WEB API インターフェース仕様書

## 概要

TODO管理アプリのREST API仕様書です。
すべてのAPIエンドポイントはJSON形式でリクエスト・レスポンスを行います。

## ベースURL

```
http://localhost:3000
```

## 認証

Google OAuth 2.0を使用したセッションベース認証を採用しています。
認証が必要なエンドポイントにアクセスする際は、クッキーを含めたリクエスト（`withCredentials: true`）が必要です。

---

## 認証関連API

### 1. Google OAuth認証 (コールバック)

Google認証後のコールバックエンドポイント。

**エンドポイント**: `GET /auth/google_oauth2/callback`

**レスポンス**: フロントエンドの `/todos` にリダイレクト

---

### 2. 認証状態確認

現在のログイン状態を確認します。

**エンドポイント**: `GET /api/auth/check`

**リクエストヘッダー**:
```
Cookie: セッション情報
```

**レスポンス**:

成功時 (200 OK):
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Test User",
    "provider": "google_oauth2",
    "uid": "google_123456"
  }
}
```

未認証時 (401 Unauthorized):
```json
{
  "authenticated": false
}
```

---

### 3. ログアウト

セッションを削除してログアウトします。

**エンドポイント**: `DELETE /api/auth/logout`

**リクエストヘッダー**:
```
Cookie: セッション情報
```

**レスポンス**:

成功時 (200 OK):
```json
{
  "message": "ログアウトしました"
}
```

---

## TODO関連API

### 1. TODO一覧取得

ログインユーザーのTODO一覧を取得します。

**エンドポイント**: `GET /api/todos`

**リクエストヘッダー**:
```
Cookie: セッション情報
```

**レスポンス**:

成功時 (200 OK):
```json
[
  {
    "id": 1,
    "name": "買い物に行く",
    "due_date": null,
    "completed": false,
    "priority": 2,
    "user_id": 1,
    "created_at": "2025-10-01T12:00:00.000Z",
    "updated_at": "2025-10-01T12:00:00.000Z"
  },
  {
    "id": 2,
    "name": "レポート提出",
    "due_date": "2025-10-15",
    "completed": false,
    "priority": 1,
    "user_id": 1,
    "created_at": "2025-10-01T12:30:00.000Z",
    "updated_at": "2025-10-01T12:30:00.000Z"
  }
]
```

**並び順**:
- 優先度（`priority`）の降順（高→中→低）
- 同じ優先度内では：
  - 期限（`due_date`）が`null`のTODOが最初
  - それ以外は期限の昇順

未認証時 (401 Unauthorized):
```json
{
  "error": "Unauthorized"
}
```

---

### 2. TODO詳細取得

指定したIDのTODOを取得します。

**エンドポイント**: `GET /api/todos/:id`

**パスパラメータ**:
- `id` (integer, required): TODO ID

**リクエストヘッダー**:
```
Cookie: セッション情報
```

**レスポンス**:

成功時 (200 OK):
```json
{
  "id": 1,
  "name": "買い物に行く",
  "due_date": null,
  "completed": false,
  "priority": 1,
  "user_id": 1,
  "created_at": "2025-10-01T12:00:00.000Z",
  "updated_at": "2025-10-01T12:00:00.000Z"
}
```

見つからない場合 (404 Not Found):
```json
{
  "error": "Record not found"
}
```

---

### 3. TODO作成

新しいTODOを作成します。

**エンドポイント**: `POST /api/todos`

**リクエストヘッダー**:
```
Content-Type: application/json
Cookie: セッション情報
```

**リクエストボディ**:
```json
{
  "todo": {
    "name": "新しいTODO",
    "due_date": "2025-12-31",
    "completed": false,
    "priority": 1
  }
}
```

**パラメータ**:
- `name` (string, required): TODO名（最大255文字）
- `due_date` (date, optional): 期限（YYYY-MM-DD形式、nullも可）
- `completed` (boolean, optional): 完了フラグ（デフォルト: false）
- `priority` (integer, optional): 優先度（0=低, 1=中, 2=高、デフォルト: 1）

**レスポンス**:

成功時 (201 Created):
```json
{
  "id": 3,
  "name": "新しいTODO",
  "due_date": "2025-12-31",
  "completed": false,
  "priority": 1,
  "user_id": 1,
  "created_at": "2025-10-01T13:00:00.000Z",
  "updated_at": "2025-10-01T13:00:00.000Z"
}
```

バリデーションエラー時 (422 Unprocessable Entity):
```json
{
  "errors": [
    "Name can't be blank",
    "Name is too long (maximum is 255 characters)"
  ]
}
```

---

### 4. TODO更新

既存のTODOを更新します。

**エンドポイント**: `PUT /api/todos/:id` または `PATCH /api/todos/:id`

**パスパラメータ**:
- `id` (integer, required): TODO ID

**リクエストヘッダー**:
```
Content-Type: application/json
Cookie: セッション情報
```

**リクエストボディ**:
```json
{
  "todo": {
    "name": "更新されたTODO",
    "due_date": "2025-12-31",
    "completed": true,
    "priority": 2
  }
}
```

**パラメータ**:
- `name` (string, optional): TODO名
- `due_date` (date, optional): 期限
- `completed` (boolean, optional): 完了フラグ
- `priority` (integer, optional): 優先度（0=低, 1=中, 2=高）

**レスポンス**:

成功時 (200 OK):
```json
{
  "id": 1,
  "name": "更新されたTODO",
  "due_date": "2025-12-31",
  "completed": true,
  "priority": 2,
  "user_id": 1,
  "created_at": "2025-10-01T12:00:00.000Z",
  "updated_at": "2025-10-01T14:00:00.000Z"
}
```

バリデーションエラー時 (422 Unprocessable Entity):
```json
{
  "errors": [
    "Name can't be blank"
  ]
}
```

見つからない場合 (404 Not Found):
```json
{
  "error": "Record not found"
}
```

---

### 5. TODO削除

指定したIDのTODOを削除します。

**エンドポイント**: `DELETE /api/todos/:id`

**パスパラメータ**:
- `id` (integer, required): TODO ID

**リクエストヘッダー**:
```
Cookie: セッション情報
```

**レスポンス**:

成功時 (204 No Content):
```
(レスポンスボディなし)
```

見つからない場合 (404 Not Found):
```json
{
  "error": "Record not found"
}
```

---

## バリデーションルール

### TODO

- **name**:
  - 必須
  - 最大255文字

- **due_date**:
  - 任意
  - 日付形式（YYYY-MM-DD）
  - nullも許可

- **completed**:
  - boolean型（true/false）
  - デフォルト: false

- **priority**:
  - integer型
  - 0（低）、1（中）、2（高）のいずれか
  - デフォルト: 1（中）

---

## エラーレスポンス

### 401 Unauthorized

認証されていない場合に返されます。

```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found

リソースが見つからない場合に返されます。

```json
{
  "error": "Record not found"
}
```

### 422 Unprocessable Entity

バリデーションエラーが発生した場合に返されます。

```json
{
  "errors": [
    "エラーメッセージ1",
    "エラーメッセージ2"
  ]
}
```

---

## CORS設定

フロントエンド（`http://localhost:8080`）からのクロスオリジンリクエストを許可しています。

**許可されているメソッド**: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD

**認証情報**: クッキーを含むリクエストが可能（`credentials: true`）

---

## 注意事項

1. すべてのAPIエンドポイント（認証関連を除く）は認証が必要です
2. 認証にはセッションクッキーを使用するため、リクエスト時に`withCredentials: true`を指定してください
3. ユーザーは自分のTODOのみアクセス可能です（他ユーザーのTODOにはアクセスできません）
4. TODO一覧は優先度の降順、期限の昇順で返されます（同じ優先度内では期限なしのTODOが最初）
5. 優先度の値: 0=低、1=中、2=高
