import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';
import { Card, Button } from '../../../components/ui';
import { pipelineSteps } from '../types';

interface UploadZoneProps {
  isUploading: boolean;
  uploadStep: number;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  startUpload: (filename?: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ 
  isUploading, uploadStep, dragActive, handleDrag, handleDrop, startUpload 
}) => {
  return (
    <Card 
      className={`upload-zone ${dragActive ? 'drag-active' : ''} ${isUploading ? 'uploading' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      glass
    >
      <AnimatePresence mode="wait">
        {!isUploading ? (
          <motion.div 
            key="prompt"
            className="upload-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="upload-icon-wrapper">
              <Upload size={32} />
              <div className="upload-icon-glow" />
            </div>
            <h3>Drag & Drop documents here</h3>
            <p>Supports PDF, Markdown, TXT, HTML, CSV</p>
            <Button variant="secondary" onClick={() => startUpload()}>
              Browse Files
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            key="pipeline"
            className="ingestion-pipeline"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="pipeline-title">
              <span className="pipeline-pulse" />
              Processing Pipeline
            </h3>
            <div className="pipeline-steps">
              {pipelineSteps.map((step, idx) => {
                const isCompleted = uploadStep > step.id;
                const isActive = uploadStep === step.id;
                return (
                  <div 
                    key={step.id} 
                    className={`pipeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  >
                    <motion.div 
                      className="step-icon-container"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: isActive ? 1.1 : 1, opacity: isCompleted || isActive ? 1 : 0.4 }}
                    >
                      <div className="step-icon">{step.icon}</div>
                      {isActive && <motion.div className="step-ring" layoutId="active-ring" />}
                    </motion.div>
                    <div className="step-label">{step.label}</div>
                    
                    {idx < pipelineSteps.length - 1 && (
                      <div className="step-connector">
                        <motion.div 
                          className="connector-line" 
                          initial={{ width: "0%" }}
                          animate={{ width: isCompleted ? "100%" : isActive ? "50%" : "0%" }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
