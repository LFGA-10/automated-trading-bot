import os
import asyncio
import pandas as pd
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from binance.client import Client
from binance.exceptions import BinanceAPIException
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Dict

load_dotenv()

app = FastAPI(title="Automated Trading Bot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Binance Configuration
API_KEY = os.getenv("BINANCE_API_KEY")
API_SECRET = os.getenv("BINANCE_API_SECRET")

# For demo purposes, we use a mock/testnet if no keys are provided
# or use the client normally if they are.
try:
    client = Client(API_KEY, API_SECRET)
except Exception as e:
    print(f"Error initializing Binance client: {e}")
    client = None

class TradeLog(BaseModel):
    symbol: str
    side: str
    price: float
    quantity: float
    timestamp: str

trade_history: List[Dict] = []
bot_running = False

@app.get("/")
async def root():
    return {"message": "Trading Bot API is running"}

@app.get("/status")
async def get_status():
    return {
        "bot_running": bot_running,
        "connection": "Connected" if client else "Disconnected",
        "api_key_set": bool(API_KEY)
    }

@app.get("/account")
async def get_account_info():
    if not client:
        return {"error": "Client not initialized"}
    try:
        info = client.get_account()
        balances = [b for b in info['balances'] if float(b['free']) > 0 or float(b['locked']) > 0]
        return {"balances": balances}
    except BinanceAPIException as e:
        return {"error": str(e)}

@app.get("/price/{symbol}")
async def get_price(symbol: str):
    if not client:
        return {"error": "Client not initialized"}
    try:
        ticker = client.get_symbol_ticker(symbol=symbol.upper())
        return ticker
    except BinanceAPIException as e:
        return {"error": str(e)}

@app.post("/start")
async def start_bot():
    global bot_running
    bot_running = True
    # In a real app, this would trigger a background task
    return {"message": "Bot started"}

@app.post("/stop")
async def stop_bot():
    global bot_running
    bot_running = False
    return {"message": "Bot stopped"}

@app.websocket("/ws/trades")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Send simulated or real price updates
            if client and bot_running:
                # Mock update for now
                await websocket.send_json({
                    "type": "price_update",
                    "symbol": "BTCUSDT",
                    "price": 65000 + (pd.Timestamp.now().second % 10)
                })
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
