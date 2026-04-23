import { API_BASE_URL } from '@/config/api';
/**
 * GIS-Based Smart Farm Digital Twin System
 * Advanced mapping and spatial analysis for precision agriculture
 */

import * as turf from '@turf/turf';

export interface GISCoordinate {
  lat: number;
  lng: number;
  elevation?: number;
}

export interface FieldBoundary {
  id: string;
  name: string;
  coordinates: GISCoordinate[];
  area: number; // hectares
  perimeter: number; // meters
  centroid: GISCoordinate;
  cropType?: string;
  plantingDate?: Date;
  expectedHarvest?: Date;
}

export interface SoilZone {
  id: string;
  name: string;
  coordinates: GISCoordinate[];
  soilType: 'clay' | 'sandy' | 'loamy' | 'silt' | 'mixed';
  ph: number;
  organicMatter: number;
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  fertility: 'low' | 'medium' | 'high';
  drainage: 'poor' | 'moderate' | 'good' | 'excellent';
  recommendations: string[];
}

export interface IrrigationZone {
  id: string;
  name: string;
  coordinates: GISCoordinate[];
  type: 'drip' | 'sprinkler' | 'flood' | 'manual' | 'pivot';
  efficiency: number; // percentage
  waterRequirement: number; // liters per day
  schedule: {
    time: string;
    duration: number; // minutes
    frequency: 'daily' | 'alternate' | 'weekly';
  }[];
  status: 'active' | 'inactive' | 'maintenance';
}

export interface PestProneArea {
  id: string;
  name: string;
  coordinates: GISCoordinate[];
  pestType: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastInfestation: Date;
  preventiveMeasures: string[];
  monitoringSchedule: string;
  treatmentHistory: {
    date: Date;
    treatment: string;
    effectiveness: number;
  }[];
}

export interface CropGrowthZone {
  id: string;
  name: string;
  coordinates: GISCoordinate[];
  cropType: string;
  variety: string;
  stage: 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest' | 'fallow';
  plantingDate: Date;
  expectedHarvest: Date;
  health: number; // 0-100
  yieldPrediction: number;
  ndvi: number; // Normalized Difference Vegetation Index
  stressFactors: string[];
}

export interface WeatherMicroclimate {
  id: string;
  name: string;
  coordinates: GISCoordinate;
  temperature: {
    current: number;
    min: number;
    max: number;
    average: number;
  };
  humidity: number;
  rainfall: {
    current: number;
    weekly: number;
    monthly: number;
  };
  windSpeed: number;
  windDirection: number;
  solarRadiation: number;
  evapotranspiration: number;
  frostRisk: 'none' | 'low' | 'medium' | 'high';
}

export interface DigitalTwinData {
  farmId: string;
  farmName: string;
  owner: string;
  location: GISCoordinate;
  totalArea: number;
  fieldBoundaries: FieldBoundary[];
  soilZones: SoilZone[];
  irrigationZones: IrrigationZone[];
  pestProneAreas: PestProneArea[];
  cropGrowthZones: CropGrowthZone[];
  weatherMicroclimates: WeatherMicroclimate[];
  infrastructure: {
    roads: GISCoordinate[][];
    buildings: {
      type: 'storage' | 'processing' | 'office' | 'greenhouse';
      coordinates: GISCoordinate[];
    }[];
    waterSources: {
      type: 'well' | 'pond' | 'river' | 'canal';
      coordinates: GISCoordinate;
      capacity?: number;
    }[];
  };
  lastUpdated: Date;
}

export interface GISAnalysisResult {
  spatialAnalysis: {
    optimalCropZones: {
      cropType: string;
      suitabilityScore: number;
      recommendedArea: GISCoordinate[];
    }[];
    irrigationEfficiency: {
      currentEfficiency: number;
      optimizedLayout: IrrigationZone[];
      waterSavings: number;
    };
    pestRiskMapping: {
      highRiskAreas: GISCoordinate[][];
      preventiveZones: GISCoordinate[][];
      bufferZones: GISCoordinate[][];
    };
  };
  recommendations: {
    fieldManagement: string[];
    irrigation: string[];
    pestControl: string[];
    soilImprovement: string[];
  };
}

export class GISDigitalTwin {
  private farmData: DigitalTwinData | null = null;
  private mapboxToken: string = '';
  private leafletMap: any = null;

