import React, { useState, useEffect } from 'react';
import {
  Users, Bot, Ticket, Activity,
  Database, ShieldAlert, BarChart3, Settings, Search,
  MessageSquare, Bell, Headset, Globe, Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('live-monitoring');

  const tabs = [
    { id: 'live-monitoring', label: 'Live Agent Monitor', icon: Activity },
    { id: 'ticketing', label: 'CRM & Tickets', icon: Ticket },
    { id: 'knowledgebase', label: 'Generative KB', icon: Database },
    { id: 'marketplace-admin', label: 'B2B/B2C Tiers', icon: Briefcase },
    { id: 'developers', label: 'Developer Portals', icon: Globe },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-[#050510] text-gray-200 overflow-hidden font-sans pt-16">
      {/* Sidebar */}
      <div className="w-64 bg-black/40 border-r border-white/10 p-4 flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-8 px-2 mt-4 text-cyan-400">
          <ShieldAlert className="w-6 h-6" />
          <h2 className="font-bold uppercase tracking-widest text-sm">SingReality Admin</h2>
        </div>
        
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-wider ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-white/10 bg-black/20 flex items-center justify-between px-8">
          <h1 className="text-lg font-bold text-white tracking-widest uppercase">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              SYSTEM ONLINE
            </div>
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full" />
            </button>
          </div>
        </div>

        {/* Dashboard Views */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'live-monitoring' && <LiveMonitoringView key="live" />}
            {activeTab === 'ticketing' && <TicketSystemView key="ticket" />}
            {activeTab === 'knowledgebase' && <KnowledgebaseView key="kb" />}
            {activeTab === 'marketplace-admin' && <MarketplaceTiersView key="tiers" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function LiveMonitoringView() {
  return (
    <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <MetricCard label="Active Users" value="12,450" icon={Users} color="text-cyan-400" />
        <MetricCard label="Live Agents" value="84" icon={Headset} color="text-purple-400" />
        <MetricCard label="AI Interventions" value="1,204" icon={Bot} color="text-pink-400" />
        <MetricCard label="Avg Response" value="1.2s" icon={Activity} color="text-green-400" />
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass-card p-6 rounded-2xl border border-white/10">
          <h3 className="text-white font-bold tracking-widest uppercase text-xs mb-4">Real-Time Engagement Map</h3>
          <div className="aspect-video bg-black/40 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
             {/* Mock Map / Pulse visualization */}
             <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] opacity-20 bg-cover bg-center" />
             <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-ping glow-text" />
             <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-pink-400 rounded-full animate-ping glow-text" />
             <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping glow-text" />
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <h3 className="text-white font-bold tracking-widest uppercase text-xs mb-4">Active Engagements (Push)</h3>
          <div className="space-y-3">
             {[1,2,3,4].map(i => (
               <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-3">
                 <img src={`https://i.pravatar.cc/100?img=${i}`} className="w-8 h-8 rounded-full" alt="avatar"/>
                 <div>
                   <div className="text-xs text-white">Rule: Cart Abandonment ({i}m ago)</div>
                   <div className="text-[10px] text-gray-400">Push Notification Sent via Agent Avatar</div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TicketSystemView() {
  return (
    <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} className="glass-card p-6 rounded-2xl border border-white/10 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold tracking-widest uppercase text-sm">CRM Ticket Tracking</h3>
        <div className="flex bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 items-center">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input type="text" placeholder="Search interactions..." className="bg-transparent text-xs text-white border-none outline-none w-48" />
        </div>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/10">
            <th className="pb-3 pl-4">Ticket ID</th>
            <th className="pb-3">User</th>
            <th className="pb-3">Category</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Agent</th>
            <th className="pb-3">Resolution Time</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id: '#TK-829', user: 'University of Sydney', cat: 'Enterprise Setup', status: 'Open', agent: 'AI Agent (L1)', time: '-' },
            { id: '#TK-828', user: 'DJ NeonDrop', cat: 'Royalties', status: 'Resolved', agent: 'Sarah Connor', time: '4m 12s' },
            { id: '#TK-827', user: 'Goverment Council API', cat: 'Integration', status: 'Pending', agent: 'Tech Team', time: '12h 4m' }
          ].map((tk, idx) => (
            <tr key={idx} className="border-b border-white/5 text-xs text-gray-300 hover:bg-white/5 transition-colors">
              <td className="py-4 pl-4 font-mono text-cyan-400">{tk.id}</td>
              <td className="py-4">{tk.user}</td>
              <td className="py-4"><span className="bg-white/10 px-2 py-1 rounded text-[10px] uppercase">{tk.cat}</span></td>
              <td className="py-4">
                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                  tk.status === 'Resolved' ? 'bg-green-500/20 text-green-400' :
                  tk.status === 'Open' ? 'bg-pink-500/20 text-pink-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>{tk.status}</span>
              </td>
              <td className="py-4">{tk.agent}</td>
              <td className="py-4">{tk.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

function KnowledgebaseView() {
  return (
    <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} className="glass-card p-6 rounded-2xl border border-white/10 h-full flex flex-col items-center justify-center text-center">
       <Database className="w-16 h-16 text-purple-400 mb-6 animate-pulse" />
       <h3 className="text-xl text-white font-bold tracking-widest uppercase mb-2">Generative UGC Knowledgebase</h3>
       <p className="text-xs text-gray-400 max-w-lg leading-relaxed mb-8">
         Core database learning in real-time from all marketplace interactions, tickets, and user-generated content to feed the Frontier Model AI network.
       </p>
       <div className="flex gap-4">
         <button className="px-6 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-300 text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-purple-500/40 transition-colors">
           Force Retrain Models
         </button>
         <button className="px-6 py-2 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-white/10 transition-colors">
           View Raw Data Lake
         </button>
       </div>
    </motion.div>
  );
}

function MarketplaceTiersView() {
  return (
    <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} className="space-y-6">
      <h3 className="text-white font-bold tracking-widest uppercase text-sm">Monetization & Tier Architecture</h3>
      <div className="grid grid-cols-3 gap-6">
        {[
          { title: 'Sole Trader / Individual', price: 'Free / 5% Fee', users: '1.2M' },
          { title: 'Partnerships / Studios', price: '$49/mo', users: '45k' },
          { title: 'Enterprise / Gov / Uni', price: 'Custom SLA', users: '840' }
        ].map((tier, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
            <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-2">{tier.title}</h4>
            <div className="text-2xl font-bold text-white mb-4">{tier.price}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest">Active Accounts: <span className="text-white">{tier.users}</span></div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-center relative overflow-hidden group hover:border-white/20 transition-colors">
      <Icon className={`w-8 h-8 ${color} opacity-20 absolute right-4 top-4 group-hover:opacity-40 transition-opacity`} />
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-[10px] text-gray-400 uppercase tracking-widest">{label}</div>
    </div>
  );
}

const AnimatePresence = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>;
};
