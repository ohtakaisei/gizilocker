from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

from app.config import settings
from app.services import vector_store

_SYSTEM_PROMPT = """\
あなたは議事録作成アシスタントです。
以下の文字起こしテキストと参考資料を基に、構造化された議事録をMarkdown形式で作成してください。

## 出力フォーマット

# {meeting_name} 議事録

## 概要
（会議の目的と主要な結論を2-3文で要約）

## 議題・討議内容
（議論された各トピックを箇条書きで整理）

## 決定事項
（会議で決定されたことを箇条書き）

## アクションアイテム
（次のステップ、担当者が分かれば記載）

## 参考資料からの補足
（RAGで取得した関連情報があれば補足）

---

## ルール
- 文字起こしの内容に忠実に、事実のみを記載する
- 不明瞭な部分は「（不明瞭）」と記載する
- 参考資料の情報は「参考資料からの補足」セクションにまとめる
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
