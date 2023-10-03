from typing import Literal

from humps import camelize
from pydantic import BaseModel, Field


class BaseSchema(BaseModel):
    class Config:
        alias_generator = camelize
        populate_by_name = True


class Content(BaseSchema):
    content_type: Literal["text"] = Field(..., description="目前只有文字")
    body: str


class MessageInput(BaseSchema):
    role: str
    content: Content
    model: Literal["titan", "claude"]


class MessageOutput(BaseSchema):
    id: str
    role: str
    content: Content
    model: Literal["titan", "claude"]


class ChatInput(BaseSchema):
    conversation_id: str = Field("", description="對話ID")
    message: MessageInput = Field(..., description="留言內容")


class ChatInputWithToken(ChatInput):
    token: str


class ChatOutput(BaseSchema):
    conversation_id: str | None = Field(...)
    message: MessageOutput = Field(..., description="留言內容")
    create_time: float = Field(..., description="產生時間")


class ConversationMeta(BaseSchema):
    id: str
    title: str
    create_time: float


class Conversation(BaseSchema):
    id: str
    title: str
    create_time: float
    messages: list[MessageOutput] = Field(..., description="留言內容")


class NewTitleInput(BaseSchema):
    new_title: str


class ProposedTitle(BaseSchema):
    title: str


class User(BaseSchema):
    id: str
    name: str
