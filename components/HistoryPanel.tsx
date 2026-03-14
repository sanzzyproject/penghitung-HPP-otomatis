'use client';
import { useState, useEffect } from 'react';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { DataPerhitungan } from '@/types';
import { Clock, Trash2 } from 'lucide-react';

export default function HistoryPanel({ onLoad }: { onLoad: (data: DataPerhitungan) => void }) {
  const [history, setHistory] = useState<DataPerhitungan[]>([]);
  const [open, setOpen] = useState(false);
  const { isReady, ambilRiwayat, hapusPerhitungan } = useIndexedDB();

  const load = async () => {
    if (!isReady) return;
    const data = await ambilRiwayat();
    setHistory(data);
  };

  useEffect(() => {
    if (open && isReady) {
      load();
    }
  }, [open, isReady]);

  const hapus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await hapusPerhitungan(id);
    load(); // reload setelah hapus
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
        <Clock className="w-5 h-5" /> Riwayat
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold">Riwayat Perhitungan</h3>
            <button onClick={() => setOpen(false)} className="text-gray-500">Tutup</button>
          </div>
          {!isReady ? (
            <p className="p-4 text-gray-400">Memuat...</p>
          ) : history.length === 0 ? (
            <p className="p-4 text-gray-400">Kosong</p>
          ) : (
            <ul>
              {history.map(item => (
                <li
                  key={item.id}
                  onClick={() => { onLoad(item); setOpen(false); }}
                  className="p-3 border-b hover:bg-gray-50 cursor-pointer flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium">{item.namaBisnis}</p>
                    <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                    <p className="text-xs">Laba: Rp {item.hasil.laba.toLocaleString()}</p>
                  </div>
                  <button onClick={e => hapus(item.id, e)} className="text-red-500 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