  constructor(mapboxToken?: string) {
    this.mapboxToken = mapboxToken || '';
  }

  async initializeFarm(
    farmName: string,
    owner: string,
    boundaryCoordinates: GISCoordinate[],
    aiIntelligence?: any
  ): Promise<DigitalTwinData> {
    console.log(`Initializing digital twin for ${farmName}...`);

    const farmBoundary = this.createFieldBoundary('main-field', farmName, boundaryCoordinates);
    const farmId = `farm-${Date.now()}`;

    this.farmData = {
      farmId,
      farmName,
      owner,
      location: farmBoundary.centroid,
      totalArea: farmBoundary.area,
      fieldBoundaries: [farmBoundary],
      soilZones: await this.generateSoilZones(farmBoundary, aiIntelligence?.soilZones),
      irrigationZones: await this.generateIrrigationZones(farmBoundary, aiIntelligence?.irrigationZones),
      pestProneAreas: await this.identifyPestProneAreas(farmBoundary, aiIntelligence?.pestProneAreas),
      cropGrowthZones: await this.generateCropGrowthZones(farmBoundary, aiIntelligence?.cropGrowthStages),
      weatherMicroclimates: await this.generateWeatherMicroclimates(farmBoundary, aiIntelligence?.weatherData),
      infrastructure: await this.generateInfrastructure(farmBoundary),
      lastUpdated: new Date()
    };

    return this.farmData;
  }

  private createFieldBoundary(id: string, name: string, coordinates: GISCoordinate[]): FieldBoundary {
    // Convert to turf coordinates format
    const turfCoords = coordinates.map(coord => [coord.lng, coord.lat]);
    turfCoords.push(turfCoords[0]); // Close the polygon

    const polygon = turf.polygon([turfCoords]);
    const area = turf.area(polygon) / 10000; // Convert to hectares
    const perimeter = turf.length(turf.polygonToLine(polygon), { units: 'meters' });
    const centroidPoint = turf.centroid(polygon);

    return {
      id,
      name,
      coordinates,
      area: Math.round(area * 100) / 100,
      perimeter: Math.round(perimeter),
      centroid: {
        lat: centroidPoint.geometry.coordinates[1],
        lng: centroidPoint.geometry.coordinates[0]
      }
    };
  }

