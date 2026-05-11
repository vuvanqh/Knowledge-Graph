import { Upload, FileCode, Layers, Database, Cpu, Network, CheckCircle } from 'lucide-react';

export interface DocumentType {
  id: number;
  name: string;
  size: string;
  date: string;
  status: string;
}

export const pipelineSteps = [
  { id: 1, label: 'Uploading', icon: <Upload size={18} /> },
  { id: 2, label: 'Parsing', icon: <FileCode size={18} /> },
  { id: 3, label: 'Chunking', icon: <Layers size={18} /> },
  { id: 4, label: 'Embeddings', icon: <Database size={18} /> },
  { id: 5, label: 'Knowledge Extraction', icon: <Cpu size={18} /> },
  { id: 6, label: 'Graph Linking', icon: <Network size={18} /> },
  { id: 7, label: 'Complete', icon: <CheckCircle size={18} /> },
];
