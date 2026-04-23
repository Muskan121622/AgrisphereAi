export interface LatLng {
  lat: number;
  lng: number;
}

export interface NearbyFarmShop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  rating: number;
  distance: string;
  phone?: string;
  website?: string;
  businessStatus?: string;
  placeTypes?: string[];
  googleMapsUrl: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

const FARM_TEXT_QUERIES = [
  "agricultural shop",
  "seed store",
  "farm store",
  "fertilizer shop",
  "agri input store",
  "wholesale agricultural supplier",
  "krishi kendra",
  "seed seller",
  "farm supply store",
  "nursery",
];

const FARM_KEYWORDS = [
  "agri",
  "agriculture",
  "agricultural",
  "seed",
  "seeds",
  "farm",
  "fertilizer",
  "fertilis",
  "krishi",
  "kendra",
  "nursery",
  "wholesale",
  "supply",
  "input",
  "pesticide",
  "crop",
  "kisan",
];

let googleMapsLoaderPromise: Promise<void> | null = null;

export const loadGoogleMapsSdk = (): Promise<void> => {
  // Already loaded and importLibrary is available
  if (window.google?.maps?.importLibrary) return Promise.resolve();

  if (googleMapsLoaderPromise) return googleMapsLoaderPromise;

  const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY as string | undefined;
  if (!apiKey) {
    return Promise.reject(new Error("Missing VITE_GOOGLE_MAP_API_KEY"));
  }

  googleMapsLoaderPromise = new Promise<void>((resolve, reject) => {
    // Use the official Google Maps bootstrap loader pattern.
    // This is the ONLY way to make importLibrary work.
    // See: https://developers.google.com/maps/documentation/javascript/load-maps-js-api
    (window as any).__google_maps_callback__ = () => resolve();

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=__google_maps_callback__`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsSdk = "places";
    script.onerror = () => {
      googleMapsLoaderPromise = null;
      reject(new Error("Google Maps SDK failed to load"));
    };
    document.head.appendChild(script);
  });

  return googleMapsLoaderPromise;
};

const haversineDistance = (origin: LatLng, target: LatLng) => {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(target.lat - origin.lat);
  const deltaLng = toRadians(target.lng - origin.lng);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(origin.lat)) *
      Math.cos(toRadians(target.lat)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const dedupePlaces = (results: any[]) => {
  const seen = new Set<string>();
  return results.filter((place) => {
    const placeId =
      place.place_id || place.id || `${place.name}-${place.formatted_address}`;
    if (seen.has(placeId)) return false;
    seen.add(placeId);
    return true;
  });
};

const isFarmingRelatedPlace = (place: any) => {
  const haystack = [
    place.name,
    place.formatted_address,
    place.vicinity,
    ...(place.types || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return FARM_KEYWORDS.some((keyword) => haystack.includes(keyword));
};

const normalizeType = (place: any) => {
  const text = [place.name, ...(place.types || [])].join(" ").toLowerCase();

  if (text.includes("seed")) return "Seed Shop";
  if (text.includes("fertil")) return "Fertilizer Shop";
  if (text.includes("nursery")) return "Nursery";
  if (text.includes("wholesale")) return "Wholesaler";
  if (text.includes("krishi") || text.includes("kendra"))
    return "Krishi Kendra";
  if (text.includes("farm")) return "Farm Store";
  return "Agricultural Shop";
};

const buildQueries = (searchText?: string) => {
  const trimmed = searchText?.trim();
  if (!trimmed) return FARM_TEXT_QUERIES;

  return [
    trimmed,
    `${trimmed} agricultural shop`,
    `${trimmed} seed store`,
    `${trimmed} farm store`,
    `${trimmed} fertilizer shop`,
    ...FARM_TEXT_QUERIES,
  ];
};

export const geocodeAddressWithGoogle = async (
  address: string,
): Promise<LatLng> => {
  await loadGoogleMapsSdk();

  const geocoder = new window.google.maps.Geocoder();
  const response = await geocoder.geocode({ address });
  const result = response.results?.[0];

  if (!result?.geometry?.location) {
    throw new Error("Could not geocode the supplied address");
  }

  return {
    lat: result.geometry.location.lat(),
    lng: result.geometry.location.lng(),
  };
};

export const searchNearbyFarmShops = async (
  origin: LatLng,
  searchText?: string,
): Promise<NearbyFarmShop[]> => {
  await loadGoogleMapsSdk();

  const placesLibrary = (await window.google.maps.importLibrary(
    "places",
  )) as any;
  const Place = placesLibrary.Place;
  const center = new window.google.maps.LatLng(origin.lat, origin.lng);
  const queries = buildQueries(searchText);

  const queryResults = await Promise.all(
    queries.map((query) =>
      Place.searchByText({
        textQuery: query,
        fields: [
          "displayName",
          "location",
          "formattedAddress",
          "businessStatus",
          "rating",
          "websiteURI",
          "nationalPhoneNumber",
          "types",
        ],
        includedType: "",
        useStrictTypeFiltering: true,
        locationBias: center,
        isOpenNow: true,
        language: "en-US",
        maxResultCount: 10,
        minRating: 1,
        region: "in",
      })
        .then((response: any) => response.places || [])
        .catch(() => []),
    ),
  );

  const places = dedupePlaces(queryResults.flat()).filter(
    isFarmingRelatedPlace,
  );

  return places
    .map((place) => {
      const location = place.location;
      if (!location) return null;

      const lat =
        typeof location.lat === "function" ? location.lat() : location.lat;
      const lng =
        typeof location.lng === "function" ? location.lng() : location.lng;
      const distance = haversineDistance(origin, { lat, lng });
      const displayName =
        typeof place.displayName === "string"
          ? place.displayName
          : place.displayName?.text;
      const address =
        place.formattedAddress ||
        place.formatted_address ||
        place.vicinity ||
        "Address unavailable";
      const phone =
        place.nationalPhoneNumber ||
        place.formatted_phone_number ||
        place.international_phone_number;
      const website = place.websiteURI || place.website;

      return {
        id:
          place.id ||
          place.place_id ||
          `${displayName || "Agricultural Shop"}-${lat}-${lng}`,
        name: displayName || place.name || "Agricultural Shop",
        address,
        lat,
        lng,
        type: normalizeType(place),
        rating: Number(place.rating || 4.0),
        distance: distance.toFixed(1),
        phone,
        website,
        businessStatus: place.businessStatus || place.business_status,
        placeTypes: place.types || [],
        googleMapsUrl:
          place.id || place.place_id
            ? `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${place.id || place.place_id}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayName || address)}`,
      } satisfies NearbyFarmShop;
    })
    .filter(Boolean)
    .sort((a, b) => parseFloat(a!.distance) - parseFloat(b!.distance))
    .slice(0, 10) as NearbyFarmShop[];
};
