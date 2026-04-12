import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Search,
  Navigation,
  Phone,
  AlertCircle,
  Sprout,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

type NearbyShop = {
  id: string;
  name: string;
  address: string;
  rating?: number;
  phone?: string;
  mapsUrl?: string;
  type?: string;
  distanceKm?: number;
  location: { lat: number; lng: number };
};

const GOOGLE_MAPS_SCRIPT_ID = "agrisphere-google-maps";
const PLANT_MARKER_ICON_URL = "/images/plant.png";
const DEFAULT_TEXT_QUERY =
  "seed shop fertilizer shop nursery agriculture store";
const DEFAULT_MAP_CENTER = {
  lat: 22.9734,
  lng: 78.6569,
};

const getGoogleMapApiKey = () => import.meta.env.VITE_GOOGLE_MAP_API_KEY;

const loadGoogleMapsSdk = async () => {
  if ((window as any).google?.maps) return;

  const apiKey = getGoogleMapApiKey();
  if (!apiKey) throw new Error("Google Maps API key is missing");

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      GOOGLE_MAPS_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    if (existingScript) {
      if ((window as any).google?.maps) {
        resolve();
        return;
      }
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Google Maps failed to load")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });
};

const haversineKm = (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
) => {
  const earthRadiusKm = 6371;
  const deltaLat = (end.lat - start.lat) * (Math.PI / 180);
  const deltaLng = (end.lng - start.lng) * (Math.PI / 180);
  const lat1 = start.lat * (Math.PI / 180);
  const lat2 = end.lat * (Math.PI / 180);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.sin(deltaLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const SeedFinderLive = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [nearbyShops, setNearbyShops] = useState<NearbyShop[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Default map is loaded. Search seed shops or use the one-click default search.",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  const syncMapCenter = async (center: { lat: number; lng: number }) => {
    await loadGoogleMapsSdk();
    const google = (window as any).google;
    const { Map } = await google.maps.importLibrary("maps");

    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = new Map(mapRef.current, {
        center,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: true,
        gestureHandling: "greedy",
      });
    } else {
      mapInstanceRef.current?.setCenter(center);
    }

    return google;
  };

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.setMap?.(null));
      infoWindowRef.current?.close?.();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initDefaultMap = async () => {
      try {
        await syncMapCenter(DEFAULT_MAP_CENTER);
        if (!cancelled) {
          setStatusMessage(
            "Default map loaded. Search seed shops or use the one-click default search.",
          );
        }
      } catch (error: any) {
        if (!cancelled) {
          setErrorMessage(
            error?.message || "Unable to load the default Google Map preview.",
          );
        }
      }
    };

    void initDefaultMap();

    return () => {
      cancelled = true;
    };
  }, []);

  const searchNearby = async (textQuery: string) => {
    if (!navigator.geolocation) {
      toast({
        title: t("common.error"),
        description: "Location access is required for nearby shop search.",
        variant: "destructive",
      });
      return;
    }

    const queryText = textQuery.trim();

    if (!queryText) {
      toast({
        title: t("common.error"),
        description: "Enter a seed shop query or use the default search.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);
    setStatusMessage("Requesting location permission...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        try {
          setStatusMessage("Loading Google Maps and searching by text...");
          const google = await syncMapCenter(center);
          const placesLibrary = await google.maps.importLibrary("places");
          const Place = (placesLibrary as any).Place;

          const request = {
            textQuery: queryText,
            fields: [
              "displayName",
              "location",
              "businessStatus",
              "formattedAddress",
              "googleMapsURI",
              "rating",
              "nationalPhoneNumber",
              "primaryType",
              "types",
            ],
            includedType: "",
            useStrictTypeFiltering: true,
            locationBias: center,
            maxResultCount: 8,
            minRating: 1,
            language: "en-US",
            region: "in",
          };

          const response = await Place.searchByText(request);

          const results = (response?.places || []) as any[];

          if (!results.length) {
            setStatusMessage(
              "No new shops found for this query. Showing previous results on map.",
            );
            return;
          }

          const shops = results
            .map((place, index) => {
              const lat =
                typeof place.location?.lat === "function"
                  ? place.location.lat()
                  : place.location?.lat;
              const lng =
                typeof place.location?.lng === "function"
                  ? place.location.lng()
                  : place.location?.lng;
              const location = {
                lat: Number.isFinite(lat) ? lat : center.lat,
                lng: Number.isFinite(lng) ? lng : center.lng,
              };
              const name =
                place.displayName?.text ||
                place.displayName ||
                "Agricultural Shop";
              const address = place.formattedAddress || "Address unavailable";

              return {
                id: place.id || `${index}-${Date.now()}`,
                name,
                address,
                rating: place.rating,
                phone: place.nationalPhoneNumber,
                type: place.primaryType,
                mapsUrl:
                  place.googleMapsURI ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address)}`,
                location,
                distanceKm: haversineKm(center, location),
              } satisfies NearbyShop;
            })
            .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

          setNearbyShops(shops);

          const markerIcon = {
            url: PLANT_MARKER_ICON_URL,
            scaledSize: new google.maps.Size(34, 34),
            anchor: new google.maps.Point(17, 30),
          };

          markersRef.current.forEach((marker) => marker.setMap?.(null));
          markersRef.current = [];

          shops.forEach((shop, index) => {
            const marker = new google.maps.Marker({
              position: shop.location,
              map: mapInstanceRef.current,
              title: shop.name,
              icon: markerIcon,
            });

            const infoWindow =
              infoWindowRef.current || new google.maps.InfoWindow();
            infoWindowRef.current = infoWindow;

            const popupHtml = `
              <div style="min-width:220px;max-width:260px;padding:8px 10px;border-radius:10px;border:1px solid #bbf7d0;background:#f0fdf4;color:#14532d;font-family:Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.15)">
                <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${shop.name}</div>
                <div style="font-size:12px;line-height:1.4;color:#166534;">${shop.address}</div>
                <div style="font-size:12px;margin-top:6px;color:#15803d;">${shop.distanceKm?.toFixed(1)} km away</div>
              </div>
            `;

            marker.addListener("mouseover", () => {
              infoWindow.setContent(popupHtml);
              infoWindow.open(mapInstanceRef.current, marker);
            });

            marker.addListener("mouseout", () => {
              infoWindow.close();
            });

            marker.addListener("click", () => {
              infoWindow.setContent(popupHtml);
              infoWindow.open(mapInstanceRef.current, marker);
            });

            markersRef.current.push(marker);
          });

          setStatusMessage(
            `Showing ${shops.length} text search result${shops.length === 1 ? "" : "s"} near your location.`,
          );
        } catch (error: any) {
          console.error("Google Maps search failed", error);
          setNearbyShops([]);
          setErrorMessage(
            error?.message ||
              "Unable to load Google Maps text search right now.",
          );
          setStatusMessage("Google Maps text search could not be loaded.");
        } finally {
          setIsSearching(false);
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        setIsSearching(false);
        setErrorMessage(
          "Location permission is required to search nearby shops.",
        );
        toast({
          title: t("seeds.toasts.permDenied"),
          description: t("seeds.toasts.permDeniedDesc"),
          variant: "destructive",
        });
      },
    );
  };

  const handleSearchByInput = () => {
    const queryText = searchQuery.trim();
    if (!queryText) {
      toast({
        title: t("common.error"),
        description: "Type a shop name or keyword first.",
        variant: "destructive",
      });
      return;
    }

    void searchNearby(queryText);
  };

  const handleDefaultSearch = () => {
    void searchNearby(DEFAULT_TEXT_QUERY);
  };

  const filteredShops = nearbyShops.filter((shop) => {
    const query = searchQuery.toLowerCase();
    return (
      shop.name.toLowerCase().includes(query) ||
      shop.address.toLowerCase().includes(query) ||
      (shop.type || "").toLowerCase().includes(query) ||
      (shop.phone || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-green-500/30">
      <Navbar />

      <main className="container mx-auto px-4 py-24 max-w-7xl">
        <div className="mb-8 space-y-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-3 border border-green-500/20">
              <Search className="w-4 h-4" /> Live text search
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
              Seed Finder
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl">
              Allow live location access, enter a text query like seed shop or
              fertilizer shop, and we will show matching places on Google Maps.
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="bg-slate-900 border-slate-800 overflow-hidden min-h-[560px] w-full lg:w-[70%]">
              <CardContent className="p-0 h-full min-h-[560px] relative">
                <div ref={mapRef} className="absolute inset-0" />
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-950/30"
                    onClick={handleDefaultSearch}
                    disabled={isSearching}
                  >
                    <Sprout className="w-4 h-4 mr-2" />
                    {isSearching ? "Searching..." : "seed shops nearby me"}
                  </Button>
                </div>
                {!nearbyShops.length && (
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-slate-950/90">
                    <div className="max-w-sm space-y-3">
                      <MapPin className="w-10 h-10 mx-auto text-emerald-400" />
                      <p className="text-slate-300 font-medium">
                        Google map preview will appear here after you allow
                        location access.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4 md:p-5">
              <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                  <Input
                    placeholder="Search seed shop, fertilizer shop, nursery, agriculture store"
                    className="pl-10 h-12 bg-slate-950 border-slate-800 text-white text-base focus:ring-green-500/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearchByInput();
                      }
                    }}
                  />
                </div>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white gap-2 h-12 shrink-0 lg:px-6"
                  onClick={handleSearchByInput}
                  disabled={isSearching}
                >
                  <Navigation className="w-4 h-4" />
                  {isSearching ? "Searching..." : "Search shops"}
                </Button>
              </div>
              <div className="mt-3 text-sm text-slate-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                {statusMessage}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Matching shops
                  </h2>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                    Results appear below the map after you search from your live
                    location.
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="border-slate-700 text-slate-300 px-3 py-1 self-start md:self-auto"
                >
                  {filteredShops.length} result
                  {filteredShops.length === 1 ? "" : "s"}
                </Badge>
              </div>

              {errorMessage && (
                <div className="mb-5 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
                  {errorMessage}
                </div>
              )}

              {filteredShops.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredShops.map((shop) => (
                    <Card
                      key={shop.id}
                      className="bg-slate-950 border-slate-800 hover:border-emerald-500/40 transition-all group"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2 gap-3">
                          <Badge
                            variant="outline"
                            className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                          >
                            <Sprout className="w-3.5 h-3.5 mr-1" />
                            Seed shop
                          </Badge>
                          <span className="text-slate-400 text-sm flex items-center gap-1 whitespace-nowrap">
                            <Navigation className="w-3 h-3" />
                            {shop.distanceKm
                              ? `${shop.distanceKm.toFixed(1)} km`
                              : "--"}
                          </span>
                        </div>
                        <CardTitle className="text-lg text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                          <Sprout className="w-4 h-4 text-emerald-400" />
                          {shop.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400 flex items-start gap-2 mt-1">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />{" "}
                          {shop.address}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-0">
                        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                          {shop.rating ? (
                            <span>⭐ {shop.rating.toFixed(1)}</span>
                          ) : null}
                          {shop.type ? (
                            <span className="text-slate-500">{shop.type}</span>
                          ) : null}
                          {shop.phone ? <span>{shop.phone}</span> : null}
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 border-slate-700 hover:bg-slate-800"
                            onClick={() =>
                              shop.mapsUrl &&
                              window.open(shop.mapsUrl, "_blank")
                            }
                          >
                            <Navigation className="w-4 h-4 mr-2" /> Open in Maps
                          </Button>
                          {shop.phone && (
                            <Button
                              variant="outline"
                              className="flex-1 border-slate-700 hover:bg-slate-800"
                              onClick={() =>
                                window.open(`tel:${shop.phone}`, "_self")
                              }
                            >
                              <Phone className="w-4 h-4 mr-2" /> Call
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-slate-800 rounded-2xl bg-slate-950/30 text-slate-500 p-12 text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Use your location and a text query to load real Google Maps
                    results.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SeedFinderLive;
