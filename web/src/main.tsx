import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import { theme } from './constants/antd.ts'

createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={theme}>
    <App />
  </ConfigProvider>

)
