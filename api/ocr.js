// 日報OCR API — Claude Vision で画像から項目を構造化抽出する
// Vercel の Node.js サーバーレス関数として動作する。
// 必要な環境変数: ANTHROPIC_API_KEY
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // ANTHROPIC_API_KEY を環境変数から読む

// 抽出する日報の項目スキーマ(構造化出力で必ずこの形を返させる)
const SCHEMA = {
  type: "object",
  properties: {
    date: { type: "string", description: "日付。読み取れなければ空文字" },
    work_hours: { type: "string", description: "作業時間(例: 8:00〜19:00)" },
    prime_contractor: { type: "string", description: "元請け会社名" },
    site_name: { type: "string", description: "現場名" },
    person_in_charge: { type: "string", description: "担当者名" },
    man_days: { type: "string", description: "人工(例: 1人工)" },
    workers: { type: "array", items: { type: "string" }, description: "作業者名の一覧" },
    work_content: { type: "string", description: "作業内容。空欄なら空文字" },
    company: { type: "string", description: "様式提供・提出元の会社名" },
    notes: { type: "string", description: "備考・所感など、その他の記載" },
  },
  required: [
    "date", "work_hours", "prime_contractor", "site_name", "person_in_charge",
    "man_days", "workers", "work_content", "company", "notes",
  ],
  additionalProperties: false,
};

const PROMPT = `この画像は日本の「作業日報」です。記載されている内容を読み取り、指定のJSON形式で項目ごとに抽出してください。
- 手書き・印刷どちらも丁寧に読み取ること。
- 該当する記載が無い項目は空文字（配列なら空配列）にすること。推測で埋めない。
- 数値や日付は画像のとおりに転記すること。`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST のみ対応しています" });
    return;
  }

  try {
    const { image, mediaType } = req.body || {};
    if (!image) {
      res.status(400).json({ error: "image (base64) が必要です" });
      return;
    }

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2048,
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType || "image/jpeg",
                data: image,
              },
            },
            { type: "text", text: PROMPT },
          ],
        },
      ],
    });

    // 構造化出力では最初の text ブロックが有効なJSON
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock) {
      res.status(502).json({ error: "AIからの応答にテキストが含まれていません" });
      return;
    }

    res.status(200).json(JSON.parse(textBlock.text));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "OCR処理に失敗しました" });
  }
}
