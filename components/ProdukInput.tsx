import React from 'react';
import { ProdukTurunan } from '@/types';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  produk: ProdukTurunan[];
  onChange: (produk: ProdukTurunan[]) => void;
}

const ProdukInput: React.FC<Props> = ({ produk, onChange }) => {
  const addProduk = () => {
    const newProduk: ProdukTurunan = {
      id: Date.now().toString() + Math.random(),
      nama: '',
      qty: 0,
      satuan: 'kg',
      hargaJual: 0,
    };
    onChange([...produk, newProduk]);
  };

  const updateProduk = (id: string, field: keyof ProdukTurunan, value: string | number) => {
    const updated = produk.map((p) =>
      p.id === id ? { ...p, [field]: field === 'nama' || field === 'satuan' ? value : Number(value) || 0 } : p
    );
    onChange(updated);
  };

  const removeProduk = (id: string) => {
    onChange(produk.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Produk Turunan</h3>
      {produk.map((p) => (
        <div key={p.id} className="grid grid-cols-12 gap-2 items-center">
          <input
            type="text"
            placeholder="Nama produk"
            value={p.nama}
            onChange={(e) => updateProduk(p.id, 'nama', e.target.value)}
            className="col-span-3 p-2 border rounded text-sm"
          />
          <input
            type="number"
            placeholder="Qty"
            value={p.qty || ''}
            onChange={(e) => updateProduk(p.id, 'qty', e.target.value)}
            className="col-span-2 p-2 border rounded text-sm"
          />
          <input
            type="text"
            placeholder="Satuan"
            value={p.satuan}
            onChange={(e) => updateProduk(p.id, 'satuan', e.target.value)}
            className="col-span-2 p-2 border rounded text-sm"
          />
          <input
            type="number"
            placeholder="Harga jual"
            value={p.hargaJual || ''}
            onChange={(e) => updateProduk(p.id, 'hargaJual', e.target.value)}
            className="col-span-3 p-2 border rounded text-sm"
          />
          <button onClick={() => removeProduk(p.id)} className="col-span-1 text-red-500">
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button
        onClick={addProduk}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
      >
        <Plus size={16} /> Tambah Produk
      </button>
    </div>
  );
};

export default ProdukInput;
