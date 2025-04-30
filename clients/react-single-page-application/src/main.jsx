import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import * as contexts from "./contexts";

import { App } from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <contexts.Storage.Component>
      <contexts.WebSocket.Component>
        <contexts.Identity.Component>
          <App />
        </contexts.Identity.Component>
      </contexts.WebSocket.Component>
    </contexts.Storage.Component>
  </StrictMode>,
)
