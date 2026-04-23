import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, FeatureGroup, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { MapPin, Check, Undo } from "lucide-react";
import { toast } from "sonner";

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Fix for 'ReferenceError: type is not defined' in react-leaflet-draw's readableArea
if (typeof window !== 'undefined') {
  (window as any).type = (window as any).type || '';
}

interface FarmDrawerProps {
  onSave: (coordinates: Array<{ lat: number; lng: number }>) => void;
  onCancel: () => void;
}

// Component to handle map centering
function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 18);
    }
  }, [center, map]);
  return null;
}

export function FarmDrawer({ onSave, onCancel }: FarmDrawerProps) {
  const { t } = useTranslation();
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [drawnLayers, setDrawnLayers] = useState<L.Layer[]>([]);
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    // Get current location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location", error);
          toast.error(t("farmDrawer.gpsError"));
          setMapCenter([20.5937, 78.9629]); // India center
        },
      );
    } else {
      setMapCenter([20.5937, 78.9629]);
    }
  }, []);

  const _onCreated = (e: any) => {
    const layer = e.layer;
    setDrawnLayers((layers) => [...layers, layer]);
  };

  const _onDeleted = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: L.Layer) => {
      setDrawnLayers((prev) => prev.filter((l) => l !== layer));
    });
  };

  const handleSave = () => {
    if (drawnLayers.length === 0) {
      toast.error(t("farmDrawer.drawBoundaryFirst"));
      return;
    }

    const layer = drawnLayers[drawnLayers.length - 1]; // Take the latest
    if (layer instanceof L.Polygon) {
      const latLngs = (layer.getLatLngs()[0] as L.LatLng[]).map((ll) => ({
        lat: ll.lat,
        lng: ll.lng,
      }));
      onSave(latLngs);
    } else if (layer instanceof L.Rectangle) {
      const latLngs = (layer.getLatLngs()[0] as L.LatLng[]).map((ll) => ({
        lat: ll.lat,
        lng: ll.lng,
      }));
      onSave(latLngs);
    } else {
      toast.error(t("farmDrawer.drawPolygonOrRectangle"));
    }
  };

  if (!mapCenter)
    return <div className="p-8 text-center">{t("farmDrawer.loadingMaps")}</div>;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">{t("farmDrawer.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("farmDrawer.subtitle")}
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={onCancel} size="sm">
            <Undo className="w-4 h-4 mr-2" />
            {t("farmDrawer.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2" />
            {t("farmDrawer.saveBoundary")}
          </Button>
        </div>
      </div>

      <div className="h-[500px] w-full border rounded-lg overflow-hidden relative">
        <MapContainer
          center={mapCenter}
          zoom={18}
          maxZoom={22}
          style={{ height: "100%", width: "100%" }}
        >
          <MapController center={mapCenter} />

          <TileLayer
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            attribution="Map data &copy; Google"
            maxNativeZoom={20}
            maxZoom={22}
          />

          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topright"
              onCreated={_onCreated}
              onDeleted={_onDeleted}
              draw={{
                rectangle: true,
                polygon: {
                  allowIntersection: false,
                  showArea: true,
                },
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>

        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 p-2 rounded shadow text-xs">
          <strong>{t("farmDrawer.tipTitle")}:</strong>{" "}
          {t("farmDrawer.tipLine1")}
          <br />
          {t("farmDrawer.tipLine2")}
        </div>
      </div>
    </Card>
  );
}
