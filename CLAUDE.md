# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリでコードを扱う際のガイダンスを提供します。

## プロジェクト概要

Idea Sparkは、RAG（Retrieval-Augmented Generation）を活用した新規事業開発支援Webアプリケーション（SaaS）です。大企業の新規事業開発担当者が、アイデアをリーンキャンバス手法を用いて包括的な事業計画に効率的に変換することを支援します。

## アーキテクチャ概要

### バックエンド (FastAPI + Python)
- **エントリーポイント**: `backend/app.py` - 全APIエンドポイントを含むメインFastAPIアプリケーション
- **データベース層**: ベクトル類似検索用のpgvector拡張を持つPostgreSQL
- **アーキテクチャパターン**: 責務の明確な分離を持つサービス指向アーキテクチャ:
  - `models/` - リクエスト/レスポンス検証と型安全性のためのPydanticモデル
  - `crud/` - データベース操作（作成、読取、更新、削除）
  - `services/` - ビジネスロジック層（認証、RAG、キャンバス生成、ファイル処理）
  - `database.py` - 非同期サポート付きPostgreSQL接続管理

### コアサービス
- **RAGService**: ドキュメント処理、ベクトル埋め込み（OpenAI text-embedding-3-large）、LLMベースのキャンバス生成を処理
- **CanvasService**: 11フィールド（課題、顧客セグメント、価値提案など）を持つリーンキャンバス操作を管理
- **FileService**: テキスト抽出付きの複数ファイル形式（PDF、DOCX、XLSX、CSV、画像）を処理
- **AuthService**: PostgreSQLストレージを使用したセッションベース認証

### データベーススキーマ
アプリケーションはバージョン管理されたリーンキャンバスシステムを中心とします：
- **projects** → **edit_history** → **details** (キャンバスフィールド)
- **documents** → **document_chunks** (RAGベクトル検索用)
- **interview_notes** と **research_results** はトレーサビリティのためedit_historyにリンク
- すべての変更は場所での更新ではなく新しいバージョンを作成

### フロントエンド (Next.js 15 + TypeScript)
- 実装予定のApp Router構造
- 現在のページ: ログイン、サインアップ、ダッシュボード（基本UI実装済み）
- shadcn/ui、React Hook Form、データフェッチ用SWR向けに依存関係設定済み

## 開発コマンド

### バックエンド
```bash
cd backend

# 仮想環境のセットアップ
python -m venv venv
venv\Scripts\activate  # Windows

# 依存関係のインストール
pip install -r requirements.txt

# 開発サーバーの実行
python app.py
```

### フロントエンド
```bash
cd frontend

# 依存関係のインストール
npm install

# 開発サーバー
npm run dev

# 型チェック
npm run type-check

# 本番用ビルド
npm run build
```

### データベース
```bash
# データベース作成とpgvector有効化
psql -U postgres
CREATE DATABASE idea_spark;
\c idea_spark
CREATE EXTENSION IF NOT EXISTS vector;

# スキーマ適用
\i database/schema.sql
```

## 環境設定

`backend/.env`に必要な環境変数：
- `OPENAI_API_KEY` - AIキャンバス生成と埋め込みに必須
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - PostgreSQL接続
- `SECRET_KEY` - セッション管理用
- `ALLOWED_ORIGINS` - CORS設定

## 主要なアーキテクチャ決定

### RAG実装
- 効率的な類似検索のためpgvector HNSW索引を使用
- テキストチャンク化: 1000トークン、150トークンオーバーラップ
- 埋め込みモデル: text-embedding-3-large（3072次元）
- ドキュメント処理パイプライン用LangChain統合

### リーンキャンバス構造
`details`テーブルに個別列として格納される11の標準化されたフィールド：
- problem, customer_segments, unique_value_proposition, solution, channels
- revenue_streams, cost_structure, key_metrics, unfair_advantage
- early_adopters, existing_alternatives

### バージョン管理
- すべてのキャンバス編集は増分バージョンで新しい`edit_history`エントリを作成
- ロールバック機能は古いバージョンデータを新しいバージョンにコピー
- 更新カテゴリ: manual, consistency_check, research, interview, rollback

### 認証フロー
- PostgreSQLストレージを使用したセッションベース認証（JWTではない）
- セッション管理用HttpOnlyクッキー
- 5回のログイン失敗後にアカウントロック（15分間ロック）

## API構造

すべてのエンドポイントはプロジェクト中心のルートでRESTfulパターンに従います：
- 認証: `/api/auth/*`
- キャンバス操作: `/api/projects/{id}/*`
- ファイル管理: `/api/projects/{id}/documents/*`
- リサーチ/インタビュー: `/api/projects/{id}/research`, `/api/projects/{id}/interview-*`

## テストとヘルスチェック

- ヘルスチェックエンドポイント: `GET /health/detailed` - データベースとpgvectorステータスを含む
- API仕様書: `http://localhost:8000/docs` (FastAPI自動生成)
- データベース接続テストはアプリケーション起動時に組み込み

## 現在の開発状況

**完了**: 計画されたすべての機能を持つフルバックエンドAPI実装
**進行中**: フロントエンドUI実装 - 基本認証ページのみ存在
**次の優先事項**: フロントエンドダッシュボード、キャンバス編集、ドキュメント管理インターフェースの完成

バックエンドはMVPデプロイメント対応済み。フロントエンドは包括的なバックエンドAPI機能に合わせるために大幅な開発が必要です。