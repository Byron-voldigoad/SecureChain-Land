import React from 'react';

interface BlockchainTableProps {
  blockchain: any[];
}

const BlockchainTable: React.FC<BlockchainTableProps> = ({ blockchain }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Historique Blockchain</h2>
          <p className="text-xs text-slate-500 font-medium">
            Registre immuable des titres fonciers enregistrés
          </p>
        </div>
        <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-100">
          {blockchain.length} Blocs
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Bloc #</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ID Titre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Propriétaire</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Hash Actuel</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Hash Précédent</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {blockchain.map((block, index) => (
              <tr key={block.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{block.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{block.title_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{block.payload.owner}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-600 truncate max-w-xs">{block.current_hash}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-400 truncate max-w-xs">{block.previous_hash}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(block.timestamp).toLocaleString()}</td>
              </tr>
            ))}
            {blockchain.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-slate-500">Aucun bloc enregistré sur la blockchain.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlockchainTable;
