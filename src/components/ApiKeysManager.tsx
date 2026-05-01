import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}

export function ApiKeysManager() {
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production Key',
      key: 'sr_live_quantum_x8f92maPq1',
      createdAt: '2025-10-14',
      lastUsed: 'Just now'
    },
    {
      id: '2',
      name: 'Development Sandbox',
      key: 'sr_test_quantum_t9z40nkLp3',
      createdAt: '2026-02-01',
      lastUsed: '2 days ago'
    }
  ]);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const handleCopy = (id: string, keyString: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = () => {
    if (!newKeyName.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const newKey: ApiKey = {
        id: Math.random().toString(36).substr(2, 9),
        name: newKeyName,
        key: `sr_live_quantum_${Math.random().toString(36).substr(2, 10)}`,
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: 'Never'
      };
      setKeys([newKey, ...keys]);
      setNewKeyName('');
      setIsGenerating(false);
    }, 800);
  };

  const handleDelete = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  return (
    <div className="glass rounded-[3rem] p-10 border border-white/5 mt-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Key className="w-6 h-6 text-quantum" /> API Keys Management
        </h2>
        <div className="text-sm text-gray-400">
          {keys.length} / 5 Keys Active
        </div>
      </div>

      {/* Generate New Key */}
      <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2">
            New API Key Name
          </label>
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="e.g. My Awesome Game Engine"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-quantum text-sm font-mono text-gray-300 transition-colors"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={!newKeyName.trim() || isGenerating || keys.length >= 5}
          className="w-full md:w-auto px-8 py-3 bg-quantum text-black font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
             <span className="animate-pulse">Generating...</span>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Generate
            </>
          )}
        </button>
      </div>

      {/* Keys List */}
      <div className="space-y-4">
        <AnimatePresence>
          {keys.map((apiKey) => (
            <motion.div
              key={apiKey.id}
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white">{apiKey.name}</h3>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-reality bg-reality/10 px-3 py-1.5 rounded-lg border border-reality/20 tracking-wider">
                    {showKeyId === apiKey.id ? apiKey.key : 'sr_' + apiKey.key.split('_')[1] + '_quantum_' + '•'.repeat(10)}
                  </span>
                  <button
                    onClick={() => setShowKeyId(showKeyId === apiKey.id ? null : apiKey.id)}
                    className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-lg"
                    title={showKeyId === apiKey.id ? "Hide API Key" : "Reveal API Key"}
                  >
                    {showKeyId === apiKey.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleCopy(apiKey.id, apiKey.key)}
                    className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-lg flex items-center gap-2"
                    title="Copy to clipboard"
                  >
                    {copiedId === apiKey.id ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                <div className="flex-1 md:flex-none">
                  <div className="text-[10px] text-gray-500 font-mono mb-1 uppercase tracking-widest">Created</div>
                  <div className="font-mono text-sm">{apiKey.createdAt}</div>
                </div>
                <div className="flex-1 md:flex-none">
                  <div className="text-[10px] text-gray-500 font-mono mb-1 uppercase tracking-widest">Last Used</div>
                  <div className="font-mono text-sm">{apiKey.lastUsed}</div>
                </div>
                <button
                  onClick={() => handleDelete(apiKey.id)}
                  className="p-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors ml-auto"
                  title="Revoke Key"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {keys.length === 0 && (
          <div className="text-center py-12 text-gray-500 font-mono text-sm border border-dashed border-white/10 rounded-2xl">
            No API keys found. Generate one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
