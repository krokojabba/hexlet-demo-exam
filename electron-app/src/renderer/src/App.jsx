import { Routes, Route, HashRouter } from 'react-router'
import Partners from './components/Partners'
import PartnersForm from './components/PartnerForm'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<Partners />} />
        <Route path="/partner/update" element={<PartnersForm />} />
        <Route path="/partner/create" element={<PartnersForm />} />
      </Routes>
    </HashRouter>
  )
}

export default App
