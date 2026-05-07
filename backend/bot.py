import time
import pandas as pd
from binance.client import Client
from strategy import Strategy

class TradingBot:
    def __init__(self, api_key, api_secret, symbol="BTCUSDT"):
        self.client = Client(api_key, api_secret)
        self.symbol = symbol
        self.strategy = Strategy(symbol=symbol)
        self.is_running = False

    def get_historical_data(self):
        klines = self.client.get_historical_klines(self.symbol, Client.KLINE_INTERVAL_1MINUTE, "1 day ago UTC")
        df = pd.DataFrame(klines, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume', 'close_time', 'quote_asset_volume', 'number_of_trades', 'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'ignore'])
        df['close'] = df['close'].astype(float)
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        return df

    def execute_trade(self, side):
        print(f"Executing {side} order for {self.symbol}")
        # In a real bot, we would call:
        # self.client.create_order(symbol=self.symbol, side=side, type='MARKET', quantity=...)
        pass

    def run(self):
        self.is_running = True
        print(f"Bot started for {self.symbol}")
        while self.is_running:
            try:
                df = self.get_historical_data()
                df = self.strategy.calculate_signals(df)
                action = self.strategy.check_trade(df)
                
                if action != "HOLD":
                    self.execute_trade(action)
                
                time.sleep(60) # Wait for next candle
            except Exception as e:
                print(f"Error in bot loop: {e}")
                time.sleep(10)

    def stop(self):
        self.is_running = False
        print("Bot stopped")
