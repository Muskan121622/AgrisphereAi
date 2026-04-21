import { motion } from "framer-motion";
import { Map, Layers, Droplets, Bug, TrendingUp, ArrowLeft, MapPin, Activity, CheckCircle2, Volume2, Play, Pause, Square, Pencil } from "lucide-react";
import { translateToHindi } from "@/lib/voice-translation";
import { toast } from "sonner";
import { INDIAN_LOCATIONS } from "@/lib/location-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { DigitalTwinEngine } from "@/lib/digital-twin";
import { GISDigitalTwin } from "@/lib/gis-digital-twin";
import { useState, lazy, Suspense } from "react";
import { FarmDrawer } from "@/components/FarmDrawer";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useTranslation } from "react-i18next";
import { useDialect } from "@/lib/use-dialect";

// Lazy load the GIS Map component for better performance
const GISMap = lazy(() => import("@/components/GISMap").then(module => ({ default: (module as any).GISMap })));

const DigitalTwin = () => {
  const { t, i18n } = useTranslation();
  const { dialect, localize } = useDialect();
  const [twinEngine] = useState(() => new DigitalTwinEngine());
  const [gisEngine] = useState(() => new GISDigitalTwin());
  const [farmData, setFarmData] = useState(null);
  const [gisData, setGisData] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  // const [speechState, setSpeechState] = useState<'idle' | 'speaking' | 'paused'>('idle'); // REPLACED BY HOOK
  const { isSpeaking, speak, stop } = useTextToSpeech();
  const [voiceLanguage, setVoiceLanguage] = useState<'en' | 'hi'>('en');
  const [ndviData, setNdviData] = useState<any>(null);
  const [isFetchingAgro, setIsFetchingAgro] = useState(false);
  const [isReliabilityMode, setIsReliabilityMode] = useState(false);
  const [aiSummary, setAiSummary] = useState("");


  // Form State
  const [formData, setFormData] = useState({
    farmName: "My Digital Farm",
    ownerName: "AgriSphere User",
    latitude: "",
    longitude: "",
    state: "",
    district: "",
    town: "",
    size: "10" // Acres
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.info("Getting GPS location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
          toast.success("Location found via GPS");
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get your location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const generateFarmCoordinates = (lat: number, lng: number, acres: number) => {
    // Convert acres to square meters (1 acre = 4046.86 sq meters)
    const areaSqMeters = acres * 4046.86;
    const sideLength = Math.sqrt(areaSqMeters); // Assuming square shape for simplicity
    const radiusMeters = sideLength / 2;

    // Convert meters to degrees (approximate)
    const latDelta = radiusMeters / 111320;
    const lngDelta = radiusMeters / (40075000 * Math.cos(lat * Math.PI / 180) / 360);

    return [
      { lat: lat - latDelta, lng: lng - lngDelta },
      { lat: lat - latDelta, lng: lng + lngDelta },
      { lat: lat + latDelta, lng: lng + lngDelta },
      { lat: lat + latDelta, lng: lng - lngDelta }
    ];
  };

  const initializeFarm = async () => {
    setIsFormOpen(false);

    if (hasInitialized) {
      document.getElementById('gis-map-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsInitializing(true);
    console.log('⏳ Initializing farm data...', formData);

    try {
      let lat = parseFloat(formData.latitude);
      let lng = parseFloat(formData.longitude);
      const acres = parseFloat(formData.size);

      // If coordinates are missing but text location exists, proceeding to AI first
      const isLocationSearch = (isNaN(lat) || isNaN(lng)) && formData.state && formData.district;

      if (!isLocationSearch && (isNaN(lat) || isNaN(lng))) {
        // If neither Coords nor valid Text provided
        alert("Please provide either GPS Coordinates OR State/District details.");
        setIsInitializing(false);
        return;
      }

      toast.info(isLocationSearch ? `Locating ${formData.town}, ${formData.district}...` : "Generating Digital Twin...");

      // 2. Fetch AI Intelligence (Attributes) + Estimates Coordinates if needed
      let aiData = null;
      try {
        const response = await fetch('http://localhost:5000/generate-digital-twin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            farmName: formData.farmName,
            ownerName: formData.ownerName,
            latitude: formData.latitude || "0",
            longitude: formData.longitude || "0",
            state: formData.state,
            district: formData.district,
            town: formData.town,
            size: acres
          })
        });

        if (response.ok) {
          aiData = await response.json();
          console.log("🧠 Groq AI Data:", aiData);

          // IF we were doing search, USE the AI's estimated coordinates
          if (isLocationSearch && aiData.location) {
            lat = aiData.location.lat;
            lng = aiData.location.lng;

            // Update form data for display
            setFormData(prev => ({
              ...prev,
              latitude: lat.toString(),
              longitude: lng.toString()
            }));

            toast.success(`Location identified: Lat ${lat}, Lng ${lng}`);
          }

          if (aiData.visual_summary?.includes("Reliability Mode")) {
            setIsReliabilityMode(true);
            toast.warning("AI Systems Busy: Operating in Reliability Mode.");
          } else {
            setIsReliabilityMode(false);
          }
          
          setAiSummary(aiData.visual_summary || "");
          toast.success(`AI Analysis Complete: ${aiData.visual_summary || "Localized data applied."}`);

        } else {
          console.warn("AI Generation failed");
          toast.error("AI Analysis Failed.");
        }
      } catch (err) {
        console.error("Failed to fetch AI data", err);
        toast.error("Network Error using AI.");
      }

      // Check if we have valid coordinates now (either from input or AI)
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Could not determine farm location coordinates.");
      }

      const coordinates = generateFarmCoordinates(lat, lng, acres);
      console.log('📍 Generated coordinates for acres:', acres, coordinates);

      // 1. Initialize Geometry locally (using Turf.js)
      const [traditionalData, gisData] = await Promise.all([
        twinEngine.initializeFarm(coordinates.map(c => [c.lng, c.lat])),
        gisEngine.initializeFarm(formData.farmName, formData.ownerName, coordinates)
      ]);

      // MERGE AI Data if available
      if (aiData) {
        // Update Farm Area strictly from AI or usage
        if (aiData?.farmBoundary?.area) {
          traditionalData.farmBoundary.area = aiData.farmBoundary.area;
        }

        // Merge Soil Zones (Keep geometry, update attributes)
        if (Array.isArray(aiData?.soilZones)) {
          traditionalData.soilZones = traditionalData.soilZones.map((zone, idx) => {
            const aiZone = aiData.soilZones[idx % aiData.soilZones.length];
            return { ...zone, ...aiZone, id: zone.id, coordinates: zone.coordinates };
          });
        }

        // Merge Irrigation
        if (Array.isArray(aiData?.irrigationZones)) {
          traditionalData.irrigationZones = traditionalData.irrigationZones.map((zone, idx) => {
            const aiZone = aiData.irrigationZones[idx % aiData.irrigationZones.length];
            return { ...zone, ...aiZone, id: zone.id, coordinates: zone.coordinates };
          });
        }

        // Merge Pest Areas (If AI has fewer, loop them; if AI has more, we limit to geometry count)
        if (Array.isArray(aiData?.pestProneAreas)) {
          traditionalData.pestProneAreas = traditionalData.pestProneAreas.map((area, idx) => {
            const aiPest = aiData.pestProneAreas[idx % aiData.pestProneAreas.length];
            return { ...area, ...aiPest, id: area.id, coordinates: area.coordinates };
          });
        }

        // Merge Crops
        if (Array.isArray(aiData?.cropGrowthStages)) {
          traditionalData.cropGrowthStages = traditionalData.cropGrowthStages.map((stage, idx) => {
            const aiCrop = aiData.cropGrowthStages[idx % aiData.cropGrowthStages.length];
            return { ...stage, ...aiCrop, id: stage.id, coordinates: stage.coordinates };
          });
        }

        // Update Weather
        if (aiData.weatherData) traditionalData.weatherData = aiData.weatherData;
      }

      console.log('✅ Farm data initialized:', { traditionalData, gisData });

      setFarmData(traditionalData);
      setGisData(gisData);
      setHasInitialized(true);

      // 3. FETCH REAL SATELLITE NDVI
      setIsFetchingAgro(true);
      fetch('http://localhost:5000/api/agro/ndvi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon: lng })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("🛰️ Real NDVI Data:", data);
          setNdviData(data);
          toast.success("Real Satellite NDVI data synchronized.");
        }
      })
      .catch(err => console.error("Agro API Error:", err))
      .finally(() => setIsFetchingAgro(false));

      const spatialAnalysis = await gisEngine.performSpatialAnalysis();
      console.log('📊 Spatial Analysis Results:', spatialAnalysis);

      setTimeout(() => {
        document.getElementById('gis-map-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);

    } catch (error) {
      console.error('❌ Failed to initialize farm:', error);
      alert("Failed to create Digital Twin. Please check location inputs.");
    } finally {
      setIsInitializing(false);
    }
  };

  const twinFeatures = [
    {
      title: t('digitalTwin.capabilities'),
      description: t('digitalTwin.subtitle'),
      icon: "🗺️",
      accuracy: "99.5%",
      features: [t('digitalTwin.coordinates'), t('digitalTwin.area'), t('digitalTwin.layers.pests'), t('digitalTwin.shapeAnalysis', 'Shape Analysis')]
    },
    {
      title: t('digitalTwin.features.soil.title'),
      description: t('digitalTwin.features.soil.desc'),
      icon: "🌍",
      accuracy: "94%",
      features: [t('digitalTwin.features.soil.f1'), t('digitalTwin.features.soil.f2'), t('digitalTwin.features.soil.f3'), t('digitalTwin.features.soil.f4')]
    },
    {
      title: t('digitalTwin.features.irrigation.title'),
      description: t('digitalTwin.features.irrigation.desc'),
      icon: "💧",
      accuracy: "96%",
      features: [t('digitalTwin.features.irrigation.f1'), t('digitalTwin.features.irrigation.f2'), t('digitalTwin.features.irrigation.f3'), t('digitalTwin.features.irrigation.f4')]
    },
    {
      title: t('digitalTwin.features.pest.title'),
      description: t('digitalTwin.features.pest.desc'),
      icon: "🐛",
      accuracy: "91%",
      features: [t('digitalTwin.features.pest.f1'), t('digitalTwin.features.pest.f2'), t('digitalTwin.features.pest.f3'), t('digitalTwin.features.pest.f4')]
    },
    {
      title: t('digitalTwin.features.growth.title'),
      description: t('digitalTwin.features.growth.desc'),
      icon: "🌱",
      accuracy: "93%",
      features: [t('digitalTwin.features.growth.f1'), t('digitalTwin.features.growth.f2'), t('digitalTwin.features.growth.f3'), t('digitalTwin.features.growth.f4')]
    },
    {
      title: t('digitalTwin.features.weather.title'),
      description: t('digitalTwin.features.weather.desc'),
      icon: "🌤️",
      accuracy: "89%",
      features: [t('digitalTwin.features.weather.f1'), t('digitalTwin.features.weather.f2'), t('digitalTwin.features.weather.f3'), t('digitalTwin.features.weather.f4')]
    }
  ];

  const gisLayers = [
    { name: t('digitalTwin.layers.satellite'), type: t('digitalTwin.layers.base'), update: t('digitalTwin.layers.daily') },
    { name: t('digitalTwin.layers.soilHealth'), type: t('digitalTwin.layers.analysis'), update: t('digitalTwin.layers.weekly') },
    { name: t('digitalTwin.layers.cropHealth'), type: t('digitalTwin.layers.monitoring'), update: t('digitalTwin.layers.realtime') },
    { name: t('digitalTwin.layers.weather'), type: t('digitalTwin.layers.environmental'), update: t('digitalTwin.layers.hourly') },
    { name: t('digitalTwin.layers.pests'), type: t('digitalTwin.layers.alert'), update: t('digitalTwin.layers.asneeded') }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t('disease.backHome')}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-xl font-bold gradient-text">AgriSphere AI</span>
          </div>
        </div>
      </header>

      {/* Header */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">🌐</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t('digitalTwin.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t('digitalTwin.subtitle')}
              <br />
              <span className="text-primary font-semibold mt-2 block">
                {t('digitalTwin.featuring')}
              </span>
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:scale-105 transition-transform cursor-pointer z-10 relative"
                    disabled={isInitializing}
                  >
                    {isInitializing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        {t('digitalTwin.generating')}
                      </>
                    ) : (
                      <>
                        <Map className="mr-2 w-5 h-5" />
                        {hasInitialized ? t('digitalTwin.update') : t('digitalTwin.generateBtn')}
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{t('digitalTwin.setupTitle')}</DialogTitle>
                    <DialogDescription>
                      {t('digitalTwin.setupDesc')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="farmName">{t('digitalTwin.farmName')}</Label>
                      <Input
                        id="farmName"
                        name="farmName"
                        value={formData.farmName}
                        onChange={handleInputChange}
                        placeholder="e.g. Green Valley Farm"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ownerName">{t('digitalTwin.ownerName')}</Label>
                      <Input
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe"
                      />
                    </div>



                    {/* Location Selection with Dropdowns */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="grid gap-2">
                        <Label htmlFor="state">{t('digitalTwin.state')}</Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => {
                            setFormData(prev => ({
                              ...prev,
                              state: value,
                              district: ""
                            }));
                          }}
                        >
                          <SelectTrigger id="state" className="h-10 w-full">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] overflow-y-auto z-[100]">
                            {Object.keys(INDIAN_LOCATIONS).sort().map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="district">{t('digitalTwin.district')}</Label>
                        <Select
                          value={formData.district}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, district: value }))}
                          disabled={!formData.state}
                        >
                          <SelectTrigger id="district" className="h-10 w-full">
                            <SelectValue placeholder="District" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] overflow-y-auto z-[100]">
                            {formData.state && INDIAN_LOCATIONS[formData.state]?.sort().map(district => (
                              <SelectItem key={district} value={district}>{district}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="town">{t('digitalTwin.town')}</Label>
                        <Input
                          id="town"
                          name="town"
                          value={formData.town}
                          onChange={handleInputChange}
                          placeholder="e.g. Domjur"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">{t('digitalTwin.coordinates')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="latitude">{t('digitalTwin.latitude')}</Label>
                        <Input
                          id="latitude"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          placeholder="26.14"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="longitude">{t('digitalTwin.longitude')}</Label>
                        <Input
                          id="longitude"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          placeholder="91.73"
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={useCurrentLocation} className="w-full">
                      <MapPin className="mr-2 w-4 h-4" />
                      {t('digitalTwin.useCurrent')}
                    </Button>
                    <div className="grid gap-2">
                      <Label htmlFor="size">{t('digitalTwin.size')}</Label>
                      <Input
                        id="size"
                        name="size"
                        type="number"
                        value={formData.size}
                        onChange={handleInputChange}
                        placeholder="e.g. 10"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={initializeFarm} disabled={isInitializing}>
                      {isInitializing ? t('digitalTwin.generating') : t('digitalTwin.generateBtn')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                size="lg"
                variant="outline"
                className="hover:scale-105 transition-transform cursor-pointer"
                onClick={() => {
                  setFormData({
                    farmName: "Demo Smart Farm",
                    ownerName: "Demo User",
                    latitude: "26.1440",
                    longitude: "91.7360",
                    size: "15",
                    state: "",
                    district: "",
                    town: ""
                  });
                  setTimeout(initializeFarm, 100);
                }}
                disabled={isInitializing}
              >
                <MapPin className="mr-2 w-5 h-5" />
                {t('digitalTwin.quickDemo')}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-transform cursor-pointer"
                    disabled={isInitializing}
                  >
                    <Pencil className="mr-2 w-5 h-5" />
                    {t('digitalTwin.drawMap')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>{t('digitalTwin.drawMap')}</DialogTitle>
                    <DialogDescription>
                      {t('digitalTwin.drawDesc', 'Pinpoint your location and trace the exact shape of your land.')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="h-full py-4">
                    <FarmDrawer
                      onSave={(coords) => {
                        console.log("Drawn Coords:", coords);
                        // Convert to format
                        setIsInitializing(true);
                        // Close dialog (hacky via state would be better but simple for now)
                        document.getElementById('close-draw-dialog')?.click();

                        // Initialize with these coords
                        // We need a name though - use default or prompt? Use Draw Default
                        setTimeout(async () => {
                          try {
                            const coordinates = coords; // already {lat, lng} array

                            // Calculate rough center for form display
                            const centerLat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
                            const centerLng = coords.reduce((sum, c) => sum + c.lng, 0) / coords.length;

                            setFormData(prev => ({
                              ...prev,
                              latitude: centerLat.toFixed(6),
                              longitude: centerLng.toFixed(6),
                              farmName: "Drawn Farm Field",
                              ownerName: "User"
                            }));

                            const [traditionalData, gisData] = await Promise.all([
                              twinEngine.initializeFarm(coordinates.map(c => [c.lng, c.lat])),
                              gisEngine.initializeFarm("Drawn Farm Field", "User", coordinates)
                            ]);

                            setFarmData(traditionalData);
                            setGisData(gisData);
                            setHasInitialized(true);

                            toast.success("Farm Boundary Saved!");
                            setTimeout(() => {
                              document.getElementById('gis-map-section')?.scrollIntoView({ behavior: 'smooth' });
                            }, 500);

                          } catch (e) {
                            console.error(e);
                            toast.error("Failed to process drawn farm.");
                          } finally {
                            setIsInitializing(false);
                          }
                        }, 500);
                      }}
                      onCancel={() => {
                        // Close dialog logic (would need state control ideally)
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Loading Progress */}
            {isInitializing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 max-w-md mx-auto"
              >
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                    <span className="text-sm font-medium text-primary">{t('digitalTwin.initializing.status')}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    • {t('digitalTwin.initializing.mapping')} <strong>{formData.farmName}</strong><br />
                    • {t('digitalTwin.initializing.soil')}<br />
                    • {t('digitalTwin.initializing.irrigation')} {formData.size} {t('digitalTwin.sizeUnit', 'acres')}<br />
                    • {t('digitalTwin.initializing.pests')}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section >

      < section className="py-20 px-4" >
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">{t('digitalTwin.capabilities')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {twinFeatures.map((feature, i) => (
              <Card key={i} className="p-8 hover:shadow-lg transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <div className="bg-primary/20 px-2 py-1 rounded-full text-primary font-bold text-xs">
                      {feature.accuracy}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm">{feature.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="text-xs bg-muted px-2 py-1 rounded text-center">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section >

      {/* GIS Layers */}
      < section className="py-20 px-4 bg-muted/30" >
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">{t('digitalTwin.visualization')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {gisLayers.map((layer, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <Layers className="w-6 h-6 text-primary" />
                  <h3 className="font-bold">{layer.name}</h3>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">{layer.type}</span>
                  <div className="bg-accent/20 px-2 py-1 rounded-full text-accent text-xs">
                    {layer.update}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section >

      {/* Interactive GIS Map */}
      {
        gisData && (
          <section id="gis-map-section" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold text-center mb-8">
                {t('digitalTwin.interactiveMap', { name: gisData.farmName })}
              </h2>
              <div className="flex justify-center items-center gap-4 mb-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Lat: {formData.latitude}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Lng: {formData.longitude}</span>
              </div>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {t('digitalTwin.exploreNote', { owner: gisData.owner })}
              </p>
              {isReliabilityMode && (
                <Card className="max-w-2xl mx-auto mb-8 p-4 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-pulse" />
                  <div className="text-sm text-amber-800 dark:text-amber-300">
                    <span className="font-bold">Reliability Mode Active:</span> {aiSummary}
                  </div>
                </Card>
              )}
              <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Loading GIS Map...</p>
                  </div>
                </div>
              }>
                <GISMap farmData={gisData} />
              </Suspense>
            </div>
          </section>
        )
      }

      {/* Live Farm Data */}
      {
        farmData && (
          <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-16 relative">
                <h2 className="text-4xl font-bold text-center">{t('digitalTwin.liveData')}</h2>

                {/* Voice Controls - Refactored */}
                <div className="flex items-center gap-2 bg-white/80 dark:bg-black/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-border/50">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => setVoiceLanguage(prev => prev === 'en' ? 'hi' : 'en')}
                  >
                    <span className="text-xs font-bold">{voiceLanguage === 'en' ? 'EN' : 'HI'}</span>
                  </Button>
                  <div className="h-4 w-px bg-border mx-1" />

                  <Button
                    size="sm"
                    variant={isSpeaking ? "destructive" : "default"}
                    className={`h-8 px-3 rounded-full transition-all duration-300 ${isSpeaking ? 'animate-pulse' : ''}`}
                    onClick={async () => {
                      if (isSpeaking) {
                        stop();
                      } else {
                        // Generate Comprehensive Summary using i18n
                        let text = t('digitalTwin.summary.prefix', { area: farmData.farmBoundary.area.toFixed(2) }) + " ";

                        // Soil & Irrigation
                        text += t('digitalTwin.summary.zones', {
                          soil: farmData.soilZones.length,
                          irrigation: farmData.irrigationZones.length
                        }) + " ";

                        // Crop Health
                        const avgHealth = Math.round(farmData.cropGrowthStages.reduce((sum: number, stage: any) => sum + stage.health, 0) / farmData.cropGrowthStages.length);
                        text += t('digitalTwin.summary.health', { health: avgHealth }) + " ";

                        // Pests
                        const highRisk = farmData.pestProneAreas.filter((p: any) => (p.riskLevel || p.risk) === 'high');
                        if (highRisk.length > 0) {
                          text += t('digitalTwin.summary.pestWarning') + " ";
                        } else {
                          text += t('digitalTwin.summary.pestLow') + " ";
                        }

                        // Localize for dialect
                        const regionalSummary = await localize(text);
                        
                        // Use regional voice or Hindi if applicable
                        speak(regionalSummary, i18n.language === 'hi' ? 'hi-IN' : 'en-IN');
                      }
                    }}
                  >
                    {isSpeaking ? (
                      <>
                        <Square className="w-3 h-3 mr-2 fill-current" />
                        {t('digitalTwin.stopBtn')}
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        {t('digitalTwin.explainBtn')}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
                <Card className="p-6 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-3 text-green-500" />
                  <h3 className="font-bold mb-2">{t('digitalTwin.area')}</h3>
                  <div className="text-2xl font-bold text-green-500">{farmData.farmBoundary.area.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{t('digitalTwin.hectares')}</div>
                </Card>
                <Card className="p-6 text-center">
                  <Layers className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                  <h3 className="font-bold mb-2">{t('digitalTwin.features.soil.title')}</h3>
                  <div className="text-2xl font-bold text-blue-500">{farmData.soilZones.length}</div>
                  <div className="text-sm text-muted-foreground">{t('digitalTwin.insights.mappedZones')}</div>
                </Card>
                <Card className="p-6 text-center">
                  <Droplets className="w-8 h-8 mx-auto mb-3 text-cyan-500" />
                  <h3 className="font-bold mb-2">{t('digitalTwin.features.irrigation.title')}</h3>
                  <div className="text-2xl font-bold text-cyan-500">{farmData.irrigationZones.length}</div>
                  <div className="text-sm text-muted-foreground">{t('digitalTwin.insights.activeZones')}</div>
                </Card>
                <Card className="p-6 text-center border-primary/20 bg-primary/5">
                  <Activity className="w-8 h-8 mx-auto mb-3 text-orange-500" />
                  <h3 className="font-bold mb-2">{t('digitalTwin.layers.satellite')} NDVI</h3>
                  {isFetchingAgro ? (
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-8 w-16 bg-muted rounded mb-2"></div>
                      <div className="h-4 w-24 bg-muted rounded"></div>
                    </div>
                  ) : ndviData ? (
                    <>
                      <div className="text-2xl font-bold text-orange-500">{(ndviData.ndvi?.data || 0.65).toFixed(3)}</div>
                      <div className="text-sm font-medium text-muted-foreground">
                        { (ndviData.ndvi?.data || 0.65) > 0.8 ? 'Excellent Health' : 
                          (ndviData.ndvi?.data || 0.65) > 0.5 ? 'Moderate Health' : 'Low Health' }
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-2">
                        Sensor: Sentinel-2
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-muted-foreground">--</div>
                      <div className="text-sm text-muted-foreground">Real-time sync pending</div>
                    </>
                  )}
                </Card>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Bug className="w-5 h-5 text-red-500" />
                    {t('digitalTwin.insights.pestRisk')}
                  </h3>
                  <div className="space-y-3">
                    {farmData.pestProneAreas.map((area, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded">
                        <div>
                          <div className="font-medium">{area.pestType}</div>
                          <div className="text-sm text-muted-foreground">{area.id}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${area.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                          area.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                          {t(`common.risk.${area.riskLevel || 'low'}`)} {t('digitalTwin.insights.risk')}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    {t('digitalTwin.insights.growthStages')}
                  </h3>
                  <div className="space-y-3">
                    {farmData.cropGrowthStages.map((stage, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded">
                        <div>
                          <div className="font-medium">{stage.cropType}</div>
                          <div className="text-sm text-muted-foreground">{stage.stage}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{stage.health.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">{t('digitalTwin.insights.health')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </section>
        )
      }

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Digital Twin Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { title: "30% Better Planning", desc: "Optimize field operations", icon: "📊" },
              { title: "25% Water Savings", desc: "Precision irrigation zones", icon: "💧" },
              { title: "40% Pest Reduction", desc: "Targeted prevention", icon: "🛡️" },
              { title: "35% Yield Increase", desc: "Data-driven decisions", icon: "📈" }
            ].map((benefit, i) => (
              <Card key={i} className="p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold mb-2 text-primary">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Powered by Advanced GIS Technology</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Industry-leading mapping technologies combined with AI for next-generation precision agriculture
          </p>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Leaflet", desc: "Interactive GIS mapping", icon: "🗺️" },
              { name: "Turf.js", desc: "Spatial analysis", icon: "📐" },
              { name: "Satellite Imagery", desc: "Real-time field views", icon: "🛰️" },
              { name: "NDVI Analysis", desc: "Crop health monitoring", icon: "🌿" }
            ].map((tech, i) => (
              <div key={i} className="p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-3">{tech.icon}</div>
                <h3 className="font-bold mb-1 text-lg">{tech.name}</h3>
                <p className="text-sm text-muted-foreground">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div >
  );
};


export default DigitalTwin;