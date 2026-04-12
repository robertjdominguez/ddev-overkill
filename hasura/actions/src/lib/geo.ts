import { Reader, type CityResponse } from "@maxmind/geoip2-node";
import fs from "fs";

export interface GeoData {
  country: string | null;
  region: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
}

const EMPTY_GEO: GeoData = {
  country: null,
  region: null,
  city: null,
  latitude: null,
  longitude: null,
};

let reader: Reader | null = null;

export function initGeoReader(dbPath: string): void {
  if (!fs.existsSync(dbPath)) {
    console.warn(`MaxMind DB not found at ${dbPath} — geo enrichment disabled`);
    return;
  }
  reader = Reader.openBuffer(fs.readFileSync(dbPath));
  console.log("MaxMind GeoLite2 reader initialized");
}

export function lookupGeo(ip: string): GeoData {
  if (!reader) return EMPTY_GEO;

  try {
    const result: CityResponse = reader.city(ip);
    return {
      country: result.country?.isoCode ?? null,
      region: result.subdivisions?.[0]?.isoCode ?? null,
      city: result.city?.names?.en ?? null,
      latitude: result.location?.latitude ?? null,
      longitude: result.location?.longitude ?? null,
    };
  } catch {
    return EMPTY_GEO;
  }
}
