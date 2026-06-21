import React from "react";
import type { Title } from "../types";

interface TitleTableProps {
  titles: Title[];
}

const TitleTable: React.FC<TitleTableProps> = ({ titles }) => {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="min-w-full text-left bg-white">
        <thead>
          <tr className="border-b border-slate-200 text-slate-600 uppercase text-xs tracking-wider">
            <th className="py-3 px-4 font-medium">ID Titre</th>
            <th className="py-3 px-4 font-medium">Propriétaire</th>
            <th className="py-3 px-4 font-medium text-right">
              Superficie (m²)
            </th>
            <th className="py-3 px-4 font-medium text-right">Enregistré le</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(titles) && titles.length > 0 ? (
            titles.map((title) => (
              <tr
                key={title.titleID}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
              >
                <td className="py-3 px-4 text-sm font-medium text-blue-700">
                  {title.titleID}
                </td>
                <td className="py-3 px-4 text-sm text-slate-700">
                  {title.owner}
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 font-mono text-right">
                  {new Intl.NumberFormat("fr-FR", {
                    minimumFractionDigits: 2,
                  }).format(title.area_m2)}{" "}
                  m²
                </td>
                <td className="py-3 px-4 text-xs text-slate-500 text-right">
                  {title.created_at
                    ? new Date(title.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "---"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="py-12 text-center text-slate-500 text-sm"
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <svg
                    className="w-10 h-10 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>Aucun titre foncier enregistré pour le moment.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TitleTable;
