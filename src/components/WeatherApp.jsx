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
import { faDroplet, faLocationDot, faMagnifyingGlassLocation, faTemperatureThreeQuarters, faWind /*, faQuestionCircle */ } from '@fortawesome/free-solid-svg-icons' // Optional icon for Not Found

const WeatherApp = () => {
    const [data, setData] = useState({})
    const [location, setLocation] = useState('')
    const [loading, setloading] = useState(false)
    // Remember to secure your API key (e.g., environment variables)
    const apikey = "7ab5db93a3e23f8320fbbf6beb6238b1";

    useEffect(() => {
        const fetchDefaultWeather = async () => {
            setloading(true)
            const defaultLocation = "Gandhinagar"
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${apikey}`
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const defaultData = await res.json();
                setData(defaultData)
            } catch (error) {
                console.error("Failed to fetch default weather:", error);
                setData({ notFound: true });
            } finally {
                setloading(false)
            }
        }
        fetchDefaultWeather()
    }, [])

    const handleInputChange = (e) => {
        setLocation(e.target.value);
    }

    const search = async () => {
        if (location.trim() !== "") {
            setloading(true);
            setData({}); // Clear data for transition
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${apikey}`
            try {
                const res = await fetch(url);
                const searchData = await res.json();
                if (searchData.cod !== 200) {
                    setData({ notFound: true })
                } else {
                    setData(searchData);
                    setLocation('')
                }
            } catch (error) {
                console.error("Failed to fetch searched weather:", error);
                setData({ notFound: true });
            } finally {
                setloading(false);
            }
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            search()
        }
    }

    // --- Weather Condition Mappings (Keep these updated) ---
     const weatherImages = { /* ... as before ... */ Clear: sunny, Clouds: cloudy, Rain: rainy, Drizzle: rainy, Thunderstorm: rainy, Snow: snow, Mist: cloudy, Haze: cloudy, Smoke: cloudy, Fog: cloudy, Dust: cloudy, Sand: cloudy, Ash: cloudy, Squall: cloudy, Tornado: cloudy };
     const bgImages = { /* ... as before ... */ Clear: 'linear-gradient(to right, #f3b07c, #fcd284)', Clouds: 'linear-gradient(to right, #adb1c0, #bdc3d0)', Rain: 'linear-gradient(to right, #5bc8fb, #80eaff)', Drizzle: 'linear-gradient(to right, #89c1d3, #a9d8e5)', Thunderstorm: 'linear-gradient(to right, #3e517a, #6a7a9b)', Snow: 'linear-gradient(to right, #deeefc, #ffffff)', Mist: 'linear-gradient(to right, #d3dce6, #e8ecf1)', Haze: 'linear-gradient(to right, #c1c0b9, #dcdacb)', Smoke: 'linear-gradient(to right, #a8a7a1, #c4c3bc)', Fog: 'linear-gradient(to right, #cacaca, #e0e0e0)', Dust: 'linear-gradient(to right, #d2b48c, #e0c9a6)', Sand: 'linear-gradient(to right, #e8c39e, #f4dcb4)' };
    // ---

    const weatherMain = data.weather ? data.weather[0].main : null;
    const weatherImg = weatherMain ? weatherImages[weatherMain] || cloudy : null; // Fallback
    const bgImage = weatherMain ? bgImages[weatherMain] || bgImages['Clouds'] : bgImages['Clear']; // Fallback

    const temp = data.main ? `${Math.round(data.main.temp)}` : null;

    const currentDate = new Date();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const month = months[currentDate.getMonth()];
    const dayOfMonth = currentDate.getDate();
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;

    const containerStyle = { backgroundImage: bgImage };
    // App style is now mostly handled by CSS, dynamic part could be minimal
    const appStyle = { /* Optional minor adjustments based on weather? */ };


    // Render Logic - This structure should work with the new CSS
    return (
        <div className="container" style={containerStyle}>
            <div className="weather-app" style={appStyle}>
                <div className="search">
                    <div className="search-top">
                        <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
                        {/* Display placeholder if data.name is not yet available */}
                        <div className="location">{data.name || (loading ? 'Loading...' : 'Weather App')}</div>
                    </div>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Enter Location"
                            value={location}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <FontAwesomeIcon
                            icon={faMagnifyingGlassLocation}
                            onClick={search}
                            className="search-icon"
                        />
                    </div>
                </div>

                {loading ? (
                    <img className='loader' src={loader} alt='Loading...' />
                ) : data.notFound ? (
                    <div className='not-found'>
                       {/* Optional Icon: <FontAwesomeIcon icon={faQuestionCircle} /> */}
                       Location Not Found
                    </div>
                ) : !data.weather ? (
                    <div className='not-found'>Enter a location to begin</div>
                 ) : (
                    // Data Display Section (will animate in due to CSS)
                    <>
                        <div className="weather-info">
                            {weatherImg && <img src={weatherImg} alt={weatherMain || 'Weather condition'} className="weather-img" />}
                            <div className="weather-type">{data.weather[0].main}</div>
                            {temp !== null && <div className="temp">{temp}°C</div>}
                        </div>

                        <div className="weather-date">
                            <p>{formattedDate}</p>
                        </div>

                        <div className="weather-data">
                            {data.main && (
                                <div className="humidity">
                                    <div className="data-name">Humidity</div>
                                    <FontAwesomeIcon icon={faDroplet} /* beat */ className="data-icon" /> {/* Beat animation might be too much with other animations */}
                                    <div className="data">{data.main.humidity}%</div>
                                </div>
                            )}
                            {data.main && (
                                <div className="feelslike">
                                    <div className="data-name">Feels Like</div>
                                    <FontAwesomeIcon icon={faTemperatureThreeQuarters} /* shake */ className="data-icon" /> {/* Shake animation might be too much */}
                                    <div className="data">{Math.round(data.main.feels_like)}°C</div>
                                </div>
                            )}
                             {data.wind && (
                                <div className="wind">
                                    <div className="data-name">Wind</div>
                                    <FontAwesomeIcon icon={faWind} /* beatFade */ className="data-icon" /> {/* BeatFade animation might be too much */}
                                    <div className="data">{data.wind.speed} km/h</div>
                                </div>
                             )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default WeatherApp;