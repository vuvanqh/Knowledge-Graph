import React from 'react';
import { motion } from 'framer-motion';
import { Network, FileText, Activity, BrainCircuit } from 'lucide-react';
import { Card } from '../components/ui';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Documents', value: '1,248', icon: <FileText size={24} />, color: '#3b82f6' },
    { label: 'Graph Nodes', value: '8,439', icon: <Network size={24} />, color: '#8b5cf6' },
    { label: 'Relationships', value: '24,105', icon: <Activity size={24} />, color: '#10b981' },
    { label: 'AI Queries', value: '342', icon: <BrainCircuit size={24} />, color: '#f59e0b' },
  ];

  const recentActivity = [
    { id: 1, action: 'Document Ingested', target: 'Q3_Financial_Report.pdf', time: '10 mins ago', status: 'success' },
    { id: 2, action: 'Graph Updated', target: 'Extracted 45 new relations', time: '12 mins ago', status: 'info' },
    { id: 3, action: 'Search Query', target: 'What are the main revenue drivers?', time: '1 hour ago', status: 'normal' },
    { id: 4, action: 'Document Ingested', target: 'Project_Architecture.md', time: '3 hours ago', status: 'success' },
  ];

  return (
    <div className="dashboard-container">
      <motion.header 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-gradient">Dashboard</h1>
        <p>Overview of your knowledge graph and system activity</p>
      </motion.header>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="stat-card" glass glow>
              <div className="stat-icon-wrapper" style={{ color: stat.color, background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                {stat.icon}
                <div className="stat-icon-glow" style={{ background: stat.color }} />
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-content">
        <motion.div 
          className="flex-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="content-card" glass>
            <div className="card-header">
              <h2>Graph Growth</h2>
            </div>
            <div className="chart-placeholder">
              <div className="mock-bar-chart">
                {[40, 60, 45, 80, 65, 90, 110].map((h, i) => (
                  <div key={i} className="bar-wrapper">
                    <motion.div 
                      className="bar" 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8, type: 'spring' }}
                    />
                  </div>
                ))}
              </div>
              <div className="chart-x-axis">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="content-card" glass>
            <div className="card-header">
              <h2>Recent Activity</h2>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity, idx) => (
                <motion.div 
                  key={activity.id} 
                  className="activity-item"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                >
                  <div className={`activity-indicator ${activity.status}`}>
                    <div className="indicator-pulse" />
                  </div>
                  <div className="activity-details">
                    <p className="activity-action">{activity.action}</p>
                    <p className="activity-target">{activity.target}</p>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
