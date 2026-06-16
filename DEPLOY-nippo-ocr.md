# 日報OCRデモ (AI高精度版) のデプロイ手順

`nippo-ocr-ai.html` は Claude(AI)で日報画像を読み取ります。動かすには
バックエンド (`api/ocr.js`) が必要で、Anthropic の API キーを使います。
一番かんたんな **Vercel** での手順です。

## 必要なもの
1. Anthropic の API キー … https://console.anthropic.com → API Keys で発行
2. Vercel アカウント … https://vercel.com (GitHub でログイン可)

## 手順
1. Vercel で **Add New → Project** を開き、このリポジトリ
   `my-first-web-app` を Import する。
2. ブランチは `claude/daily-report-ocr-demo-sl9ks1`(またはマージ後の `main`)。
3. **Environment Variables** に次を追加:
   - Name: `ANTHROPIC_API_KEY`
   - Value: 発行したAPIキー
4. **Deploy** を押す。完了すると `https://<プロジェクト名>.vercel.app` が発行される。
5. スマホのブラウザで次を開く:
   `https://<プロジェクト名>.vercel.app/nippo-ocr-ai.html`

## 動作
- 画像はブラウザ側で長辺1600pxに縮小 → `/api/ocr` 経由でClaudeに送信
- Claude が `claude-opus-4-8` のVisionで読み取り、項目をJSONで返す
- 画像は保存されません(その場で処理して返すだけ)

## コスト目安
- 1枚あたりの入力は画像+プロンプトで概ね数千トークン程度。
  詳細・最新の料金は https://www.anthropic.com/pricing を参照。

## 注意
- `raw.githack.com` などの静的表示では `/api/ocr` が無いため動きません。
  必ず Vercel など、サーバーレス関数が動く場所にデプロイしてください。
- 手軽に試したいだけなら、サーバー不要の `nippo-ocr.html`
  (Tesseract版・精度は低め)もあります。
