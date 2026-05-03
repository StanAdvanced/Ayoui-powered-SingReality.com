import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Network, Search, GitBranch, Database, ShieldCheck, Zap } from 'lucide-react';
// We would ideally use ForceGraph2D or D3, but for visual simulation without complex deps, we can use a stylized interactive canvas or DOM nodes.

export function MusicGraphExplorer() {
  const [nodes, setNodes] = useState<{id: number, x: number, y: number, type: string, label: string}[]>([]);
  const [edges, setEdges] = useState<{source: number, target: number}[]>([]);

  useEffect(() => {
    // Generate a beautiful simulated graph
    const newNodes = [];
    const newEdges = [];
    const types = ['stem', 'lyric', 'producer', 'license', 'royalty_split'];
    const labels = ['Vocals (Lead)', '808 Bass', 'Lo-Fi Piano', 'Taylor S. Acapella', 'Sync License', 'Smart Contract Split', '@producer_x'];
    
    for (let i = 0; i < 40; i++) {
       newNodes.push({
           id: i,
           x: Math.random() * 800 + 100,
           y: Math.random() * 600 + 100,
           type: types[Math.floor(Math.random() * types.length)],
           label: labels[Math.floor(Math.random() * labels.length)]
       });
    }

    for (let i = 0; i < 60; i++) {
        newEdges.push({
            source: Math.floor(Math.random() * 40),
            target: Math.floor(Math.random() * 40)
        });
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, []);

  const getTypeColor = (type: string) => {
      switch(type) {
          case 'stem': return '#00D4FF';
          case 'lyric': return '#FFB800';
          case 'producer': return '#6C3CE1';
          case 'license': return '#10B981';
          case 'royalty_split': return '#F43F5E';
          default: return '#ffffff';
      }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pt-24 px-6 relative overflow-hidden font-inter">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex gap-8 relative z-10 h-[calc(100vh-120px)]">
        
        {/* Sidebar Info */}
        <div className="w-80 glass p-6 rounded-2xl border border-white/10 flex flex-col gap-6 h-full overflow-y-auto">
            <div>
                <h1 className="text-3xl font-heading font-bold mb-2 flex items-center gap-2">
                    <Network className="text-singularity" />
                    MusicGraph
                </h1>
                <p className="text-gray-400 text-sm">A Native CRDT Database for Audio. Every beat, vocal, and contract is a decentralized node synced globally.</p>
            </div>
            
            <div className="space-y-4">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="text" placeholder="Search the graph..." className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-singularity" />
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#00D4FF'}}></div>
                        <span>Audio Stems & Loops</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#6C3CE1'}}></div>
                        <span>Creators & Producers</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#10B981'}}></div>
                        <span>Smart Licenses (SRAF)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#F43F5E'}}></div>
                        <span>Royalty Splits</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                <h3 className="font-heading font-semibold text-gray-300">Live Network Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass p-3 rounded-xl border border-white/5 text-center">
                        <Database className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                        <span className="block text-xl font-mono font-bold">1.2M</span>
                        <span className="text-[10px] text-gray-500 uppercase">Nodes</span>
                    </div>
                    <div className="glass p-3 rounded-xl border border-white/5 text-center">
                        <GitBranch className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                        <span className="block text-xl font-mono font-bold">4.8M</span>
                        <span className="text-[10px] text-gray-500 uppercase">Edges</span>
                    </div>
                    <div className="glass p-3 rounded-xl border border-white/5 text-center">
                        <Zap className="w-5 h-5 mx-auto text-yellow-400 mb-1" />
                        <span className="block text-xl font-mono font-bold">12ms</span>
                        <span className="text-[10px] text-gray-500 uppercase">Latency</span>
                    </div>
                    <div className="glass p-3 rounded-xl border border-white/5 text-center">
                        <ShieldCheck className="w-5 h-5 mx-auto text-green-400 mb-1" />
                        <span className="block text-xl font-mono font-bold">C2PA</span>
                        <span className="text-[10px] text-gray-500 uppercase">Verified</span>
                    </div>
                </div>
            </div>
            
            <button className="w-full mt-auto bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/10 transition-colors">
                Mint New Node
            </button>
        </div>

        {/* Graph Area */}
        <div className="flex-1 glass rounded-2xl border border-white/10 relative overflow-hidden bg-black/40">
            {/* Extremely simple pseudo-graph visualization */}
            <svg width="100%" height="100%" className="absolute inset-0">
                {edges.map((edge, i) => {
                    const source = nodes[edge.source];
                    const target = nodes[edge.target];
                    if(!source || !target) return null;
                    return (
                        <line 
                            key={i} 
                            x1={source.x} y1={source.y} 
                            x2={target.x} y2={target.y} 
                            stroke="rgba(255,255,255,0.1)" 
                            strokeWidth="1"
                        />
                    )
                })}
            </svg>
            
            {nodes.map(node => (
                <motion.div 
                    key={node.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: Math.random() * 0.5 }}
                    style={{
                        position: 'absolute',
                        left: node.x,
                        top: node.y,
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: getTypeColor(node.type),
                        boxShadow: `0 0 20px ${getTypeColor(node.type)}`
                    }}
                    className="w-4 h-4 rounded-full cursor-pointer hover:scale-150 transition-transform group"
                >
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/20 pointer-events-none">
                        {node.label}
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