  private async generateSoilZones(boundary: FieldBoundary, aiSoils?: any[]): Promise<SoilZone[]> {
    const zones: SoilZone[] = [];
    const fallbackSoilTypes: ('clay' | 'sandy' | 'loamy' | 'silt')[] = ['clay', 'sandy', 'loamy', 'silt'];
    const soilTypesFromAI = aiSoils?.map(s => s.soilType?.toLowerCase() || 'loamy') || [];

    // Create a grid-based soil zone mapping
    const bbox = this.getBoundingBox(boundary.coordinates);
    const gridSize = 4; // 4x4 grid
    const cellWidth = (bbox.maxLng - bbox.minLng) / gridSize;
    const cellHeight = (bbox.maxLat - bbox.minLat) / gridSize;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cellCoords: GISCoordinate[] = [
          { lat: bbox.minLat + j * cellHeight, lng: bbox.minLng + i * cellWidth },
          { lat: bbox.minLat + j * cellHeight, lng: bbox.minLng + (i + 1) * cellWidth },
          { lat: bbox.minLat + (j + 1) * cellHeight, lng: bbox.minLng + (i + 1) * cellWidth },
          { lat: bbox.minLat + (j + 1) * cellHeight, lng: bbox.minLng + i * cellWidth }
        ];

        // Check if cell intersects with farm boundary
        if (this.polygonIntersects(cellCoords, boundary.coordinates)) {
          // Use AI soil types sequentially or fallback to random
          const soilTypeStr = soilTypesFromAI.length > 0 
            ? soilTypesFromAI[(i * gridSize + j) % soilTypesFromAI.length]
            : fallbackSoilTypes[Math.floor(Math.random() * fallbackSoilTypes.length)];
          
          const soilType = fallbackSoilTypes.includes(soilTypeStr as any) ? soilTypeStr as any : 'loamy';
          const soilProperties = this.getSoilProperties(soilType, aiSoils?.[ (i * gridSize + j) % aiSoils.length ]);

          zones.push({
            id: `soil-zone-${i}-${j}`,
            name: `${soilType.charAt(0).toUpperCase() + soilType.slice(1)} Zone ${i + 1}-${j + 1}`,
            coordinates: cellCoords,
            soilType,
            ...soilProperties,
            recommendations: this.getSoilRecommendations(soilType, soilProperties)
          });
        }
      }
    }

    return zones;
  }

  private getSoilProperties(soilType: string, aiProperties?: any) {
    const baseProperties = {
      clay: {
        ph: aiProperties?.ph || 6.8,
        organicMatter: aiProperties?.organicMatter || 3.2,
        fertility: 'high' as const,
        drainage: 'poor' as const,
        nutrients: aiProperties?.nutrients || { nitrogen: 45, phosphorus: 35, potassium: 180 }
      },
      sandy: {
        ph: aiProperties?.ph || 6.2,
        organicMatter: aiProperties?.organicMatter || 1.8,
        fertility: 'low' as const,
        drainage: 'excellent' as const,
        nutrients: aiProperties?.nutrients || { nitrogen: 25, phosphorus: 15, potassium: 80 }
      },
      loamy: {
        ph: aiProperties?.ph || 6.5,
        organicMatter: aiProperties?.organicMatter || 4.1,
        fertility: 'high' as const,
        drainage: 'good' as const,
        nutrients: aiProperties?.nutrients || { nitrogen: 55, phosphorus: 45, potassium: 220 }
      },
      silt: {
        ph: aiProperties?.ph || 7.1,
        organicMatter: aiProperties?.organicMatter || 2.9,
        fertility: 'medium' as const,
        drainage: 'moderate' as const,
        nutrients: aiProperties?.nutrients || { nitrogen: 35, phosphorus: 25, potassium: 150 }
      }
    };

    return baseProperties[soilType as keyof typeof baseProperties] || baseProperties.loamy;
  }

  private getSoilRecommendations(soilType: string, properties: any): string[] {
    const recommendations = {
      clay: [
        'Add organic matter to improve drainage and aeration',
        'Consider raised beds or ridges for better water management',
        'Avoid working soil when wet to prevent compaction',
        'Use cover crops to improve soil structure'
      ],
      sandy: [
        'Add compost and organic matter to improve water retention',
        'Use mulch to reduce water evaporation',
        'Apply fertilizers in smaller, frequent doses',
        'Consider drip irrigation for efficient water use'
      ],
      loamy: [
        'Maintain organic matter with regular compost additions',
        'This is ideal soil - continue current management practices',
        'Monitor pH levels and adjust as needed',
        'Rotate crops to maintain soil health'
      ],
      silt: [
        'Improve drainage with organic amendments',
        'Avoid overwatering to prevent waterlogging',
        'Add coarse organic matter for better structure',
        'Use conservation tillage practices'
      ]
    };

    return recommendations[soilType as keyof typeof recommendations] || [];
  }

  private async generateIrrigationZones(boundary: FieldBoundary, aiIrrigation?: any[]): Promise<IrrigationZone[]> {
    const zones: IrrigationZone[] = [];
    const irrigationTypes: ('drip' | 'sprinkler' | 'pivot')[] = ['drip', 'sprinkler', 'pivot'];

    // If AI provided zones, use them, otherwise divide boundary
    const numZones = aiIrrigation?.length || Math.min(6, Math.max(3, Math.floor(boundary.area / 2)));
    const zoneCoords = this.divideIntoZones(boundary.coordinates, numZones);

    zoneCoords.forEach((coords, index) => {
      const aiZ = aiIrrigation?.[index];
      const irrigationType = aiZ?.type?.toLowerCase() || irrigationTypes[index % irrigationTypes.length];
      const efficiency = aiZ?.efficiency || this.getIrrigationEfficiency(irrigationType);

      zones.push({
        id: `irrigation-zone-${index + 1}`,
        name: `${irrigationType.charAt(0).toUpperCase() + irrigationType.slice(1)} Zone ${index + 1}`,
        coordinates: coords,
        type: irrigationType as any,
        efficiency,
        waterRequirement: this.calculateWaterRequirement(coords, irrigationType),
        schedule: this.generateIrrigationSchedule(irrigationType),
        status: aiZ?.status || 'active'
      });
    });

    return zones;
  }

  private getIrrigationEfficiency(type: string): number {
    const efficiencies = {
      drip: 90 + Math.random() * 5, // 90-95%
      sprinkler: 75 + Math.random() * 10, // 75-85%
      pivot: 80 + Math.random() * 8, // 80-88%
      flood: 50 + Math.random() * 15, // 50-65%
      manual: 60 + Math.random() * 20 // 60-80%
    };

    return Math.round((efficiencies[type as keyof typeof efficiencies] || 70) * 10) / 10;
  }

  private calculateWaterRequirement(coordinates: GISCoordinate[], type: string): number {
    const area = this.calculatePolygonArea(coordinates);
    const baseRequirement = 5; // liters per square meter per day
    const typeMultiplier = {
      drip: 0.8,
      sprinkler: 1.0,
      pivot: 0.9,
      flood: 1.5,
      manual: 1.2
    };

    return Math.round(area * baseRequirement * (typeMultiplier[type as keyof typeof typeMultiplier] || 1.0));
  }

  private generateIrrigationSchedule(type: string) {
    const schedules = {
      drip: [
        { time: '06:00', duration: 30, frequency: 'daily' as const },
        { time: '18:00', duration: 30, frequency: 'daily' as const }
      ],
      sprinkler: [
        { time: '05:00', duration: 45, frequency: 'alternate' as const },
        { time: '19:00', duration: 45, frequency: 'alternate' as const }
      ],
      pivot: [
        { time: '02:00', duration: 120, frequency: 'weekly' as const }
      ]
    };

    return schedules[type as keyof typeof schedules] || schedules.sprinkler;
  }

  private async identifyPestProneAreas(boundary: FieldBoundary, aiPests?: any[]): Promise<PestProneArea[]> {
    const areas: PestProneArea[] = [];
    
    // Use AI pests if available, otherwise fallback to empty (realism)
    const pestsToMap = aiPests || [];

    for (let index = 0; index < pestsToMap.length; index++) {
      const pest = pestsToMap[index];
      // Create a risk polygon around a portion of the field
      const center = boundary.coordinates[index % boundary.coordinates.length];
      const radius = 50 + (Math.random() * 100); // meters
      
      const riskPolygon = this.createCircularArea(center, radius);

      areas.push({
        id: `pest-area-${index}`,
        name: `${pest.pestType || 'Unknown Pest'} Risk Zone`,
        pestType: pest.pestType || 'Unknown Pest',
        riskLevel: (pest.riskLevel?.toLowerCase() || 'medium') as any,
        coordinates: riskPolygon,
        lastInfestation: new Date(),
        preventiveMeasures: pest.preventiveMeasures || ['Monitor field'],
        monitoringSchedule: 'Daily visual inspection',
        treatmentHistory: []
      });
    }

    return areas;
  }

  private getPestPreventiveMeasures(pestType: string): string[] {
    const measures = {
      aphids: ['Regular monitoring', 'Beneficial insect release', 'Reflective mulch', 'Companion planting'],
      caterpillars: ['Pheromone traps', 'Bt spray application', 'Crop rotation', 'Natural predator conservation'],
      beetles: ['Trap crops', 'Row covers', 'Beneficial nematodes', 'Crop debris removal'],
      mites: ['Predatory mite release', 'Humidity management', 'Resistant varieties', 'Miticide rotation'],
      thrips: ['Blue sticky traps', 'Reflective mulch', 'Predatory insects', 'Weed management'],
      whiteflies: ['Yellow sticky traps', 'Reflective mulch', 'Parasitic wasps', 'Crop rotation']
    };

    return measures[pestType as keyof typeof measures] || ['Regular monitoring', 'Integrated pest management', 'Beneficial insects', 'Organic treatments'];
  }

  private getPestMonitoringSchedule(riskLevel: string): string {
    const schedules = {
      low: 'Weekly visual inspection',
      medium: 'Bi-weekly trap monitoring and visual inspection',
      high: 'Daily monitoring with traps and visual inspection'
    };

    return schedules[riskLevel as keyof typeof schedules];
  }

  private generateTreatmentHistory(pestType: string) {
    const treatments = [
      { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), treatment: 'Neem oil spray', effectiveness: 75 },
      { date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), treatment: 'Beneficial insect release', effectiveness: 85 },
      { date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), treatment: 'Organic pesticide', effectiveness: 70 }
    ];

    return treatments.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private async generateCropGrowthZones(boundary: FieldBoundary, aiCrops?: any[]): Promise<CropGrowthZone[]> {
    const zones: CropGrowthZone[] = [];
    
    // If AI provided crops, map them to quadrants
    const cropsToMap = aiCrops || [];
    const numCrops = cropsToMap.length || 1;
    const cropCoordsList = this.divideIntoZones(boundary.coordinates, numCrops);

    for (let index = 0; index < cropCoordsList.length; index++) {
      const coords = cropCoordsList[index];
      const aiC = cropsToMap[index % cropsToMap.length];
      const cropType = aiC?.cropType || 'Common Crop';
      const duration = 120; // Default duration
      const health = aiC?.health || 85;

      const plantingDate = aiC?.plantingDate ? new Date(aiC.plantingDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const expectedHarvest = new Date(plantingDate.getTime() + duration * 24 * 60 * 60 * 1000);

      const stressFactors = this.identifyStressFactors(coords);

      // ---------------------------------------------------------
      // REAL SATELLITE DATA INTEGRATION
      // ---------------------------------------------------------
      let ndvi = 0.4 + Math.random() * 0.45; // Default Simulation
      let realHealth = health;
      let isRealData = false;

      try {
        console.log(`Fetching real satellite data for ${cropType} Zone...`);

        // Prepare coordinates for API
        const apiCoords = coords.map(c => [c.lng, c.lat]);
        if (apiCoords[0][0] !== apiCoords[apiCoords.length - 1][0] || apiCoords[0][1] !== apiCoords[apiCoords.length - 1][1]) {
          apiCoords.push(apiCoords[0]);
        }

        const response = await fetch(`${API_BASE_URL}/analyze-satellite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ coordinates: apiCoords })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.ndvi) {
            ndvi = data.ndvi;
            realHealth = Math.min(100, Math.max(0, (ndvi * 100) + 10));
            isRealData = true;
          }
        }
      } catch (err) {
        console.warn("Satellite API fetch failed during zone mapping.");
      }

      zones.push({
        id: `crop-zone-${index + 1}`,
        name: `${cropType.charAt(0).toUpperCase() + cropType.slice(1)} Zone ${index + 1} ${isRealData ? '(Satellite Verified)' : ''}`,
        coordinates: coords,
        cropType: cropType,
        variety: aiC?.variety || 'Standard',
        stage: (aiC?.stage?.toLowerCase() || 'vegetative') as any,
        plantingDate,
        expectedHarvest,
        health: realHealth,
        yieldPrediction: Math.round(this.predictYield(cropType, coords) * (realHealth / 100)),
        ndvi: ndvi,
        stressFactors: isRealData && ndvi < 0.4 ? [...stressFactors, 'Vegetation Stress (Satellite)'] : stressFactors
      });
    }

    return zones;
  }


  private getCurrentGrowthStage(plantingDate: Date, duration: number): 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest' | 'fallow' {
    const daysSincePlanting = (Date.now() - plantingDate.getTime()) / (1000 * 60 * 60 * 24);
    const progress = daysSincePlanting / duration;

    if (progress < 0.2) return 'seedling';
    if (progress < 0.5) return 'vegetative';
    if (progress < 0.75) return 'flowering';
    if (progress < 0.9) return 'fruiting';
    if (progress < 1.0) return 'harvest';
    return 'fallow';
  }

  private predictYield(cropType: string, coordinates: GISCoordinate[]): number {
    const area = this.calculatePolygonArea(coordinates);
    const baseYields = {
      wheat: 3500,
      rice: 4000,
      maize: 5000,
      mustard: 1200,
      potato: 20000,
      vegetables: 15000,
      soybean: 1500,
      cotton: 1800,
      sugarcane: 70000
    };

    const baseYield = baseYields[cropType as keyof typeof baseYields] || 3000;
    const variability = 0.9 + Math.random() * 0.2; // ±10% variation

    return Math.round(baseYield * variability * area);
  }

  private identifyStressFactors(coordinates?: GISCoordinate[]): string[] {
    const stressFactors: string[] = [];

    // Regional context: High Rainfall Zone (Northeast India)
    // Common: Soil Acidity (Low pH), Nutrient leaching, Fungal diseases
    // Rare: Salinity (Heavy rain washes salts)

    const rand = Math.random();

    // 1. Water Issues
    if (rand < 0.2) stressFactors.push('Water stress'); // Dry spells possible
    else if (rand > 0.85) stressFactors.push('Water stagnation'); // Heavy rain issue

    // 2. Nutrients (Common due to leaching)
    if (Math.random() < 0.3) stressFactors.push('Nutrient deficiency'); // Nitrogen/Phosphorus
    if (Math.random() < 0.15) stressFactors.push('Soil Acidity'); // Very common in NE

    // 3. Pests/Disease
    if (Math.random() < 0.25) stressFactors.push('Pest pressure');
    if (Math.random() < 0.2) stressFactors.push('Fungal infection'); // High humidity risk

    // 4. Salinity - MAKE RARE
    // Only if explicitly bad drainage context (simulated by low random chance or specific logic)
    if (Math.random() < 0.05) stressFactors.push('Salinity'); // Very unlikely

    return stressFactors;
  }

  private async generateWeatherMicroclimates(boundary: FieldBoundary, aiWeather?: any): Promise<WeatherMicroclimate[]> {
    const microclimates: WeatherMicroclimate[] = [];

    // Create 2-4 weather monitoring points across the farm
    const numPoints = 2; // Keep it simple

    for (let i = 0; i < numPoints; i++) {
      const location = this.getRandomPointInPolygon(boundary.coordinates);

      microclimates.push({
        id: `weather-${i + 1}`,
        name: `Weather Station ${i + 1}`,
        coordinates: location,
        temperature: {
          current: aiWeather?.temperature || (25 + Math.random() * 10),
          min: (aiWeather?.temperature || 25) - 5,
          max: (aiWeather?.temperature || 25) + 5,
          average: aiWeather?.temperature || 27
        },
        humidity: aiWeather?.humidity || 65,
        rainfall: {
          current: aiWeather?.rainfall || 0,
          weekly: (aiWeather?.rainfall || 0) * 5,
          monthly: (aiWeather?.rainfall || 0) * 15
        },
        windSpeed: aiWeather?.windSpeed || 5,
        windDirection: 180,
        solarRadiation: 20,
        evapotranspiration: 5,
        frostRisk: 'none'
      });
    }

    return microclimates;
  }

  private async generateInfrastructure(boundary: FieldBoundary) {
    return {
      roads: this.generateRoadNetwork(boundary),
      buildings: this.generateBuildings(boundary),
      waterSources: this.generateWaterSources(boundary)
    };
  }

  private generateRoadNetwork(boundary: FieldBoundary): GISCoordinate[][] {
    const roads: GISCoordinate[][] = [];

    // Main access road
    const center = boundary.centroid;
    const edge = boundary.coordinates[0];
    roads.push([center, edge]);

    // Internal farm roads
    const numRoads = Math.floor(boundary.area / 10) + 1;
    for (let i = 0; i < numRoads; i++) {
      const start = this.getRandomPointInPolygon(boundary.coordinates);
      const end = this.getRandomPointInPolygon(boundary.coordinates);
      roads.push([start, end]);
    }

    return roads;
  }

  private generateBuildings(boundary: FieldBoundary) {
    const buildings = [];
    const buildingTypes: ('storage' | 'processing' | 'office' | 'greenhouse')[] = ['storage', 'processing', 'office', 'greenhouse'];

    const numBuildings = Math.min(5, Math.max(2, Math.floor(boundary.area / 8)));

    for (let i = 0; i < numBuildings; i++) {
      const center = this.getRandomPointInPolygon(boundary.coordinates);
      const buildingCoords = this.createRectangularArea(center, 20, 15); // 20x15 meter building

      buildings.push({
        type: buildingTypes[i % buildingTypes.length],
        coordinates: buildingCoords
      });
    }

    return buildings;
  }

  private generateWaterSources(boundary: FieldBoundary) {
    const sources = [];
    const sourceTypes: ('well' | 'pond' | 'river' | 'canal')[] = ['well', 'pond', 'river', 'canal'];

    const numSources = Math.min(3, Math.max(1, Math.floor(boundary.area / 15)));

    for (let i = 0; i < numSources; i++) {
      const location = this.getRandomPointInPolygon(boundary.coordinates);
      const sourceType = sourceTypes[i % sourceTypes.length];

      sources.push({
        type: sourceType,
        coordinates: location,
        capacity: sourceType === 'well' ? 1000 + Math.random() * 4000 : undefined // liters/hour for wells
      });
    }

    return sources;
  }

  // Utility methods for spatial analysis
  private getBoundingBox(coordinates: GISCoordinate[]) {
    const lats = coordinates.map(c => c.lat);
    const lngs = coordinates.map(c => c.lng);

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs)
    };
  }

  private polygonIntersects(poly1: GISCoordinate[], poly2: GISCoordinate[]): boolean {
    // Simplified intersection check - in real implementation, use proper GIS library
    const bbox1 = this.getBoundingBox(poly1);
    const bbox2 = this.getBoundingBox(poly2);

    return !(bbox1.maxLat < bbox2.minLat || bbox1.minLat > bbox2.maxLat ||
      bbox1.maxLng < bbox2.minLng || bbox1.minLng > bbox2.maxLng);
  }

  private calculatePolygonArea(coordinates: GISCoordinate[]): number {
    const turfCoords = coordinates.map(coord => [coord.lng, coord.lat]);
    turfCoords.push(turfCoords[0]);
    const polygon = turf.polygon([turfCoords]);
    return turf.area(polygon) / 10000; // Convert to hectares
  }

  private divideIntoZones(coordinates: GISCoordinate[], numZones: number): GISCoordinate[][] {
    // Simplified zone division - in real implementation, use advanced spatial algorithms
    const zones: GISCoordinate[][] = [];
    const bbox = this.getBoundingBox(coordinates);

    const cols = Math.ceil(Math.sqrt(numZones));
    const rows = Math.ceil(numZones / cols);

    const cellWidth = (bbox.maxLng - bbox.minLng) / cols;
    const cellHeight = (bbox.maxLat - bbox.minLat) / rows;

    for (let i = 0; i < cols && zones.length < numZones; i++) {
      for (let j = 0; j < rows && zones.length < numZones; j++) {
        const zoneCoords: GISCoordinate[] = [
          { lat: bbox.minLat + j * cellHeight, lng: bbox.minLng + i * cellWidth },
          { lat: bbox.minLat + j * cellHeight, lng: bbox.minLng + (i + 1) * cellWidth },
          { lat: bbox.minLat + (j + 1) * cellHeight, lng: bbox.minLng + (i + 1) * cellWidth },
          { lat: bbox.minLat + (j + 1) * cellHeight, lng: bbox.minLng + i * cellWidth }
        ];

        if (this.polygonIntersects(zoneCoords, coordinates)) {
          zones.push(zoneCoords);
        }
      }
    }

    return zones;
  }

  private getRandomPointInPolygon(coordinates: GISCoordinate[]): GISCoordinate {
    const bbox = this.getBoundingBox(coordinates);

    // Simple random point generation - in real implementation, ensure point is inside polygon
    return {
      lat: bbox.minLat + Math.random() * (bbox.maxLat - bbox.minLat),
      lng: bbox.minLng + Math.random() * (bbox.maxLng - bbox.minLng)
    };
  }

  private createCircularArea(center: GISCoordinate, radius: number): GISCoordinate[] {
    const points: GISCoordinate[] = [];
    const numPoints = 16;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints;
      const lat = center.lat + (radius / 111000) * Math.cos(angle); // Approximate conversion
      const lng = center.lng + (radius / (111000 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(angle);

      points.push({ lat, lng });
    }

    return points;
  }

  private createRectangularArea(center: GISCoordinate, width: number, height: number): GISCoordinate[] {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const latOffset = halfHeight / 111000; // Approximate conversion
    const lngOffset = halfWidth / (111000 * Math.cos(center.lat * Math.PI / 180));

    return [
      { lat: center.lat - latOffset, lng: center.lng - lngOffset },
      { lat: center.lat - latOffset, lng: center.lng + lngOffset },
      { lat: center.lat + latOffset, lng: center.lng + lngOffset },
      { lat: center.lat + latOffset, lng: center.lng - lngOffset }
    ];
  }

  // Public methods for analysis and recommendations
  async performSpatialAnalysis(): Promise<GISAnalysisResult> {
    if (!this.farmData) {
      throw new Error('Farm data not initialized');
    }

    return {
      spatialAnalysis: {
        optimalCropZones: await this.analyzeOptimalCropZones(),
        irrigationEfficiency: await this.analyzeIrrigationEfficiency(),
        pestRiskMapping: await this.analyzePestRiskMapping()
      },
      recommendations: {
        fieldManagement: this.generateFieldManagementRecommendations(),
        irrigation: this.generateIrrigationRecommendations(),
        pestControl: this.generatePestControlRecommendations(),
        soilImprovement: this.generateSoilImprovementRecommendations()
      }
    };
  }

  private async analyzeOptimalCropZones() {
    const crops = ['wheat', 'rice', 'maize', 'cotton', 'soybean'];

    return crops.map(crop => ({
      cropType: crop,
      suitabilityScore: 70 + Math.random() * 25, // 70-95%
      recommendedArea: this.farmData!.soilZones
        .filter(zone => zone.fertility === 'high')
        .slice(0, 2)
        .map(zone => zone.coordinates)
        .flat()
    }));
  }

  private async analyzeIrrigationEfficiency() {
    const currentEfficiency = this.farmData!.irrigationZones
      .reduce((sum, zone) => sum + zone.efficiency, 0) / this.farmData!.irrigationZones.length;

    return {
      currentEfficiency: Math.round(currentEfficiency * 10) / 10,
      optimizedLayout: this.farmData!.irrigationZones.map(zone => ({
        ...zone,
        efficiency: Math.min(95, zone.efficiency + 5) // Improve by 5%
      })),
      waterSavings: Math.round(this.farmData!.totalArea * 1000 * 0.15) // 15% water savings
    };
  }

  private async analyzePestRiskMapping() {
    const highRiskAreas = this.farmData!.pestProneAreas
      .filter(area => area.riskLevel === 'high')
      .map(area => area.coordinates);

    return {
      highRiskAreas,
      preventiveZones: highRiskAreas.map(area =>
        area.map(coord => ({
          lat: coord.lat + 0.001,
          lng: coord.lng + 0.001
        }))
      ),
      bufferZones: highRiskAreas.map(area =>
        area.map(coord => ({
          lat: coord.lat + 0.002,
          lng: coord.lng + 0.002
        }))
      )
    };
  }

  private generateFieldManagementRecommendations(): string[] {
    return [
      'Implement precision agriculture techniques for variable rate application',
      'Use GPS-guided machinery for accurate field operations',
      'Establish permanent traffic lanes to reduce soil compaction',
      'Implement conservation tillage practices',
      'Use cover crops during fallow periods'
    ];
  }

  private generateIrrigationRecommendations(): string[] {
    return [
      'Optimized irrigation scheduling based on field data',
      'Upgrade to drip irrigation in high-value crop areas',
      'Implement deficit irrigation strategies during non-critical growth stages',
      'Use weather-based irrigation scheduling',
      'Regular maintenance of irrigation systems to maintain efficiency'
    ];
  }

  private generatePestControlRecommendations(): string[] {
    return [
      'Implement integrated pest management (IPM) strategies',
      'Use pheromone traps for early pest detection',
      'Establish beneficial insect habitats around field margins',
      'Rotate crops to break pest life cycles',
      'Use resistant crop varieties where available'
    ];
  }

  private generateSoilImprovementRecommendations(): string[] {
    return [
      'Conduct regular soil testing for nutrient management',
      'Apply organic matter to improve soil structure',
      'Use precision fertilizer application based on soil zones',
      'Implement controlled traffic farming',
      'Use lime or sulfur to adjust soil pH as needed'
    ];
  }

  // Export methods for integration with mapping libraries
  getMapboxLayers() {
    if (!this.farmData) return [];

    return [
      {
        id: 'field-boundaries',
        type: 'fill',
        data: this.farmData.fieldBoundaries
      },
      {
        id: 'soil-zones',
        type: 'fill',
        data: this.farmData.soilZones
      },
      {
        id: 'irrigation-zones',
        type: 'fill',
        data: this.farmData.irrigationZones
      },
      {
        id: 'pest-areas',
        type: 'fill',
        data: this.farmData.pestProneAreas
      },
      {
        id: 'crop-zones',
        type: 'fill',
        data: this.farmData.cropGrowthZones
      }
    ];
  }

  getLeafletLayers() {
    // Similar structure for Leaflet integration
    return this.getMapboxLayers();
  }

  getFarmData(): DigitalTwinData | null {
    return this.farmData;
  }

  updateFarmData(data: Partial<DigitalTwinData>) {
    if (this.farmData) {
      this.farmData = { ...this.farmData, ...data, lastUpdated: new Date() };
    }
  }
}

