import { Routes, Route } from 'react-router-dom'
import { WorldProvider } from './store/WorldContext.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DesignSystem from './pages/DesignSystem.jsx'
import LandingPage from './pages/LandingPage.jsx'
import MobilePortal from './pages/MobilePortal.jsx'

function App() {
  return (
    <WorldProvider>
      <Routes>
        {/* Public landing page — no Layout wrapper */}
        <Route path="/" element={<LandingPage />} />

        {/* Mobile field reporting portal — no Layout wrapper */}
        <Route path="/report" element={<MobilePortal />} />

        {/* Operator Portal — keeps existing Layout */}
        <Route path="/operator" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="design-system" element={<DesignSystem />} />
        </Route>

        {/* Legacy redirect: old /report route goes to new /report */}
      </Routes>
    </WorldProvider>
  )
}

export default App
