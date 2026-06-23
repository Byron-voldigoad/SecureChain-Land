import React from 'react';

interface AiAnalysisCardProps {
  aiStatus: string | null;
  aiScore: number | null;
  aiMessage: string | null;
}

const AiAnalysisCard: React.FC<AiAnalysisCardProps> = ({
  aiStatus,
  aiScore,
  aiMessage,
}) => {
  const statusColorClass = aiStatus === 'SUSPECT' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100';
  const iconColorClass = aiStatus === 'SUSPECT' ? 'text-red-500' : 'text-emerald-500';
  const iconPath = aiStatus === 'SUSPECT' ?
    "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" :
    "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";

  return (
    <div className={`bg-white p-6 rounded-2xl border ${statusColorClass} shadow-sm transition-colors duration-200 mt-8`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-2 rounded-lg ${iconColorClass} bg-current/10`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
          </svg>
        </div>
        <h3 className="text-xl font-bold">Analyse IA</h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm flex justify-between items-center">
          <span className="font-medium">Statut :</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${aiStatus === 'SUSPECT' ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'}`}>
            {aiStatus || 'N/A'}
          </span>
        </p>
        <p className="text-sm flex justify-between items-center">
          <span className="font-medium">Score de risque :</span>
          <span className="font-semibold">{aiScore !== null ? (aiScore * 100).toFixed(2) + '%' : 'N/A'}</span>
        </p>
        <p className="text-sm flex justify-between items-center">
          <span className="font-medium">Motif :</span>
          <span className="text-right">{aiMessage || 'Analyse en cours...'}</span>
        </p>
      </div>
    </div>
  );
};

export default AiAnalysisCard;
