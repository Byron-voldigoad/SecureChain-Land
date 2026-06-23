export interface Title {
  titleID: string;
  owner: string;
  nationalID: string;
  area_m2: number;
  montant: number;
  historique_mutations: number;
  geometry: any;
  created_at?: string;
  ai_status?: string;
  ai_score?: number;
}

export interface Conflict {
  message: string;
  conflictingTitles: Title[];
}
