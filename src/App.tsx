import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Projects } from '@/pages/Projects';
import { ProjectDetail } from '@/pages/ProjectDetail';
import { Clients } from '@/pages/Clients';
import { Analytics } from '@/pages/Analytics';
import { MetricsDashboard } from '@/pages/MetricsDashboard';
import { Taxes } from '@/pages/Taxes';
import { Marketing } from '@/pages/Marketing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/metrics" element={<MetricsDashboard />} />
          <Route path="/taxes" element={<Taxes />} />
          <Route path="/marketing" element={<Marketing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
