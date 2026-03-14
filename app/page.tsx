'use client';
import { useState, useEffect } from 'react';
import BusinessModeSelector from '@/components/BusinessModeSelector';
import InputBahanBaku from '@/components/InputBahanBaku';
import InputBiaya from '@/components/InputBiaya';
import InputProduk from '@/components/InputProduk';
import HPPResult from '@/components/HPPResult';
import ProfitProjection from '@/components/ProfitProjection';
import BundlingCalculator from '@/components/BundlingCalculator';
import HistoryPanel from '@/components/HistoryPanel';
import ExportButton from '@/components/ExportButton';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { hitungHasilPerhitungan, hitungProyeksiBulanan } from '@/lib/calculator';
import { BahanBaku, Biaya, Produk, HasilPerhitungan, DataPerhitungan, ProyeksiBulanan } from '@/types';

export default function Home() {
  const [mode, setMode] = useState('produksi');
  const [namaBisnis, setNamaBisnis] = useState('Pengolahan Kelapa');
  const [batchPerBulan, setBatchPerBulan] = useState(1);
  const [bahanBaku, setBahanBaku] = useState<BahanBaku[]>([
    { id: '1', nama: 'Kelapa Utuh', harga: 15000000, jumlah: 1000, satuan: 'kg' }
  ]);
  const [biaya, setBiaya] = useState<Biaya[]>([
    { id: '1', nama: 'Upah Tenaga Pengupasan', harga: 150000, periode: 'Per Batch' },
    { id: '2', nama: 'Biaya Operasional Mesin', harga: 200000, periode: 'Per Batch' },
    { id: '3', nama: 'Biaya Pengemasan', harga: 100000, periode: 'Per Batch' },
  ]);
  const [produk, setProduk] = useState<Produk[]>([
    { id: '1', nama: 'Santan Kelapa', qty: 300, satuan: 'kg', hargaJual: 20000 },
    { id: '2', nama: 'Daging Kelapa Parut', qty: 300, satuan: 'kg', hargaJual: 25000 },
    { id: '3', nama: 'Minyak Kelapa Murni (VCO)', qty: 150, satuan: 'kg', hargaJual: 50000 },
    { id: '4', nama: 'Air Kelapa Kemasan', qty: 250, satuan: 'kg', hargaJual: 10000 },
    { id: '5', nama: 'Sabut Kelapa Kering', qty: 100, satuan: 'kg', hargaJual: 5000 },
  ]);
  const [hasil, setHasil] = useState<HasilPerhitungan | null>(null);
  const [targetLaba, setTargetLaba] = useState(10000000);
  const [biayaTetap, setBiayaTetap] = useState(100000);
  const [proyeksi, setProyeksi] = useState<ProyeksiBulanan | null>(null);

  const { isReady, simpanPerhitungan } = useIndexedDB();

  useEffect(() => {
    if (bahanBaku.length && produk.length) {
      const h = hitungHasilPerhitungan(bahanBaku, biaya, produk, batchPerBulan);
      setHasil(h);
    } else setHasil(null);
  }, [bahanBaku, biaya, produk, batchPerBulan]);

  useEffect(() => {
    if (hasil) setProyeksi(hitungProyeksiBulanan(hasil, batchPerBulan, biayaTetap, targetLaba));
    else setProyeksi(null);
  }, [hasil, batchPerBulan, biayaTetap, targetLaba]);

  const handleSimpan = async () => {
    if (!hasil || !isReady) return;
    const data: DataPerhitungan = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      mode,
      namaBisnis,
      batchPerBulan,
      bahanBaku,
      biaya,
      produk,
      targetLaba,
      hasil,
    };
    try {
      await simpanPerhitungan(data);
      alert('Disimpan!');
    } catch (error) {
      alert('Gagal menyimpan');
    }
  };

  const handleLoad = (data: DataPerhitungan) => {
    setMode(data.mode);
    setNamaBisnis(data.namaBisnis);
    setBatchPerBulan(data.batchPerBulan);
    setBahanBaku(data.bahanBaku);
    setBiaya(data.biaya);
    setProduk(data.produk);
    if (data.targetLaba) setTargetLaba(data.targetLaba);
  };

  const handleSetHargaJual = (harga: number) => {
    setProduk(prev => prev.map(p => ({ ...p, hargaJual: harga })));
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Kalkulator HPP Bisnis</h1>
          <div className="flex gap-2">
            <HistoryPanel onLoad={handleLoad} />
            {hasil && (
              <ExportButton
                data={{
                  id: '',
                  timestamp: Date.now(),
                  mode,
                  namaBisnis,
                  batchPerBulan,
                  bahanBaku,
                  biaya,
                  produk,
                  targetLaba,
                  hasil,
                }}
                proyeksi={proyeksi || undefined}
              />
            )}
          </div>
        </div>

        <BusinessModeSelector selectedMode={mode} onSelect={setMode} />

        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Nama Bisnis / Produk Utama</label>
              <input type="text" value={namaBisnis} onChange={e => setNamaBisnis(e.target.value)} className="mt-1 block w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Jumlah Batch per Bulan</label>
              <input type="number" value={batchPerBulan} onChange={e => setBatchPerBulan(Number(e.target.value))} className="mt-1 block w-full border rounded-md px-3 py-2" min="1" />
            </div>
          </div>
          <InputBahanBaku bahanBaku={bahanBaku} onChange={setBahanBaku} />
          <InputBiaya biaya={biaya} onChange={setBiaya} />
          <InputProduk produk={produk} onChange={setProduk} />
          <button onClick={handleSimpan} className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg">Simpan Perhitungan</button>
        </div>

        {hasil && (
          <div className="bg-white p-4 rounded-xl shadow space-y-6">
            <HPPResult hasil={hasil} produk={produk} />
            <button onClick={handleSimpan} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Simpan Perhitungan</button>
          </div>
        )}

        {hasil && (
          <div className="bg-white p-4 rounded-xl shadow space-y-6">
            <ProfitProjection hasil={hasil} batchPerBulan={batchPerBulan} onSetHargaJual={handleSetHargaJual} />
          </div>
        )}

        {hasil && (
          <div className="bg-white p-4 rounded-xl shadow space-y-6">
            <BundlingCalculator produk={produk} hasilRincian={hasil.rincianProduk} />
          </div>
        )}
      </div>
    </main>
  );
}
