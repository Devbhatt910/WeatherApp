import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudSun } from '@fortawesome/free-solid-svg-icons'

const WeatherMap = ({ lat, lon, city }) => {
  if (!lat || !lon) return null
  // Custom marker icon (FontAwesome in a div)
  const icon = L.divIcon({
    className: 'weather-map-marker',
    html: `<div style="font-size:1.5rem;color:#3b82f6;"><svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='cloud-sun' class='svg-inline--fa fa-cloud-sun' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'><path fill='currentColor' d='M575.7 326.7c-3.2-2.2-6.7-4.2-10.2-6.1c-2.2-1.1-4.5-2.1-6.8-3c-2.3-.9-4.7-1.7-7.1-2.4c-2.4-.7-4.8-1.3-7.2-1.8c-2.4-.5-4.8-.9-7.2-1.2c-2.4-.3-4.8-.5-7.2-.6c-2.4-.1-4.8-.1-7.2 0c-2.4.1-4.8.3-7.2.6c-2.4.3-4.8.7-7.2 1.2c-2.4.5-4.8 1.1-7.2 1.8c-2.4.7-4.8 1.5-7.1 2.4c-2.3.9-4.6 1.9-6.8 3c-3.5 1.9-7 3.9-10.2 6.1c-3.2 2.2-6.2 4.6-9.1 7.1c-2.9 2.5-5.7 5.1-8.3 7.8c-2.6 2.7-5.1 5.5-7.4 8.4c-2.3 2.9-4.5 5.9-6.5 9c-2 3.1-3.9 6.3-5.6 9.6c-1.7 3.3-3.2 6.7-4.6 10.1c-1.4 3.4-2.6 6.9-3.7 10.4c-1.1 3.5-2 7.1-2.7 10.7c-.7 3.6-1.2 7.2-1.5 10.8c-.3 3.6-.5 7.2-.5 10.8c0 3.6.2 7.2.5 10.8c.3 3.6.8 7.2 1.5 10.8c.7 3.6 1.6 7.2 2.7 10.7c1.1 3.5 2.3 7 3.7 10.4c1.4 3.4 2.9 6.8 4.6 10.1c1.7 3.3 3.6 6.5 5.6 9.6c2 3.1 4.2 6.1 6.5 9c2.3 2.9 4.8 5.7 7.4 8.4c2.6 2.7 5.4 5.3 8.3 7.8c2.9 2.5 5.9 4.9 9.1 7.1c3.2 2.2 6.7 4.2 10.2 6.1c2.2 1.1 4.5 2.1 6.8 3c2.3.9 4.7 1.7 7.1 2.4c2.4.7 4.8 1.3 7.2 1.8c2.4.5 4.8.9 7.2 1.2c2.4.3 4.8.5 7.2.6c2.4.1 4.8.1 7.2 0c2.4-.1 4.8-.3 7.2-.6c2.4-.3 4.8-.7 7.2-1.2c2.4-.5 4.8-1.1 7.2-1.8c2.4-.7 4.8-1.5 7.1-2.4c2.3-.9 4.6-1.9 6.8-3c3.5-1.9 7-3.9 10.2-6.1c3.2-2.2 6.2-4.6 9.1-7.1c2.9-2.5 5.7-5.1 8.3-7.8c2.6-2.7 5.1-5.5 7.4-8.4c2.3-2.9 4.5-5.9 6.5-9c2-3.1 3.9-6.3 5.6-9.6c1.7-3.3 3.2-6.7 4.6-10.1c1.4-3.4 2.6-6.9 3.7-10.4c1.1-3.5 2-7.1 2.7-10.7c.7-3.6 1.2-7.2 1.5-10.8c.3-3.6.5-7.2.5-10.8c0-3.6-.2-7.2-.5-10.8c-.3-3.6-.8-7.2-1.5-10.8c-.7-3.6-1.6-7.2-2.7-10.7c-1.1-3.5-2.3-7-3.7-10.4c-1.4-3.4-2.9-6.8-4.6-10.1c-1.7-3.3-3.6-6.5-5.6-9.6c-2-3.1-4.2-6.1-6.5-9c-2.3-2.9-4.8-5.7-7.4-8.4c-2.6-2.7-5.4-5.3-8.3-7.8c-2.9-2.5-5.9-4.9-9.1-7.1z'></path></svg></div>`
  })
  return (
    <div className="weather-map-container">
      <MapContainer center={[lat, lon]} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]} icon={icon}>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700 }}>{city}</div>
              <FontAwesomeIcon icon={faCloudSun} style={{ color: '#3b82f6', fontSize: '1.2rem' }} />
              <div>Current Location</div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default WeatherMap 