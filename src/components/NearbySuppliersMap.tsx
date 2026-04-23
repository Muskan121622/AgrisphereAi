import { useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Navigation } from "lucide-react";
import { loadGoogleMapsSdk, type LatLng } from "@/lib/googlePlaces";

interface Supplier {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type?: string;
  rating?: number | string;
  phone?: string;
  distance?: string;
  businessStatus?: string;
  googleMapsUrl?: string;
}

interface NearbySuppliersMapProps {
  suppliers: Supplier[];
  userLocation?: LatLng;
  activeSupplier?: Supplier | null;
  onLocateCurrentLocation?: () => void;
  onLocateProfileLocation?: () => void;
}

export function NearbySuppliersMap({
  suppliers,
  userLocation,
  activeSupplier,
  onLocateCurrentLocation,
  onLocateProfileLocation,
}: NearbySuppliersMapProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  const shopMarkerIcon = (google: any) => ({
    url: "/images/marker.png",
    scaledSize: new google.maps.Size(42, 42),
    anchor: new google.maps.Point(21, 42),
  });

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      await loadGoogleMapsSdk();
      if (!isMounted || !mapContainerRef.current || mapRef.current) return;

      const google = window.google as any;
      // Use google.maps.Map directly — importLibrary is only for the new JS API loader
      const MapClass = google.maps.Map;
      const InfoWindowClass = google.maps.InfoWindow;

      const center = userLocation || { lat: 25.86, lng: 85.77 };
      mapRef.current = new MapClass(mapContainerRef.current, {
        center,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        clickableIcons: false,
        gestureHandling: "greedy",
        mapTypeId: "roadmap",
      });

      infoWindowRef.current = new InfoWindowClass({
        pixelOffset: new google.maps.Size(0, -8),
      });
    };

    void initializeMap();

    return () => {
      isMounted = false;
    };
  }, [userLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.google) return;

    const google = window.google as any;
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const openShopCard = (marker: any, supp: Supplier) => {
      const infoWindow = infoWindowRef.current;
      if (!infoWindow) return;

      infoWindow.setContent(
        `
          <div style="min-width:240px;max-width:280px;padding:4px 2px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#16a34a;margin-bottom:6px;">Nearby shop</div>
            <div style="font-size:15px;font-weight:700;color:#0f172a;line-height:1.25;margin-bottom:6px;">${supp.name}</div>
            <div style="color:#475569;font-size:12px;line-height:1.45;margin-bottom:8px;">${supp.address}</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
              <span style="background:#dcfce7;color:#166534;padding:3px 8px;border-radius:9999px;font-size:11px;font-weight:700;">${supp.type || "Farm shop"}</span>
              ${supp.distance ? `<span style="background:#f1f5f9;color:#334155;padding:3px 8px;border-radius:9999px;font-size:11px;font-weight:700;">${supp.distance} km</span>` : ""}
              ${supp.rating ? `<span style="background:#fef3c7;color:#92400e;padding:3px 8px;border-radius:9999px;font-size:11px;font-weight:700;">⭐ ${supp.rating}</span>` : ""}
            </div>
            ${supp.businessStatus ? `<div style="margin-top:8px;color:#0f766e;font-size:12px;font-weight:600;">${supp.businessStatus}</div>` : ""}
          </div>
        `,
      );
      infoWindow.open({ map, anchor: marker, shouldFocus: false });
    };

    const bounds = new google.maps.LatLngBounds();

    if (userLocation) {
      const userMarker = new google.maps.Marker({
        map,
        position: userLocation,
        title: "My location",
        zIndex: 2,
      });
      markersRef.current.push(userMarker);
      bounds.extend(userLocation);
    }

    suppliers.forEach((supp) => {
      if (typeof supp.lat !== "number" || typeof supp.lng !== "number") return;

      const position = { lat: supp.lat, lng: supp.lng };
      const isActive = activeSupplier?.id === supp.id;
      const marker = new google.maps.Marker({
        map,
        position,
        title: supp.name,
        icon: shopMarkerIcon(google),
        zIndex: isActive ? 10 : 1,
      });

      marker.addListener("mouseover", () => openShopCard(marker, supp));
      marker.addListener("mouseout", () => infoWindowRef.current?.close());
      marker.addListener("click", () => openShopCard(marker, supp));

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (suppliers.length > 0) {
      map.fitBounds(bounds, { padding: 56 });
      if (suppliers.length === 1) {
        map.setZoom(Math.max(map.getZoom(), 14));
      }
    } else if (userLocation) {
      map.setCenter(userLocation);
      map.setZoom(13);
    }
  }, [suppliers, userLocation, activeSupplier]);

  return (
    <Card className="h-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl shadow-black/20">
      <div className="relative h-full">
        <div
          ref={mapContainerRef}
          className="w-full h-full min-h-[320px] md:min-h-[360px] z-0"
          style={{ background: "#dbeafe" }}
        />

        <div className="absolute right-4 top-4 z-30 flex flex-col gap-2">
          {onLocateCurrentLocation && (
            <Button
              type="button"
              onClick={onLocateCurrentLocation}
              className="h-9 gap-2 px-3 text-xs border border-slate-700 bg-slate-950 text-white shadow-lg backdrop-blur hover:bg-slate-800"
            >
              <Navigation className="h-3.5 w-3.5" />
              Farm shops near my current location
            </Button>
          )}

          {onLocateProfileLocation && (
            <Button
              type="button"
              onClick={onLocateProfileLocation}
              className="h-9 gap-2 px-3 text-xs border border-emerald-400 bg-emerald-600 text-white shadow-lg backdrop-blur hover:bg-emerald-500"
            >
              <Navigation className="h-3.5 w-3.5" />
              Farm shops near my address
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
