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
  blockchain: any[];
  aiRejectError: {
    status: string;
    score_risque: number;
    statut_ia: string;
  } | null; // Ajout
  addTitle: (title: Omit<Title, "created_at">) => Promise<any>; // Modifier pour retourner any
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
  const [blockchain, setBlockchain] = useState<any[]>([]);
  const [aiRejectError, setAiRejectError] = useState<{
    status: string;
    score_risque: number;
    statut_ia: string;
  } | null>(null); // Ajout

  const fetchBlockchain = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/titles/blockchain",
      );
      setBlockchain(response.data);
    } catch (err) {
      console.error("Erreur chargement blockchain", err);
    }
  };

  const fetchTitles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTitles();
      if (
        data &&
        (data as any).type === "FeatureCollection" &&
        Array.isArray((data as any).features)
      ) {
        const transformedTitles = (data as any).features.map((feature: any) => {
          return {
            ...feature.properties,
            geometry: feature.geometry || feature.geom || null,
          };
        });
        const titlesWithAiStatus = transformedTitles.map((title: any) => ({
          ...title,
          // On récupère le aiStatus directement de la réponse du backend
          aiStatus:
            title.aiStatus ||
            (title.ai?.status === "SUSPECT" ? "SUSPECT" : "NORMAL"), // Fallback au cas où
        }));
        setTitles(titlesWithAiStatus);
      } else if (Array.isArray(data)) {
        setTitles(data);
      } else {
        setTitles([]);
      }
      await fetchBlockchain();
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
    setAiRejectError(null); // Clear AI reject error on new attempt

    try {
      const newTitle = await createTitle(title);
      await fetchTitles();
      setTitles((prev) => [...prev, newTitle]);
      setSuccessMessage("Titre foncier créé avec succès!");
      setTimeout(() => setSuccessMessage(null), 5000);
      return newTitle; // Return the new title (which might include ai result from backend)
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.status === 409
      ) {
        const conflictData: Conflict = err.response.data;
        setError(`Conflit: ${conflictData.message}`);
        setConflictingTitles(conflictData.conflictingTitles);
      } else if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.status === 403 &&
        err.response.data.ai
      ) {
        // AI rejection error
        setAiRejectError(err.response.data.ai);
        setError("Transaction bloquée par l'IA."); // Set a general error too
        setTimeout(() => setAiRejectError(null), 10000);
      } else {
        setError("Erreur lors de la création du titre foncier.");
        console.error(err);
      }
      setTimeout(() => setError(null), 10000);
      setTimeout(() => setConflictingTitles(null), 10000);
      throw err; // Re-throw to propagate error to Dashboard.tsx's onSubmit
    }
  };

  return {
    titles,
    loading,
    error,
    successMessage,
    conflictingTitles,
    blockchain,
    aiRejectError, // Ajout
    addTitle,
    refreshTitles: fetchTitles,
  };
};
