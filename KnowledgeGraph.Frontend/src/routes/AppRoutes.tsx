import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import ProtectedLayout from '../layouts/ProtectedLayout';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import KnowledgeGraph from '../pages/KnowledgeGraph';
import AiSearch from '../pages/AiSearch';
import Documents from '../pages/Documents';
import Settings from '../pages/Settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/graph" element={<KnowledgeGraph />} />
        <Route path="/search" element={<AiSearch />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
