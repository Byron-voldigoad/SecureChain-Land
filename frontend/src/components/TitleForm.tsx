import React, { useState } from "react";
import type { Title } from "../types";

interface TitleFormProps {
  onSubmit: (title: Omit<Title, "created_at">) => void;
  onGeoJSONChange: (geojson: string) => void;
  geojsonInput: string;
  initialArea?: number;
}

const TitleForm: React.FC<TitleFormProps> = ({
  onSubmit,
  onGeoJSONChange,
  geojsonInput,
  initialArea,
}) => {
  const [titleID, setTitleID] = useState("");
  const [owner, setOwner] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [area_m2, setArea_m2] = useState<number>(0);
  const [montant, setMontant] = useState<number>(0);
  const [historique_mutations, setHistorique_mutations] = useState<number>(0);

  React.useEffect(() => {
    if (initialArea) setArea_m2(initialArea);
  }, [initialArea]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const geojson = JSON.parse(geojsonInput);
      onSubmit({
        titleID,
        owner,
        nationalID,
        area_m2,
        montant,
        historique_mutations,
        geometry: geojson,
      });
      setTitleID("");
      setOwner("");
      setNationalID("");
      setArea_m2(0);
      setMontant(0);
      setHistorique_mutations(0);
      onGeoJSONChange("");
    } catch (err: any) {
      console.error("Form submission error:", err);
      alert(
        `Erreur lors de la soumission: ${err.message}. Veuillez vérifier le format GeoJSON.`,
      );
    }
  };

  const inputClasses =
    "w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all text-sm";
  const labelClasses = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="titleID" className={labelClasses}>
            ID Titre
          </label>
          <input
            type="text"
            id="titleID"
            className={inputClasses}
            placeholder="TF-0000"
            value={titleID}
            onChange={(e) => setTitleID(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="area_m2" className={labelClasses}>
            Superficie (m²)
          </label>
          <input
            type="number"
            id="area_m2"
            className={inputClasses}
            placeholder="0.00"
            value={area_m2 || ""}
            onChange={(e) => setArea_m2(parseFloat(e.target.value))}
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="montant" className={labelClasses}>
            Montant (FCFA)
          </label>
          <input
            type="number"
            id="montant"
            className={inputClasses}
            value={montant || ""}
            onChange={(e) => setMontant(parseFloat(e.target.value))}
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="historique_mutations" className={labelClasses}>
            Historique Mutations
          </label>
          <input
            type="number"
            id="historique_mutations"
            className={inputClasses}
            value={historique_mutations || ""}
            onChange={(e) =>
              setHistorique_mutations(parseFloat(e.target.value))
            }
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="owner" className={labelClasses}>
          Propriétaire
        </label>
        <input
          type="text"
          id="owner"
          className={inputClasses}
          placeholder="Nom complet"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="nationalID" className={labelClasses}>
          Identifiant National
        </label>
        <input
          type="text"
          id="nationalID"
          className={inputClasses}
          placeholder="Numéro de CNI ou Passeport"
          value={nationalID}
          onChange={(e) => setNationalID(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1 flex-1 flex flex-col">
        <label htmlFor="geojson" className={labelClasses}>
          Données Géospatiales (GeoJSON)
        </label>
        <textarea
          id="geojson"
          className={`${inputClasses} flex-1 min-h-[100px] font-mono text-xs resize-y`}
          value={geojsonInput}
          onChange={(e) => onGeoJSONChange(e.target.value)}
          placeholder='{ "type": "Polygon", "coordinates": [...] }'
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition-colors shadow-md shadow-blue-500/20 active:scale-[0.99] text-sm"
      >
        Enregistrer la Parcelle
      </button>
    </form>
  );
};

export default TitleForm;
