# Idea Spark

新規事業開発支援WebアプリケーションのMVP

## 概要

Idea SparkはRAGを活用した新規事業開発支援のWebアプリケーション（SaaS）です。大企業の新規事業開発担当者が、着想したアイデアを事業企画に落とし込む際の障壁を取り払い、迅速に、抜けもれなく、高い精度で実行できるよう支援します。

## 主な機能

### ✅ 実装済み機能

- **認証システム**: ユーザー登録・ログイン・セッション管理
- **リーンキャンバス管理**: 11フィールドに対応したキャンバス作成・編集・履歴管理
- **AI自動生成**: アイデアからのキャンバス自動生成
- **ドキュメント管理**: PDF, Word, Excel, CSV, 画像ファイルのアップロード・管理
- **RAGパイプライン**: pgvectorを使用したベクトル検索・関連情報検索
- **リサーチ機能**: アップロードした資料を基にしたキャンバス改善提案
- **インタビュー支援**: インタビュー準備・メモ管理・キャンバス反映
- **バージョン管理**: 編集履歴・差分比較・ロールバック機能

### 🏗️ アーキテクチャ

- **フロントエンド**: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- **バックエンド**: FastAPI + Python
- **データベース**: PostgreSQL + pgvector
- **AI/RAG**: OpenAI GPT-4 + LangChain + text-embedding-3-large
- **ファイルストレージ**: ローカルファイルシステム（Azure Blob Storage対応予定）

## セットアップ手順

### 前提条件

- Python 3.9+
- Node.js 18+
- PostgreSQL 15+ (pgvector拡張)
- OpenAI APIキー

### 1. リポジトリのクローン

```bash
cd "C:\\Users\\nonan\\Desktop\\Idea Spark"
```

### 2. バックエンドセットアップ

```bash
cd backend

# 仮想環境作成・有効化
python -m venv venv
venv\\Scripts\\activate  # Windows

# 依存関係インストール
pip install -r requirements.txt
```

### 3. データベースセットアップ

PostgreSQLに接続し、以下を実行：

```sql
-- データベース作成
CREATE DATABASE idea_spark;

-- pgvector拡張有効化
\\c idea_spark
CREATE EXTENSION IF NOT EXISTS vector;

-- スキーマ作成
\\i database/schema.sql
```

### 4. 環境変数設定

`backend/.env`ファイルを編集：

```env
# データベース設定
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=idea_spark

# OpenAI設定
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_EMBEDDING_MODEL=text-embedding-3-large

# アプリケーション設定
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 5. フロントエンドセットアップ

```bash
cd frontend

# 依存関係インストール
npm install
```

### 6. アプリケーション起動

```bash
# バックエンド起動
cd backend
python app.py

# フロントエンド起動（別ターミナル）
cd frontend
npm run dev
```

### 7. アクセス

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000
- API仕様書: http://localhost:8000/docs

## API エンドポイント

### 認証
- `POST /api/signup` - ユーザー登録
- `POST /api/login` - ログイン
- `POST /api/logout` - ログアウト
- `GET /api/auth/me` - 現在のユーザー情報

### プロジェクト・キャンバス
- `GET /api/projects` - プロジェクト一覧
- `POST /api/canvas-autogenerate` - AI自動生成
- `POST /api/projects` - プロジェクト作成
- `GET /api/projects/{project_id}/latest` - 最新キャンバス取得
- `POST /api/projects/{project_id}/latest` - キャンバス更新
- `DELETE /api/projects/{project_id}` - プロジェクト削除

### ドキュメント
- `GET /api/projects/{project_id}/documents` - ドキュメント一覧
- `POST /api/projects/{project_id}/documents` - ドキュメントアップロード
- `DELETE /api/projects/{project_id}/documents/{document_id}` - ドキュメント削除

### リサーチ・インタビュー
- `POST /api/projects/{project_id}/research` - リサーチ実行
- `POST /api/projects/{project_id}/interview-preparation` - インタビュー準備
- `GET /api/projects/{project_id}/interview-notes` - インタビューメモ一覧
- `POST /api/projects/{project_id}/interview-notes` - インタビューメモ作成
- `POST /api/projects/{project_id}/interview-to-canvas` - インタビューメモ反映

### 履歴・ロールバック
- `GET /api/projects/{project_id}/edit-histories` - 編集履歴
- `POST /api/projects/{project_id}/edit-histories/{edit_id}/rollback` - ロールバック

## ディレクトリ構造

```
Idea Spark/
├── backend/                    # FastAPI バックエンド
│   ├── app.py                 # メインアプリケーション
│   ├── database.py            # PostgreSQL接続設定
│   ├── models/                # Pydanticモデル
│   ├── crud/                  # データベース操作
│   ├── services/              # ビジネスロジック
│   ├── utils/                 # ユーティリティ
│   ├── requirements.txt       # Python依存関係
│   └── .env                   # 環境変数
├── frontend/                  # Next.js フロントエンド
│   ├── src/app/              # App Router ページ
│   ├── src/components/       # 再利用可能コンポーネント
│   ├── src/lib/              # ユーティリティ・設定
│   ├── package.json          # Node.js依存関係
│   └── .env.local            # フロントエンド環境変数
├── database/                 # データベース関連
│   └── schema.sql            # PostgreSQLスキーマ
└── README.md                 # このファイル
```

## 開発状況

### ✅ 完了項目

1. **PostgreSQL + pgvector データベース設計・作成**
2. **認証システム（ユーザー登録・ログイン・セッション管理）**
3. **リーンキャンバス CRUD操作**
4. **AIによるキャンバス自動生成（OpenAI GPT-4）**
5. **ファイルアップロード・管理システム**
6. **RAGパイプライン（LangChain + pgvector）**
7. **リサーチ機能（ベクトル検索ベース）**
8. **インタビュー支援機能**
9. **編集履歴・バージョン管理・ロールバック**
10. **FastAPI エンドポイント実装**
11. **Pydanticモデル・型定義**
12. **エラーハンドリング・セキュリティ対策**

### 🔄 次期実装予定

1. **フロントエンド UI実装**
   - ダッシュボード
   - キャンバス編集画面
   - ドキュメント管理画面
   - インタビュー管理画面

2. **Azure連携**
   - Azure Database for PostgreSQL
   - Azure Blob Storage
   - Azure OpenAI Service

3. **セキュリティ強化**
   - HTTPS対応
   - CORS設定最適化
   - Rate limiting実装

4. **パフォーマンス最適化**
   - キャッシュ機能
   - 非同期処理最適化
   - データベース索引チューニング

## 注意事項

- 現在のバージョンはMVP段階です
- OpenAI APIキーが必要です
- PostgreSQLにpgvector拡張のインストールが必要です
- Azure環境は準備中のため、ローカル環境での動作確認を推奨します

## サポート

- バックエンドAPI仕様: http://localhost:8000/docs
- ヘルスチェック: http://localhost:8000/health/detailed
- ログ確認: バックエンドコンソール出力を参照

## ライセンス

このプロジェクトはプライベートプロジェクトです。