import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './i18n'
import './index.css'
import App from './App'
import { initAnalytics } from './utils/analytics'

// Restores a previously granted analytics consent. Does nothing if consent was
// declined or never given, and nothing at all without a measurement ID.
initAnalytics()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
