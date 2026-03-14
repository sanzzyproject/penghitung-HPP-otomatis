import React from 'react';
import { BahanBaku } from '@/types';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  bahanBaku: BahanBaku[];
  onChange: (bahanBaku: BahanBaku[]) => void;
}

const BahanBakuInput: React.FC<Props> = ({ bahanBaku, onChange }) => {
  const addBahan = () => {
    const newBahan: BahanBaku = {
      id: Date.now().toString() + Math.random(),
      nama: '',
      hargaTotal: 0,
      jumlah: 0,
      satuan: 'kg',
    };
    onChange([...bahanBaku, newBahan]);
  };

  const updateBahan = (id: string, field: keyof BahanBaku, value: string | number) => {
    const updated = bahanBaku.map((b) =>
      b.id === id ? { ...b, [field]: field === 'nama' || field === 'satuan' ? value : Number(value) || 0 } : b
    );
    onChange(updated);
  };

  const removeBahan = (id: string) => {
    onChange(bahanBaku.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Bahan Baku Utama</h3>
      {bahanBaku.map((bahan) => (
        <div key={bahan.id} className="grid grid-cols-12 gap-2 items-center">
          <input
            type="text"
            placeholder="Nama"
            value={bahan.nama}
            onChange={(e) => updateBahan(bahan.id, 'nama', e.target.value)}
            className="col-span-3 p-2 border rounded text-sm"
          />
          <input
            type="number"
            placeholder="Harga Total"
            value={bahan.hargaTotal || ''}
            onChange={(e) => updateBahan(bahan.id, 'hargaTotal', e.target.value)}
            className="col-span-2 p-2 border rounded text-sm"
          />
          <input
            type="number"
            placeholder="Jumlah"
            value={bahan.jumlah || ''}
            onChange={(e) => updateBahan(bahan.id, 'jumlah', e.target.value)}
            className="col-span-2 p-2 border rounded text-sm"
          />
          <input
            type="text"
            placeholder="Satuan"
            value={bahan.satuan}
            onChange={(e) => updateBahan(bahan.id, 'satuan', e.target.value)}
            className="col-span-2 p-2 border rounded text-sm"
          />
          <button onClick={() => removeBahan(bahan.id)} className="col-span-1 text-red-500">
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button
        onClick={addBahan}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
      >
        <Plus size={16} /> Tambah Bahan
      </button>
    </div>
  );
};

export default BahanBakuInput;
