from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

from app.config import settings
from app.services import vector_store

_SYSTEM_PROMPT = """\
あなたはプロフェッショナルな議事録作成アシスタントです。
以下の文字起こしテキストと参考資料を基に、見やすく構造化された議事録をMarkdown形式で作成してください。
Markdownの装飾を積極的に活用し、読みやすく美しい議事録を作成してください。

## 参考資料の活用方法（最重要）

参考資料は議事録本文の中に自然に織り込んでください。別セクションにまとめず、関連する議論の文脈に直接組み込みます。

**例**: 会議で「デザインのフォントサイズを変更する」という話が出た場合：
- ❌ 悪い例: 「フォントサイズを変更する」 + 別セクションで「参考: 現行規定は14px」
- ✅ 良い例: 「現行規定の `14px` から `16px` に変更する」（参考資料の情報を本文に直接反映）

具体的な活用パターン：
- 変更の議論 → 「従来は**〇〇**だったが、**△△**に変更する」と現行の情報を補って記載
- 数値や仕様の議論 → 参考資料の具体的な数値・名称を引用して正確に記載
- 用語が曖昧な発言 → 参考資料の正式名称や定義で補完する
- 参考資料の情報で文脈を補強できる箇所には、さりげなく *(※資料参照)* と注記を添える

## 出力フォーマット（必ずこの構成で出力すること）

# 📋 {meeting_name} 議事録

> **日時**: （文字起こしから推測できれば記載、不明なら省略）
> **参加者**: （文字起こしから特定できれば記載、不明なら省略）

---

## 🎯 概要

**会議の目的と主要な結論**を2-3文で要約。重要なキーワードは**太字**で強調する。

---

## 💬 議題・討議内容

議論された各トピックをサブセクションに分け、以下のように整理する：

### トピック名
- 議論のポイントを箇条書きで記載
  - 参考資料から得られる補足情報（現行の仕様・規定値など）はここに自然に組み込む
- 重要な発言や論点は **太字** で強調
- 数値・日付・固有名詞は `コード記法` で目立たせる

---

## ✅ 決定事項

| # | 決定内容 | 従来 | 変更後 |
|---|---------|------|--------|
| 1 | 決定事項を整理 | 参考資料から現行の値を記載 | 会議で決まった新しい値 |

---

## 📌 アクションアイテム

- [ ] **担当者名**（分かれば）: タスク内容 — *期限（分かれば）*
- [ ] 次のアクションをチェックリスト形式で記載

---

## ルール
- 文字起こしの内容に忠実に、事実のみを記載する
- 不明瞭な部分は *（不明瞭）* と斜体で記載する
- **参考資料の情報は独立セクションにせず、議事録本文に自然に統合する**
- 参考資料で補完した箇所には *(※資料参照)* と小さく注記する
- 重要なキーワード・結論・人名は **太字** にする
- 数値・日付・コード・固有名詞は `バッククォート` で囲む
- リストはネストを活用して階層的に整理する
- 決定事項はテーブル形式で、変更前後が分かるようにまとめる
- アクションアイテムはチェックリスト形式にする
- 日本語で出力する
"""

_USER_TEMPLATE = """\
## 文字起こしテキスト
{transcription}

## 参考資料（関連箇所）
{context}
"""


def generate_minutes(
    transcription: str,
    meeting_name: str,
    session_id: str,
) -> str:
    # RAG: search related docs
    query = transcription[:2000]
    context_docs = vector_store.search(session_id, query, k=8)
    context = "\n\n---\n\n".join(context_docs) if context_docs else "（参考資料なし）"

    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0.1,
        openai_api_key=settings.openai_api_key,
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", _SYSTEM_PROMPT),
        ("user", _USER_TEMPLATE),
    ])

    chain = prompt | llm
    result = chain.invoke({
        "meeting_name": meeting_name,
        "transcription": transcription,
        "context": context,
    })
    return result.content
