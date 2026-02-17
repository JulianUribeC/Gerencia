import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Clients from './pages/Clients'
import Team from './pages/Team'
import Analytics from './pages/Analytics'
import MetricsDashboard from './pages/MetricsDashboard'
import Taxes from './pages/Taxes'
import Marketing from './pages/Marketing'
import TestSupabase from './pages/TestSupabase'
import Login from './pages/Login'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="clients" element={<Clients />} />
            <Route path="team" element={<Team />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="metrics" element={<MetricsDashboard />} />
            <Route path="taxes" element={<Taxes />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="test-supabase" element={<TestSupabase />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App