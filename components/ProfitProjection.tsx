import React, { useState } from 'react';
import { ProdukTurunan, HasilPerhitungan } from '@/types';

interface Props {
  produkTurunan: ProdukTurunan[];
  hasil: HasilPerhitungan;
  batchPerMonth: number;
  onTargetChange?: (target: number, hargaPilihan: number) => void;
}

const ProfitProjection: React.FC<Props> = ({ produkTurunan, hasil, batchPerMonth, onTargetChange }) => {
  const [targetLaba, setTargetLaba] = useState<number>(10000000);
  const [hargaPilihan, setHargaPilihan] = useState<number>(0);

  // Hitung proyeksi bulanan
  const totalBiayaProduksiBulanan = hasil.totalBiayaProduksi * batchPerMonth;
  const totalOmzetBulanan = hasil.totalPotensiPenjualan * batchPerMonth;
  const labaBulanan = totalOmzetBulanan - totalBiayaProduksiBulanan;

  // Biaya tetap dummy (bisa ditambahkan input nanti)
  const biayaTetap = 100000;

  const labaBersih = labaBulanan - biayaTetap;

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value) || 0;
    setTargetLaba(val);
    onTargetChange?.(val, hargaPilihan);
  };

  const handleHargaPilihan = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value) || 0;
    setHargaPilihan(val);
    onTargetChange?.(targetLaba, val);
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow border">
      <h3 className="font-semibold">Target & Proyeksi Penjualan</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600">Target Laba Bersih / Bulan</label>
          <input
            type="number"
            value={targetLaba}
            onChange={handleTargetChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Harga Jual Pilihan (Rp)</label>
          <select value={hargaPilihan} onChange={handleHargaPilihan} className="w-full p-2 border rounded">
            <option value={0}>-- Pilih --</option>
            {produkTurunan.map((p) => (
              <option key={p.id} value={p.hargaJual}>
                {p.nama} - Rp {p.hargaJual}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Potensi Omzet / Bulan</p>
          <p className="text-lg font-bold">Rp {totalOmzetBulanan.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Total Biaya Produksi / Bulan</p>
          <p className="text-lg font-bold">Rp {totalBiayaProduksiBulanan.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Total Biaya Tetap / Bulan</p>
          <p className="text-lg font-bold">Rp {biayaTetap.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-500">Proyeksi Laba Bersih / Bulan</p>
          <p className={`text-lg font-bold ${labaBersih >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Rp {labaBersih.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfitProjection;
