import pandas as pd
import numpy as np

class Strategy:
    def __init__(self, symbol="BTCUSDT", short_window=10, long_window=30):
        self.symbol = symbol
        self.short_window = short_window
        self.long_window = long_window

    def calculate_signals(self, df):
        """
        Simple EMA Crossover Strategy
        """
        df['short_ema'] = df['close'].ewm(span=self.short_window, adjust=False).mean()
        df['long_ema'] = df['close'].ewm(span=self.long_window, adjust=False).mean()
        
        df['signal'] = 0
        df.loc[df.index[self.short_window:], 'signal'] = np.where(
            df['short_ema'][self.short_window:] > df['long_ema'][self.short_window:], 1, 0
        )
        
        df['position'] = df['signal'].diff()
        return df

    def check_trade(self, df):
        last_row = df.iloc[-1]
        if last_row['position'] == 1:
            return "BUY"
        elif last_row['position'] == -1:
            return "SELL"
        return "HOLD"
