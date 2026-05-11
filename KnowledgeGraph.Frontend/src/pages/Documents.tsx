import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDocuments } from '../hooks/useDocuments';
import { useUploadDocument } from '../hooks/useUploadDocument';
import { UploadZone } from '../features/documents/components/UploadZone';
import { DocumentList } from '../features/documents/components/DocumentList';
import { pipelineSteps, type DocumentType } from '../features/documents/types';
import { useToast } from '../hooks/useToast';

const Documents: React.FC = () => {
  const { data: documents = [] } = useDocuments();
  const uploadDoc = useUploadDocument();
  const { addToast } = useToast();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startSimulatedUpload(e.dataTransfer.files[0].name);
    }
  };

  const startSimulatedUpload = async (filename: string = 'Synapse_Architecture.pdf') => {
    setIsUploading(true);
    
    try {
      for (let i = 1; i <= pipelineSteps.length; i++) {
        setUploadStep(i);
        const delay = i === pipelineSteps.length ? 500 : 800 + Math.random() * 400;
        await new Promise(r => setTimeout(r, delay));
      }
      
      await uploadDoc.mutateAsync(filename);
      addToast(`Successfully uploaded ${filename}`, 'success');
    } catch (error) {
      addToast(`Failed to upload ${filename}`, 'error');
    } finally {
      setIsUploading(false);
      setUploadStep(0);
    }
  };

  return (
    <div className="docs-container">
      <motion.div 
        className="docs-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-gradient">Data Ingestion</h1>
        <p>Upload documents to enrich the knowledge graph.</p>
      </motion.div>

      <div className="docs-content">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.1 }}
        >
          <UploadZone 
            isUploading={isUploading}
            uploadStep={uploadStep}
            dragActive={dragActive}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            startUpload={startSimulatedUpload}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          <DocumentList documents={documents as DocumentType[]} />
        </motion.div>
      </div>
    </div>
  );
};

export default Documents;
