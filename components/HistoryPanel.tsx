import React from 'react';
import { CalculationData } from '@/types';
import { Trash2, Download, Eye } from 'lucide-react';

interface Props {
  calculations: CalculationData[];
  onLoad: (id: number) => void;
  onDelete: (id: number) => void;
  onExport: (data: CalculationData) => void;
}

const HistoryPanel: React.FC<Props> = ({ calculations, onLoad, onDelete, onExport }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border space-y-3">
      <h3 className="font-semibold">Riwayat Perhitungan</h3>
      {calculations.length === 0 ? (
        <p className="text-gray-500 text-sm">Belum ada data tersimpan.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {calculations.map((calc) => (
            <div key={calc.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
              <div>
                <p className="font-medium">{calc.businessName}</p>
                <p className="text-xs text-gray-500">{formatDate(calc.createdAt)}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => calc.id && onLoad(calc.id)} className="p-1 text-blue-600" title="Lihat">
                  <Eye size={18} />
                </button>
                <button onClick={() => calc.id && onExport(calc)} className="p-1 text-green-600" title="Export Excel">
                  <Download size={18} />
                </button>
                <button onClick={() => calc.id && onDelete(calc.id)} className="p-1 text-red-600" title="Hapus">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
