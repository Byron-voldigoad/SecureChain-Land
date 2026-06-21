export interface Title {
  titleID: string;
  owner: string;
  nationalID: string;
  area_m2: number;
  geometry: any; // GeoJSON Polygon object
  created_at?: string;
}

export interface Conflict {
  message: string;
  conflictingTitles: Title[];
}
