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

// iOS Safari does not apply :active styles unless the document has a touch
// listener attached. Without this the mobile CTA's press feedback simply never
// fires on an iPhone, which is the one device it was designed for. An empty
// passive listener is the long-standing fix and costs nothing.
document.addEventListener('touchstart', () => {}, { passive: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
