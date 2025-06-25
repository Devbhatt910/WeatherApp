import { useState, useEffect } from 'react'
import WeatherApp from "./components/WeatherApp"
import './App.css'

const App = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('weather_theme')
    if (saved) return saved
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('weather_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="app">
      <WeatherApp theme={theme} toggleTheme={toggleTheme} />
    </div>
  )
}

export default App
