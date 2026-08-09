import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet'
import { MAP_CENTER, MAP_ZOOM } from '../utils/constants.js'
import 'leaflet/dist/leaflet.css'

export default function MapContainer({ children }) {
  return (
    <LeafletMap
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      style={{ height: '100%', width: '100%', minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </LeafletMap>
  )
}
