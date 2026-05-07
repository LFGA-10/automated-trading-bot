import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  BarChart3, 
  History, 
  Settings, 
  Play, 
  Square, 
  TrendingUp, 
  Wallet,
  Zap,
  ChevronRight,
  RefreshCcw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DATA = [
  { time: '10:00', price: 64200 },
  { time: '10:05', price: 64350 },
  { time: '10:10', price: 64100 },
  { time: '10:15', price: 64500 },
  { time: '10:20', price: 64800 },
  { time: '10:25', price: 64600 },
  { time: '10:30', price: 65100 },
];

const App = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [balance, setBalance] = useState('12,450.84');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trades, setTrades] = useState([
    { id: 1, symbol: 'BTCUSDT', side: 'BUY', price: '64,230', amount: '0.05', time: '12:45:01', status: 'completed' },
    { id: 2, symbol: 'ETHUSDT', side: 'SELL', price: '3,450', amount: '1.2', time: '12:30:15', status: 'completed' },
    { id: 3, symbol: 'SOLUSDT', side: 'BUY', price: '145.20', amount: '15.0', time: '11:15:22', status: 'completed' },
  ]);

  const toggleBot = () => setIsRunning(!isRunning);

  return (
    <div className="flex h-screen bg-[#0a0b10] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass-card m-4 mr-0 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00f2ff] to-[#7000ff] rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap size={24} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">CryptoBot <span className="text-[#00f2ff]">PRO</span></span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
            { id: 'history', icon: History, label: 'Trade History' },
            { id: 'settings', icon: Settings, label: 'Bot Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-white/10 text-[#00f2ff] border border-white/5 shadow-inner' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="glass-card bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Connection Status</span>
              <div className={`status-indicator ${isRunning ? 'status-online' : 'status-offline'}`} />
            </div>
            <p className="text-sm font-medium">{isRunning ? 'Real-time Sync Active' : 'Disconnected'}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        <header className="flex justify-between items-center mb-6 px-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Trader</h1>
            <p className="text-gray-400 text-sm">Market is currently <span className="text-[#00f5a0]">bullish</span></p>
          </div>
          <div className="flex gap-4">
            <div className="glass-card px-4 py-2 flex items-center gap-3">
              <Wallet className="text-gray-400" size={18} />
              <div>
                <p className="text-[10px] text-gray-400 uppercase leading-none">Total Balance</p>
                <p className="font-bold text-sm">${balance} <span className="text-[#00f5a0] text-[10px] ml-1">+2.4%</span></p>
              </div>
            </div>
            <button 
              onClick={toggleBot}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
                isRunning 
                ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20' 
                : 'bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/50 hover:bg-[#00f2ff]/20'
              }`}
            >
              {isRunning ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              {isRunning ? 'STOP BOT' : 'START BOT'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6 px-4">
          {/* Chart Section */}
          <section className="col-span-8 glass-card p-6 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="font-bold text-lg">BTC/USDT</h2>
                <div className="flex gap-2">
                  {['1M', '5M', '15M', '1H', '1D'].map(tf => (
                    <button key={tf} className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400">{tf}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#00f5a0] font-mono">$65,102.45</span>
                <TrendingUp size={16} className="text-[#00f5a0]" />
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_DATA}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={['auto', 'auto']} stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#171923', border: '1px solid #ffffff10', borderRadius: '8px' }}
                    itemStyle={{ color: '#00f2ff' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#00f2ff" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="col-span-4 space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wider">Bot Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Total Profit</span>
                  <span className="text-lg font-bold text-[#00f5a0]">+$1,240.22</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Success Rate</span>
                  <span className="text-lg font-bold text-[#7000ff]">84.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Active Trades</span>
                  <span className="text-lg font-bold">2</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wider">Market Sentiment</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden flex">
                  <div className="bg-[#00f5a0] w-[65%]" />
                  <div className="bg-red-500 w-[35%]" />
                </div>
                <span className="text-xs font-bold text-[#00f5a0]">65% BUY</span>
              </div>
            </div>
          </section>

          {/* Recent Trades Table */}
          <section className="col-span-12 glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">Recent Trading Activity</h2>
              <button className="text-xs text-[#00f2ff] flex items-center gap-1 hover:underline">
                View all history <ChevronRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-white/5">
                    <th className="pb-4 font-medium">Asset</th>
                    <th className="pb-4 font-medium">Type</th>
                    <th className="pb-4 font-medium">Entry Price</th>
                    <th className="pb-4 font-medium">Amount</th>
                    <th className="pb-4 font-medium">Time</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {trades.map((trade) => (
                    <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 font-bold">{trade.symbol}</td>
                      <td className={`py-4 font-bold ${trade.side === 'BUY' ? 'text-[#00f5a0]' : 'text-red-500'}`}>{trade.side}</td>
                      <td className="py-4 font-mono">${trade.price}</td>
                      <td className="py-4 font-mono">{trade.amount}</td>
                      <td className="py-4 text-gray-400">{trade.time}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 rounded-full bg-[#00f5a0]/10 text-[#00f5a0] text-[10px] font-bold uppercase">
                          {trade.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
