import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Phone } from "lucide-react";
import { NearbySuppliersMap } from "@/components/NearbySuppliersMap";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { getProfileLocation } from "@/lib/profile-utils";
import {
  geocodeAddressWithGoogle,
  searchNearbyFarmShops,
  type LatLng,
  type NearbyFarmShop,
} from "@/lib/googlePlaces";

const SeedFinder = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuthStore();

  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [mapLocation, setMapLocation] = useState<LatLng | null>(null);
  const [shops, setShops] = useState<NearbyFarmShop[]>([]);
  const [activeShopId, setActiveShopId] = useState<string | null>(null);

  const profileLocation = useMemo(() => getProfileLocation(user?.email), [user?.email]);

  const fetchShops = async (origin: LatLng, label: string) => {
    setIsLoadingShops(true);
    setHasSearched(true);
    try {
      const results = await searchNearbyFarmShops(origin);
      setShops(results);
      setActiveShopId(null);
      setMapLocation(origin);

      toast({
        title: t("seeds.toasts.found"),
        description:
          results.length > 0
            ? t("seedFinder.showingResults", { count: results.length })
            : t("seedFinder.noNearbyShops"),
        className: "bg-green-600 text-white border-none",
      });
    } catch (error) {
      console.error("Failed to load nearby shops", error);
      toast({
        title: t("common.error"),
        description:
          error instanceof Error ? error.message : t("seedFinder.searchError"),
        variant: "destructive",
      });
    } finally {
      setIsLoadingShops(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: t("common.error"),
        description: t("seeds.toasts.permDeniedDesc"),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("seeds.toasts.locating"),
      description: t("seeds.toasts.locatingDesc"),
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const origin = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        await fetchShops(origin, "Current location");
      },
      (error) => {
        console.error("Geolocation error", error);
        toast({
          title: t("seeds.toasts.permDenied"),
          description: t("seeds.toasts.permDeniedDesc"),
          variant: "destructive",
        });
      },
    );
  };

  const handleProfileLocation = async () => {
    if (!profileLocation?.fullAddress) {
      toast({
        title: t("common.error"),
        description: "No saved address found in your profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      const origin = await geocodeAddressWithGoogle(
        profileLocation.fullAddress,
      );
      await fetchShops(origin, profileLocation.fullAddress);
    } catch (error) {
      console.error("Profile location search failed", error);
      toast({
        title: t("common.error"),
        description: "Unable to search shops near your saved address.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let isActive = true;

    const initialize = async () => {
      if (profileLocation?.fullAddress) {
        try {
          const origin = await geocodeAddressWithGoogle(
            profileLocation.fullAddress,
          );
          if (!isActive) return;
          setMapLocation(origin);
          return;
        } catch (error) {
          console.error("Profile location search failed", error);
        }
      }
    };

    void initialize();

    return () => {
      isActive = false;
    };
  }, [profileLocation?.fullAddress]);

  const sortedShops = [...shops].sort(
    (a, b) => (parseFloat(a.distance) || 999) - (parseFloat(b.distance) || 999),
  );

  const activeShop =
    sortedShops.find((shop) => shop.id === activeShopId) ||
    sortedShops[0] ||
    null;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-green-500/30">
      <Navbar />

      <main className="container mx-auto px-4 py-24 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            {t("seedFinder.title")}
          </h1>
          <p className="mt-2 text-slate-400 text-lg">
            {t("seedFinder.subtitle")}
          </p>
        </div>

        <div className="space-y-6">
          <div className="mx-auto w-full lg:w-[70%] h-[360px] md:h-[420px]">
            <NearbySuppliersMap
              suppliers={sortedShops as any}
              userLocation={mapLocation || undefined}
              activeSupplier={activeShop as any}
              onLocateCurrentLocation={handleCurrentLocation}
              onLocateProfileLocation={handleProfileLocation}
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <h2 className="text-xl font-semibold text-white">
              {t("seedFinder.nearbyShops")}
            </h2>
          </div>

          {!hasSearched ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-10 text-center text-slate-300">
              <p className="text-lg font-medium text-white">
                {t("seedFinder.notSearched")}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {t("seedFinder.searchHint")}
              </p>
            </div>
          ) : sortedShops.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-10 text-center text-slate-300">
              <p className="text-lg font-medium text-white">
                {t("seedFinder.noShopsFound")}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {t("seedFinder.tryAnotherLocation")}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedShops.map((shop) => (
                <Card
                  key={shop.id}
                  className={`bg-slate-900 border-slate-800 hover:border-slate-700 transition-all group ${activeShopId === shop.id ? "ring-1 ring-emerald-500/50 border-emerald-500/40" : ""}`}
                  onMouseEnter={() => setActiveShopId(shop.id)}
                  onMouseLeave={() => setActiveShopId(activeShop?.id || null)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="outline"
                        className="border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                      >
                        {t("seedFinder.farmingShop")}
                      </Badge>
                      <span className="text-slate-400 text-sm flex items-center gap-1">
                        <Navigation className="w-3 h-3" /> {shop.distance}{" "}
                        {t("seeds.unit.km")}
                      </span>
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-green-400 transition-colors">
                      {shop.name}
                    </CardTitle>
                    <CardDescription className="text-slate-400 flex items-start gap-2 mt-1">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />{" "}
                      {shop.address}
                    </CardDescription>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="border border-amber-500/30 bg-amber-500/15 text-amber-300">
                        ⭐ {shop.rating || "4.0"}
                      </Badge>
                      <Badge className="border border-sky-500/30 bg-sky-500/15 text-sky-300">
                        {shop.businessStatus || "Open now"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="border border-emerald-500/30 bg-emerald-500/15 text-emerald-300">
                        {shop.type}
                      </Badge>
                      {shop.businessStatus && (
                        <Badge className="border border-sky-500/30 bg-sky-500/15 text-sky-300">
                          {shop.businessStatus}
                        </Badge>
                      )}
                      {shop.phone && (
                        <Badge className="border border-slate-700 bg-slate-800 text-slate-200">
                          {shop.phone}
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-3 pt-4 border-t border-slate-800">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.open(shop.googleMapsUrl, "_blank")}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {t("seedFinder.viewOnMaps")}
                    </Button>
                    <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          {t("seedFinder.phoneNumber")}
                        </span>
                        <span className="text-sm font-medium text-slate-200">
                          {shop.phone || t("seedFinder.notAvailable")}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        className="border-slate-700 hover:bg-slate-800"
                        onClick={() =>
                          window.open(`tel:${shop.phone || ""}`, "_self")
                        }
                        disabled={!shop.phone}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {t("seedFinder.callToShop")}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SeedFinder;
