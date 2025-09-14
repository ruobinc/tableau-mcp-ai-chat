from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import uvicorn
from contextlib import asynccontextmanager

from .tableau_mcp import MCPClient

# Global client
mcp_client: MCPClient = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global mcp_client
    
    mcp_client = MCPClient()
    
    # Try to connect to MCP server (optional - may fail if server not available)
    try:
        await mcp_client.connect_to_server()
        print("MCP server connected successfully")
    except Exception as e:
        print(f"Warning: Could not connect to MCP server: {e}")
        print("Will use simple mode without Tableau integration")
    
    yield
    
    # Shutdown
    if mcp_client:
        await mcp_client.cleanup()

app = FastAPI(
    title="Tableau AI Chat API", 
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    timestamp: str

class ChatResponse(BaseModel):
    message: str
    timestamp: str
    success: bool

@app.get("/")
async def root():
    return {"message": "Tableau AI Chat API is running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        # messagesリストをBedrockのフォーマットに変換
        bedrock_messages = [
            {"role": msg.role, "content": msg.content} 
            for msg in request.messages
        ]
        
        # mcp.pyで全ての処理を実行
        response_text = await mcp_client.process_query_with_history(bedrock_messages)
        
        return ChatResponse(
            message=response_text,
            timestamp=request.timestamp,
            success=True
        )
        
    except Exception as e:
        print(f"Error processing chat request: {e}")
        return ChatResponse(
            message="申し訳ありません。現在システムでエラーが発生しています。しばらく後にもう一度お試しください。",
            timestamp=request.timestamp,
            success=False
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)