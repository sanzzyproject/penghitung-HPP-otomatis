import React from 'react';
import { BiayaPengolahan } from '@/types';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  biaya: BiayaPengolahan[];
  onChange: (biaya: BiayaPengolahan[]) => void;
}

const BiayaInput: React.FC<Props> = ({ biaya, onChange }) => {
  const addBiaya = () => {
    const newBiaya: BiayaPengolahan = {
      id: Date.now().toString() + Math.random(),
      nama: '',
      harga: 0,
      periode: 'per_batch',
    };
    onChange([...biaya, newBiaya]);
  };

  const updateBiaya = (id: string, field: keyof BiayaPengolahan, value: string | number) => {
    const updated = biaya.map((b) =>
      b.id === id ? { ...b, [field]: field === 'nama' ? value : field === 'periode' ? value : Number(value) || 0 } : b
    );
    onChange(updated);
  };

  const removeBiaya = (id: string) => {
    onChange(biaya.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Biaya Pengolahan</h3>
      {biaya.map((b) => (
        <div key={b.id} className="grid grid-cols-12 gap-2 items-center">
          <input
            type="text"
            placeholder="Nama biaya"
            value={b.nama}
            onChange={(e) => updateBiaya(b.id, 'nama', e.target.value)}
            className="col-span-4 p-2 border rounded text-sm"
          />
          <input
            type="number"
            placeholder="Harga"
            value={b.harga || ''}
            onChange={(e) => updateBiaya(b.id, 'harga', e.target.value)}
            className="col-span-3 p-2 border rounded text-sm"
          />
          <select
            value={b.periode}
            onChange={(e) => updateBiaya(b.id, 'periode', e.target.value)}
            className="col-span-3 p-2 border rounded text-sm"
          >
            <option value="per_batch">Per Batch</option>
            <option value="per_bulan">Per Bulan</option>
          </select>
          <button onClick={() => removeBiaya(b.id)} className="col-span-1 text-red-500">
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button
        onClick={addBiaya}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
      >
        <Plus size={16} /> Tambah Biaya
      </button>
    </div>
  );
};

export default BiayaInput;
