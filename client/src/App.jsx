import { Routes, Route } from 'react-router-dom'
import { WorldProvider } from './store/WorldContext.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ReportPage from './pages/ReportPage.jsx'
import DesignSystem from './pages/DesignSystem.jsx'

function App() {
  return (
    <WorldProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="design-system" element={<DesignSystem />} />
        </Route>
      </Routes>
    </WorldProvider>
  )
}

export default App
