// Previous JSX structure is generally fine.
// Key things to ensure from the last revision:
// - Wrap main content in <div className="weather-info">...</div>
// - Added classNames: location-icon, search-icon, weather-img, data-icon
// - Conditional rendering logic for loading/notFound/data states.

import sunny from '../assets/imgs/sunny.png'
import cloudy from '../assets/imgs/cloudy.png'
import rainy from '../assets/imgs/rainy.png'
import snow from '../assets/imgs/snowy.png'
import loader from '../assets/images/loading.gif' // Check path
import './WeatherApp.css' // Import the updated CSS
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faLocationDot, 
  faThermometerHalf, 
  faDroplet, 
  faWind, 
  faEye,
  faGauge,
  faSun,
  faMoon,
  faCloud,
  faCloudRain,
  faSnowflake,
  faBolt,
  faSmog,
  faHistory,
  faTimes,
  faCog
} from '@fortawesome/free-solid-svg-icons'
import WeatherMap from './WeatherMap'

const WeatherApp = ({ theme, toggleTheme }) => {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState([])
  const [unit, setUnit] = useState('metric')
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const API_KEY = "f60c216a2a6640e2ade164201252506"

  // Helper functions
  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return faSun
    if (conditionLower.includes('cloud')) return faCloud
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return faCloudRain
    if (conditionLower.includes('snow')) return faSnowflake
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return faBolt
    if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haze')) return faSmog
    return faCloud
  }

  const getTemperature = (temp) => {
    if (unit === 'metric') return Math.round(temp)
    return Math.round((temp * 9/5) + 32)
  }

  const getUnitSymbol = () => unit === 'metric' ? '°C' : '°F'

  const getWindSpeed = (speed) => {
    if (unit === 'metric') return `${Math.round(speed)} km/h`
    return `${Math.round(speed * 0.621371)} mph`
  }

  const getVisibility = (visibility) => {
    if (unit === 'metric') {
      return visibility >= 10000 ? '10+ km' : `${(visibility / 1000).toFixed(1)} km`
    }
    const miles = visibility * 0.000621371
    return miles >= 6.2 ? '6+ mi' : `${miles.toFixed(1)} mi`
  }

  const getPressure = (pressure) => {
    if (unit === 'metric') return `${pressure} hPa`
    const inHg = pressure * 0.02953
    return `${inHg.toFixed(2)} inHg`
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getUVLevel = (uvIndex) => {
    if (uvIndex <= 2) return { level: 'Low', color: 'var(--accent-success)' }
    if (uvIndex <= 5) return { level: 'Moderate', color: 'var(--accent-warning)' }
    if (uvIndex <= 7) return { level: 'High', color: 'var(--accent-danger)' }
    if (uvIndex <= 10) return { level: 'Very High', color: '#9c27b0' }
    return { level: 'Extreme', color: '#e91e63' }
  }

  // API functions
  const fetchWeather = async (location) => {
    setLoading(true)
    setError(null)
    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=no&alerts=yes`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Location not found')
      const data = await response.json()
      setWeatherData(data)
      if (location !== 'Gandhinagar') updateSearchHistory(data.location.name)
    } catch (err) {
      setError(err.message)
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const updateSearchHistory = (city) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== city.toLowerCase())
      const updated = [city, ...filtered].slice(0, 5)
      localStorage.setItem('weather_search_history', JSON.stringify(updated))
      return updated
    })
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchWeather(searchQuery.trim())
      setSearchQuery('')
      setShowHistory(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleHistoryClick = (city) => {
    fetchWeather(city)
    setShowHistory(false)
  }

  const toggleUnit = () => {
    setUnit(prev => {
      const newUnit = prev === 'metric' ? 'imperial' : 'metric'
      localStorage.setItem('weather_unit', newUnit)
      return newUnit
    })
  }

  // Load initial data and settings
  useEffect(() => {
    const savedHistory = localStorage.getItem('weather_search_history')
    const savedUnit = localStorage.getItem('weather_unit')
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory))
    if (savedUnit) setUnit(savedUnit)
    fetchWeather('Gandhinagar')
  }, [])

  // Re-fetch weather when unit changes
  useEffect(() => {
    if (weatherData) {
      fetchWeather(weatherData.location.name)
    }
  }, [unit])

  // Extract alerts and coordinates
  const alerts = weatherData && weatherData.alerts && weatherData.alerts.alert ? weatherData.alerts.alert : []
  const lat = weatherData && weatherData.location ? weatherData.location.lat : null
  const lon = weatherData && weatherData.location ? weatherData.location.lon : null

  if (loading && !weatherData) {
    return (
      <div className="weather-container">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="weather-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => fetchWeather('auto:ip')}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!weatherData) return null

  const current = weatherData.current
  const location = weatherData.location
  const forecast = weatherData.forecast.forecastday

  return (
    <div className="weather-container">
      {/* Header */}
      <div className="weather-header">
        <div className="search-container">
          <div className="search-input-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-btn"
                onClick={() => setSearchQuery('')}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
          
          <button 
            className="history-btn"
            onClick={() => setShowHistory(!showHistory)}
            title="Search History"
          >
            <FontAwesomeIcon icon={faHistory} />
          </button>
          
          {showHistory && searchHistory.length > 0 && (
            <div className="history-dropdown">
              {searchHistory.map((city, index) => (
                <button
                  key={index}
                  className="history-item"
                  onClick={() => handleHistoryClick(city)}
                >
                  <FontAwesomeIcon icon={faLocationDot} />
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="header-actions">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </button>
          
          <button 
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <FontAwesomeIcon icon={faCog} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel">
          <h3>Settings</h3>
          <div className="setting-item">
            <label>Temperature Unit</label>
            <button 
              className={`unit-toggle ${unit === 'metric' ? 'active' : ''}`}
              onClick={toggleUnit}
            >
              <span className={unit === 'metric' ? 'active' : ''}>°C</span>
              <span className={unit === 'imperial' ? 'active' : ''}>°F</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Card: Two-column layout */}
      <div className="weather-main-card">
        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <div className="weather-alerts">
            {alerts.map((alert, idx) => (
              <div key={idx} className="weather-alert">
                <strong>{alert.event}</strong>: {alert.headline || alert.desc || alert.description}
                {alert.instruction && <div className="alert-instruction">{alert.instruction}</div>}
              </div>
            ))}
          </div>
        )}
        {/* Left: Current Weather & Details */}
        <div className="main-left">
          <div className="main-current">
            <div className="main-location">
              <h2 className="city-name">{location.name}</h2>
              <div className="location-details">
                {location.region && `${location.region}, `}{location.country}
              </div>
              <div className="current-time">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className="main-temp-row">
              <div className="main-temp">
                <FontAwesomeIcon 
                  icon={getWeatherIcon(current.condition.text)} 
                  className="main-temp-icon"
                />
                <span className="main-temp-value">
                  {getTemperature(current.temp_c)}{getUnitSymbol()}
                </span>
              </div>
              <div className="main-desc">{current.condition.text}</div>
              <div className="main-feels">
                Feels like {getTemperature(current.feelslike_c)}{getUnitSymbol()}
              </div>
            </div>
          </div>
          <div className="main-details-grid">
            <div className="detail-item">
              <FontAwesomeIcon icon={faThermometerHalf} />
              <div>
                <div className="detail-label">High / Low</div>
                <div className="detail-value">
                  {getTemperature(forecast[0].day.maxtemp_c)} / {getTemperature(forecast[0].day.mintemp_c)}{getUnitSymbol()}
                </div>
              </div>
            </div>

            <div className="detail-item">
              <FontAwesomeIcon icon={faDroplet} />
              <div>
                <div className="detail-label">Humidity</div>
                <div className="detail-value">{current.humidity}%</div>
              </div>
            </div>

            <div className="detail-item">
              <FontAwesomeIcon icon={faWind} />
              <div>
                <div className="detail-label">Wind</div>
                <div className="detail-value">
                  {getWindSpeed(current.wind_kph)} {current.wind_dir}
                </div>
              </div>
            </div>

            <div className="detail-item">
              <FontAwesomeIcon icon={faEye} />
              <div>
                <div className="detail-label">Visibility</div>
                <div className="detail-value">{getVisibility(current.vis_km)}</div>
              </div>
            </div>

            <div className="detail-item">
              <FontAwesomeIcon icon={faGauge} />
              <div>
                <div className="detail-label">Pressure</div>
                <div className="detail-value">{getPressure(current.pressure_mb)}</div>
              </div>
            </div>

            <div className="detail-item">
              <FontAwesomeIcon icon={faSun} />
              <div>
                <div className="detail-label">UV Index</div>
                <div className="detail-value" style={{ color: getUVLevel(current.uv).color }}>
                  {current.uv} ({getUVLevel(current.uv).level})
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right: 7-Day Forecast */}
        <div className="main-right">
          <div className="forecast-title">7-Day Forecast</div>
          <div className="forecast-list">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <div className="forecast-date">{formatDate(day.date_epoch)}</div>
                <FontAwesomeIcon 
                  icon={getWeatherIcon(day.day.condition.text)} 
                  className="forecast-icon"
                />
                <div className="forecast-temps">
                  <span className="forecast-high">{getTemperature(day.day.maxtemp_c)}°</span>
                  <span className="forecast-low">{getTemperature(day.day.mintemp_c)}°</span>
                </div>
                <div className="forecast-desc">{day.day.condition.text}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Weather Map */}
        <WeatherMap lat={lat} lon={lon} city={location.name} />
      </div>
    </div>
  )
}

export default WeatherApp