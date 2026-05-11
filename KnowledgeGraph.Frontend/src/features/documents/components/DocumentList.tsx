import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { Card, Button } from '../../../components/ui';
import type { DocumentType } from '../types';

interface DocumentListProps {
  documents: DocumentType[];
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  return (
    <Card glass className="docs-list-section">
      <div className="section-header">
        <h3>Ingested Documents</h3>
        <span className="doc-count">{documents.length} files</span>
      </div>
      
      <div className="docs-table-wrapper">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {documents.map((doc, idx) => (
                <motion.tr 
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <td className="doc-name-cell">
                    <div className="doc-icon-container">
                      <FileText size={16} />
                    </div>
                    <span>{doc.name}</span>
                  </td>
                  <td className="text-secondary">{doc.size}</td>
                  <td className="text-secondary">{doc.date}</td>
                  <td>
                    <span className={`status-badge ${doc.status}`}>
                      {doc.status === 'processed' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                      {doc.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Button variant="ghost" size="sm" className="action-btn danger">
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </Card>
  );
};
