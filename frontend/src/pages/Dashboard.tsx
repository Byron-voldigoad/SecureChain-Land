import { useState } from "react";
import { area } from "@turf/turf";
import { useTitles } from "../hooks/useTitles";
import MapComponent from "../components/MapComponent";
import TitleTable from "../components/TitleTable";
import TitleForm from "../components/TitleForm";
import BlockchainTable from "../components/BlockchainTable"; // Ajout
import AiAnalysisCard from "../components/AiAnalysisCard"; // Ajout

const Dashboard: React.FC = () => {
  const {
    titles,
    loading,
    error,
    successMessage,
    conflictingTitles,
    blockchain, // Ajout
    addTitle,
    aiRejectError, // Ajout
  } = useTitles();
  const [geojsonInput, setGeojsonInput] = useState<string>("");
  const [calculatedArea, setCalculatedArea] = useState<number>(0);
  const [lastAiResult, setLastAiResult] = useState<{
    status: string;
    score_risque: number;
    statut_ia: string;
  } | null>(null); // Ajout

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              SecureChain Land
            </span>
          </div>
          <div className="flex items-center gap-4">
            {loading && (
              <span className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                Chargement...
              </span>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Messages */}
        <div className="empty:hidden space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 animate-fade-in shadow-sm">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800">{error}</p>
                {conflictingTitles && (
                  <div className="mt-2 text-xs text-red-700 bg-white/50 rounded-lg p-2 border border-red-100">
                    <span className="font-bold">Titres en conflit :</span>{" "}
                    {conflictingTitles.map((t) => t.titleID).join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}
          {aiRejectError && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-3 animate-fade-in shadow-sm">
              <svg
                className="w-5 h-5 text-orange-500 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-800">
                  Transaction refusée par l'IA: {aiRejectError.status}
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  Score de risque:{" "}
                  {(aiRejectError.score_risque * 100).toFixed(2)}%
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  Motif: {aiRejectError.statut_ia}
                </p>
              </div>
            </div>
          )}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3 animate-fade-in shadow-sm">
              <svg
                className="w-5 h-5 text-emerald-500 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-semibold text-emerald-800">
                {successMessage}
              </p>
            </div>
          )}
        </div>

        {/* Top Section: Form and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 h-full">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Enregistrer une parcelle
              </h2>
              <TitleForm
                onSubmit={async (title) => {
                  try {
                    const response = await addTitle(title); // addTitle est maintenant async et retourne la réponse
                    setLastAiResult(response.ai); // Sauvegarder le résultat IA
                  } catch (err: any) {
                    // Gérer l'erreur d'enregistrement (chevauchement, IA suspecte)
                    console.error(
                      "Erreur lors de l'enregistrement depuis le formulaire",
                      err,
                    );
                    if (
                      err.response &&
                      err.response.data &&
                      err.response.data.ai
                    ) {
                      setLastAiResult(err.response.data.ai);
                    }
                  }
                }}
                onGeoJSONChange={setGeojsonInput}
                geojsonInput={geojsonInput}
                initialArea={calculatedArea}
              />
            </div>
            {lastAiResult && (
              <AiAnalysisCard
                aiStatus={lastAiResult.status}
                aiScore={lastAiResult.score_risque}
                aiMessage={lastAiResult.statut_ia}
              />
            )}
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm h-[500px]">
              <MapComponent
                titles={titles}
                onDrawCreated={(geo) => {
                  const polyArea = area(geo);
                  setCalculatedArea(Math.round(polyArea));
                  setGeojsonInput(JSON.stringify(geo.geometry, null, 2));
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Registre des Titres
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Visualisation des données stockées sur SecureChain
              </p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
              {titles.length} Titres
            </div>
          </div>
          <TitleTable titles={titles} />
        </div>

        {/* Nouvelle section Blockchain */}
        <BlockchainTable blockchain={blockchain} />
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-sm text-slate-400 font-medium tracking-tight">
          &copy; 2026 SecureChain Land Registry • Système Décentralisé de
          Gestion Foncière
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
