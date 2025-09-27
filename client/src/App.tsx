import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/home/HomePage';
import PerformancePage from '@/pages/performance/PerformancePage';
import PulsePage from '@/pages/pulse/PulsePage';

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/performance" element={<PerformancePage />} />
    <Route path="/pulse" element={<PulsePage />} />
    <Route path="*" element={<Navigate to="/home" replace />} />
  </Routes>
);

export default App;
