# 役員報酬・社会保険シミュレーター｜公開メモ

## これは何
役員報酬から毎月の社会保険料の「概算」を試算する、1ファイル完結の静的HTMLツール。
サーバー処理・ビルド不要、外部送信なし、個人情報の収集なし。ブラウザ内で計算が完結する。

- 料率：2026年度・協会けんぽ千葉支部の例（健保 9.73% / 厚年 18.3% / 子育て支援金 0.23% / 介護 1.62%）
- 標準報酬の下限目安 `FLOOR = 88,000円`
- 画面に「これは概算です」バッジを常時表示

## ファイルの場所
- リポジトリ：`yuki-morimori/my-first-web-app`
- ブランチ：`claude/new-session-l7xoxl`
- パス：`shaho-sim/index.html`（232行・1ファイル完結。CSS/JS/画像の外部依存なし）
- ※ ルートの `index.html`（別物の "Dashboard"）は上書きせず共存

---

## 公開のしかた（どれか1つ）

### ★ スマホ向け：Cloudflare Pages の Git連携（タップだけ・推奨）
1. https://dash.cloudflare.com にログイン
2. Workers & Pages → Create → Pages → **Connect to Git**
3. リポジトリ `my-first-web-app` を選択
4. （任意）Project name を `jisou-shaho-sim` などに → URLがその名前になる
5. Production branch：`claude/new-session-l7xoxl`
6. ビルド設定：
   - Framework preset → **None**
   - Build command → **空**
   - Build output directory（または Root directory）→ **`shaho-sim`** ← 重要
7. Save and Deploy → 1〜2分で `https://<project>.pages.dev/` 発行
8. 以後はpushするだけで自動デプロイ

### PC向けA：ダッシュボードから Direct Upload（GUI）
Workers & Pages → Create → Pages → Upload assets →
プロジェクト名入力 → `index.html` を含むフォルダをアップ → Deploy site

### PC向けB：Wrangler CLI（ブラウザ認証・トークン不要）
```bash
npm install -g wrangler
cd shaho-sim            # index.html がルートにあるフォルダ
wrangler login
wrangler pages deploy . --project-name=jisou-shaho-sim
```

> 注意：このクラウド環境のサンドボックスからは `api.cloudflare.com` への通信が
> ネットワークポリシーで遮断されており、wrangler 等での直接デプロイは不可。
> 上記はすべて「ユーザーの端末/ブラウザ」で実施する手順。

---

## デプロイ後の動作確認チェックリスト
- [ ] ページが表示され、日本語が文字化けしていない
- [ ] 「役員報酬（月額）」の入力欄・スライダーが動く
- [ ] 年齢トグル（40歳未満／40〜64歳）で介護保険の行が出る/消える
- [ ] 報酬額を変えると 健保・子育て支援金・厚年・合計 が即時更新
- [ ] 赤い「これは概算です」バッジが常時表示
- [ ] スマホ幅（375〜420px）でレイアウトが崩れない
- [ ] 報酬 0円や下限未満（例:5万円）で下限頭打ちの注意が出る

問題があれば `shaho-sim/index.html` を直接修正して再デプロイ。

---

## note掲載用 紹介文（〔URL〕を置換してコピペ）

```
■ 役員報酬から社会保険料の目安がわかる無料ツールを作りました

ひとり社長・これから法人を作る人向けに、
「役員報酬を入れるだけで、毎月の社会保険料の概算が出る」
シミュレーターを用意しました。下のリンクから無料で使えます。

▶ 〔URL〕

・役員報酬（月額）を入力／スライダーで調整
・年齢（40歳未満／40〜64歳）を選ぶだけ
・健康保険・子ども子育て支援金・厚生年金・（40歳以上は介護保険）の
　内訳と、本人負担・会社負担・合計が出ます

※ あくまで概算です。料率は2026年度・協会けんぽ千葉支部の例で、
　毎年度改定されます。正確な額は協会けんぽの保険料額表で必ず
　ご確認ください。本ツールは税務・社会保険の助言ではありません。
```

---

## 運用メモ（今後のため）
- **料率の年次更新**：毎年度 `index.html` 内の `const RATE = {...}` と `FLOOR` を更新して再デプロイ。
  画面の「2026年度」表記も合わせて直す。
- **他県対応**：`health`（健保率）を各都道府県の率に差し替えれば流用可。複数県対応は都道府県セレクト追加で。
- **免責は維持**：常時表示の「概算」バッジ・注意書きは消さない。正確性を断定する表現に変えない。

## やらないこと
- ビルドコマンド/フレームワーク設定を足さない（素の静的HTMLのまま）
- localStorage 等のブラウザ保存は追加しない
- ユーザー確認なしに本番ドメインのDNSを変更しない
- 料率を「確定値」と読める表現に書き換えない

## セキュリティ注意
- チャットに貼った Cloudflare APIトークン（`cfut_...`）は要削除：
  https://dash.cloudflare.com/profile/api-tokens
