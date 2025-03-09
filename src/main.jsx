import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import App from './App.jsx'
import HourDetail from './routes/HourDetail';
import './index.css'
import { WeatherProvider} from "./components/WeatherProvider.jsx" ;


createRoot(document.getElementById('root')).render(
  <WeatherProvider>
<BrowserRouter>
  <Routes>
      <Route index={true} path="/" element={<App />} />
      
      {/* Routes for Hourly Forecast and Detail View */}
      <Route index={false} path="/hour/:hourIndex" element={<HourDetail />} />

  </Routes>
</BrowserRouter>
  </WeatherProvider>
  
)
