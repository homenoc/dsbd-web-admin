import React from 'react'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { SnackbarProvider } from 'notistack'
import { RecoilRoot } from 'recoil'
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <RecoilRoot>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </RecoilRoot>
  )
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
