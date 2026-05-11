import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ZoomIn, ZoomOut, Maximize, Settings2, X } from 'lucide-react';
import { Card } from '../components/ui';

// Mock Data
const MOCK_NODES = Array.from({ length: 45 }).map((_, i) => ({
  id: i,
  label: `Entity ${i}`,
  group: Math.floor(Math.random() * 5),
  radius: Math.random() * 12 + 8,
  x: Math.random() * 1200 - 600,
  y: Math.random() * 800 - 400,
}));

const MOCK_EDGES = Array.from({ length: 60 }).map(() => {
  const source = Math.floor(Math.random() * MOCK_NODES.length);
  let target = Math.floor(Math.random() * MOCK_NODES.length);
  while (target === source) target = Math.floor(Math.random() * MOCK_NODES.length);
  return { source, target };
});

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

const KnowledgeGraph: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleAdjust = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.min(Math.max(0.3, z * scaleAdjust), 4));
  };

  return (
    <div className="kg-container">
      <div className="kg-header">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-gradient">Knowledge Graph</h1>
          <p>Interactive visualization of semantic concepts and relationships.</p>
        </motion.div>
        <motion.div 
          className="kg-controls glass-panel"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button className="control-btn" onClick={() => setZoom(z => z * 1.2)}><ZoomIn size={18} /></button>
          <button className="control-btn" onClick={() => setZoom(z => z * 0.8)}><ZoomOut size={18} /></button>
          <button className="control-btn" onClick={() => { setZoom(1); setPan({x:0, y:0}); }}><Maximize size={18} /></button>
          <div className="divider"></div>
          <button className="control-btn"><Filter size={18} /> <span>Filter</span></button>
          <button className="control-btn"><Settings2 size={18} /></button>
        </motion.div>
      </div>

      <div className="kg-workspace">
        <Card 
          className="kg-canvas-container"
          glass
          ref={containerRef}
          onWheel={handleWheel}
        >
          <div className="kg-grid-bg" />
          <motion.div 
            className="kg-layer"
            drag
            dragConstraints={containerRef}
            dragElastic={0.1}
            dragMomentum={false}
            animate={{ scale: zoom, x: pan.x, y: pan.y }}
            transition={{ type: 'tween', duration: 0.1 }}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <svg width="3000" height="3000" viewBox="-1500 -1500 3000 3000" className="kg-svg">
              {/* Edges */}
              {MOCK_EDGES.map((edge, i) => {
                const s = MOCK_NODES[edge.source];
                const t = MOCK_NODES[edge.target];
                const isSelected = selectedNode === edge.source || selectedNode === edge.target;
                const opacity = selectedNode === null ? 0.2 : isSelected ? 0.6 : 0.05;
                
                return (
                  <motion.line
                    key={`e-${i}`}
                    x1={s.x} y1={s.y}
                    x2={t.x} y2={t.y}
                    stroke={`rgba(255,255,255,${opacity})`}
                    strokeWidth={isSelected ? 2 : 1}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: i * 0.02 }}
                  />
                );
              })}
              
              {/* Nodes */}
              {MOCK_NODES.map((node, i) => {
                const isSelected = selectedNode === node.id;
                const isDimmed = selectedNode !== null && !isSelected && 
                                 !MOCK_EDGES.some(e => (e.source === selectedNode && e.target === node.id) || 
                                                       (e.target === selectedNode && e.source === node.id));
                return (
                  <motion.g 
                    key={`n-${i}`}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id); }}
                    whileHover={{ scale: 1.3, zIndex: 10 }}
                    className="kg-node"
                    animate={{ opacity: isDimmed ? 0.2 : 1 }}
                  >
                    <circle
                      r={node.radius + (isSelected ? 4 : 0)}
                      fill={COLORS[node.group]}
                      stroke={isSelected ? '#fff' : 'rgba(0,0,0,0.5)'}
                      strokeWidth={isSelected ? 3 : 1}
                      style={{ filter: isSelected ? `drop-shadow(0 0 10px ${COLORS[node.group]})` : 'none' }}
                    />
                    {(node.radius > 12 || isSelected) && (
                      <text 
                        y={node.radius + (isSelected ? 20 : 15)} 
                        textAnchor="middle" 
                        fill={isSelected ? '#fff' : 'rgba(255,255,255,0.7)'} 
                        fontSize={isSelected ? "14px" : "12px"}
                        fontWeight={isSelected ? "bold" : "normal"}
                      >
                        {node.label}
                      </text>
                    )}
                  </motion.g>
                )
              })}
            </svg>
          </motion.div>
        </Card>

        {/* Side Panel for details */}
        <AnimatePresence>
          {selectedNode !== null && (
            <motion.div 
              className="kg-sidepanel-wrapper"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <Card glass className="kg-sidepanel">
                <div className="panel-header">
                  <h3>Entity Details</h3>
                  <button className="close-btn" onClick={() => setSelectedNode(null)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="panel-content">
                  <div className="entity-title-wrapper">
                    <div className="entity-color-dot" style={{ background: COLORS[MOCK_NODES[selectedNode].group], boxShadow: `0 0 10px ${COLORS[MOCK_NODES[selectedNode].group]}` }} />
                    <h4>{MOCK_NODES[selectedNode].label}</h4>
                  </div>
                  
                  <div className="entity-meta">
                    <span className="meta-tag">Group {MOCK_NODES[selectedNode].group}</span>
                    <span className="meta-tag">Confidence 98%</span>
                  </div>
                  
                  <div className="node-desc">
                    <p>Simulated knowledge entity extracted from the document corpus during the NLP pipeline process.</p>
                  </div>
                  
                  <div className="related-section">
                    <h5>Connections</h5>
                    <ul className="connection-list">
                      {MOCK_EDGES.filter(e => e.source === selectedNode || e.target === selectedNode).slice(0, 6).map((e, i) => {
                        const relatedId = e.source === selectedNode ? e.target : e.source;
                        return (
                          <li key={i} className="connection-item" onClick={() => setSelectedNode(relatedId)}>
                            <div className="connection-color" style={{background: COLORS[MOCK_NODES[relatedId].group]}}></div>
                            <span>{MOCK_NODES[relatedId].label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
