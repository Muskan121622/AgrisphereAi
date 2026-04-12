import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from './ui/card';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Supplier {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type?: string;
}

interface NearbySuppliersMapProps {
  suppliers: Supplier[];
  userLocation?: { lat: number; lng: number };
}

export function NearbySuppliersMap({ suppliers, userLocation }: NearbySuppliersMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      // Initialize map
      const initialLat = userLocation?.lat || 25.86; // Default Samastipur
      const initialLng = userLocation?.lng || 85.77;

      mapRef.current = L.map(mapContainerRef.current).setView([initialLat, initialLng], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);

      markersRef.current = L.layerGroup().addTo(mapRef.current);
    }

    // Update markers
    if (markersRef.current && mapRef.current) {
      markersRef.current.clearLayers();
      
      // Add user marker
      if (userLocation) {
        L.marker([userLocation.lat, userLocation.lng], {
          icon: L.divIcon({
            html: '📍',
            className: 'user-location-icon',
            iconSize: [30, 30],
          })
        })
        .bindPopup("Your Location")
        .addTo(markersRef.current);
      }

      // Add supplier markers
      suppliers.forEach(supp => {
        if (supp.lat && supp.lng) {
          L.marker([supp.lat, supp.lng])
            .bindPopup(`
              <div class="p-1">
                <h4 class="font-bold text-sm">${supp.name}</h4>
                <p class="text-xs text-gray-600">${supp.address}</p>
                <div class="mt-1">
                  <span class="text-xs bg-green-100 text-green-800 px-1 rounded">${supp.type || 'Supplier'}</span>
                </div>
              </div>
            `)
            .addTo(markersRef.current!);
        }
      });

      // Fit bounds if we have markers
      const validSuppliers = suppliers.filter(s => s.lat !== undefined && s.lng !== undefined);
      if (validSuppliers.length > 0 && mapRef.current) {
        const bounds = L.latLngBounds(validSuppliers.map(s => [s.lat as number, s.lng as number]));
        if (userLocation) bounds.extend([userLocation.lat, userLocation.lng]);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [suppliers, userLocation]);

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-muted/30">
      <div 
        ref={mapContainerRef} 
        className="w-full h-[400px] z-0" 
        style={{ background: '#f8fafc' }}
      />
    </Card>
  );
}
