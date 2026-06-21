import { useState, useEffect, useCallback } from "react";
import { getTitles, createTitle } from "../services/api";
import type { Title, Conflict } from "../types";
import axios from "axios";

interface UseTitlesResult {
  titles: Title[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  conflictingTitles: Title[] | null;
  addTitle: (title: Omit<Title, "created_at">) => Promise<void>;
  refreshTitles: () => Promise<void>;
}

export const useTitles = (): UseTitlesResult => {
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [conflictingTitles, setConflictingTitles] = useState<Title[] | null>(
    null,
  );

  const fetchTitles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTitles();
      // Si le backend retourne une FeatureCollection (GeoJSON), on extrait les titres des 'features'
      if (
        data &&
        (data as any).type === "FeatureCollection" &&
        Array.isArray((data as any).features)
      ) {
        const transformedTitles = (data as any).features.map((feature: any) => {
          console.log("DEBUG FEATURE:", feature); // <-- LOG AJOUTÉ
          return {
            ...feature.properties,
            geometry: feature.geometry || feature.geom || null, // On teste les noms possibles
          };
        });
        setTitles(transformedTitles);
      } else if (Array.isArray(data)) {
        setTitles(data);
      } else {
        console.warn("Format de données inattendu reçu de l'API:", data);
        setTitles([]);
      }
    } catch (err) {
      setError("Failed to fetch titles.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTitles();
  }, [fetchTitles]);

  const addTitle = async (title: Omit<Title, "created_at">) => {
    setError(null);
    setSuccessMessage(null);
    setConflictingTitles(null);
    try {
      console.log("Data sending to backend:", title);
      const newTitle = await createTitle(title);
      await fetchTitles(); // Recharger la liste après l'ajout
      setTitles((prev) => [...prev, newTitle]);
      setSuccessMessage("Title foncier créé avec succès!");
      // Clear success message after some time
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.status === 409
      ) {
        const conflictData: Conflict = err.response.data;
        setError(`Conflict: ${conflictData.message}`);
        setConflictingTitles(conflictData.conflictingTitles);
      } else {
        setError("Erreur lors de la création du titre foncier.");
        console.error(err);
      }
      // Clear error message after some time
      setTimeout(() => setError(null), 10000);
      setTimeout(() => setConflictingTitles(null), 10000);
    }
  };

  return {
    titles,
    loading,
    error,
    successMessage,
    conflictingTitles,
    addTitle,
    refreshTitles: fetchTitles,
  };
};
