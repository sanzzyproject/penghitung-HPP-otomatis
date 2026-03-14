'use client';

import React, { useState, useEffect } from 'react';
import BusinessModeSelector from '@/components/BusinessModeSelector';
import BahanBakuInput from '@/components/BahanBakuInput';
import BiayaInput from '@/components/BiayaInput';
import ProdukInput from '@/components/ProdukInput';
import HPPResult from '@/components/HPPResult';
import ProfitProjection from '@/components/ProfitProjection';
import ChartProfit from '@/components/ChartProfit';
import BundlingCalculator from '@/components/BundlingCalculator';
import HistoryPanel from '@/components/HistoryPanel';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { hitungHasilPerhitungan } from '@/lib/calculations';
import { exportToExcel } from '@/lib/export';
import { BahanBaku, BiayaPengolahan, ProdukTurunan, HasilPerhitungan, CalculationData } from '@/types';
import { Save, Download, Calculator } from 'lucide-react';

export default function Home() {
  const { calculations, loading, save, remove, get } = useIndexedDB();

  // State utama
  const [businessName, setBusinessName] = useState('');
  const [businessMode, setBusinessMode] = useState('produksi-turunan');
  const [batchPerMonth, setBatchPerMonth] = useState(1);
  const [bahanBaku, setBahanBaku] = useState<BahanBaku[]>([]);
  const [biayaPengolahan, setBiayaPengolahan] = useState<BiayaPengolahan[]>([]);
  const [produkTurunan, setProdukTurunan] = useState<ProdukTurunan[]>([]);
  const [hasil, setHasil] = useState<HasilPerhitungan | null>(null);
  const [targetLaba, setTargetLaba] = useState(10000000);
  const [hargaPilihan, setHargaPilihan] = useState(0);

  // Hitung HPP
  const handleHitung = () => {
    const result = hitungHasilPerhitungan(bahanBaku, biayaPengolahan, produkTurunan, batchPerMonth);
    setHasil(result);
  };

  // Simpan ke IndexedDB
  const handleSave = async () => {
    if (!hasil) {
      alert('Hitung HPP terlebih dahulu!');
      return;
    }
    const data: Omit<CalculationData, 'id' | 'createdAt'> = {
      businessName,
      businessMode,
      batchPerMonth,
      bahanBaku,
      biayaPengolahan,
      produkTurunan,
      hasilPerhitungan: hasil,
      bundling: [], // bisa ditambahkan nanti
    };
    await save(data);
    alert('Perhitungan disimpan!');
  };

  // Load data dari riwayat
  const handleLoad = async (id: number) => {
    const data = await get(id);
    if (data) {
      setBusinessName(data.businessName);
      setBusinessMode(data.businessMode);
      setBatchPerMonth(data.batchPerMonth);
      setBahanBaku(data.bahanBaku);
      setBiayaPengolahan(data.biayaPengolahan);
      setProdukTurunan(data.produkTurunan);
      if (data.hasilPerhitungan) setHasil(data.hasilPerhitungan);
    }
  };

  // Export Excel
  const handleExport = (data: CalculationData) => {
    exportToExcel(data);
  };

  // Proyeksi laba bulanan untuk grafik
  const labaBulanan = hasil ? (hasil.totalPotensiPenjualan - hasil.totalBiayaProduksi) * batchPerMonth - 100000 : 0;

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Kalkulator HPP & Bundling</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Form Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mode Bisnis */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h2 className="font-semibold mb-3">Pilih Mode Bisnis</h2>
            <BusinessModeSelector selectedMode={businessMode} onSelect={setBusinessMode} />
          </div>

          {/* Data Bisnis */}
          <div className="bg-white p-4 rounded-lg shadow border space-y-4">
            <div>
              <label className="block text-sm font-medium">Nama Bisnis / Produk Utama</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                placeholder="Contoh: Pengolahan Kelapa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Jumlah Batch Produksi per Bulan</label>
              <input
                type="number"
                min="1"
                value={batchPerMonth}
                onChange={(e) => setBatchPerMonth(Number(e.target.value) || 1)}
                className="w-full p-2 border rounded mt-1"
              />
            </div>
          </div>

          {/* Bahan Baku */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <BahanBakuInput bahanBaku={bahanBaku} onChange={setBahanBaku} />
          </div>

          {/* Biaya Pengolahan */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <BiayaInput biaya={biayaPengolahan} onChange={setBiayaPengolahan} />
          </div>

          {/* Produk Turunan */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <ProdukInput produk={produkTurunan} onChange={setProdukTurunan} />
          </div>

          {/* Tombol Hitung */}
          <button
            onClick={handleHitung}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Calculator size={20} />
            Hitung HPP & Proyeksi
          </button>

          {/* Hasil Perhitungan */}
          {hasil && (
            <>
              <HPPResult hasil={hasil} />
              <ProfitProjection
                produkTurunan={produkTurunan}
                hasil={hasil}
                batchPerMonth={batchPerMonth}
                onTargetChange={(target, harga) => {
                  setTargetLaba(target);
                  setHargaPilihan(harga);
                }}
              />
              <ChartProfit labaBulanan={labaBulanan} />
              <BundlingCalculator produkTurunan={produkTurunan} hppPerProduk={hasil.hppPerProduk} />
            </>
          )}
        </div>

        {/* Kolom Kanan: Riwayat & Simpan */}
        <div className="space-y-6">
          {/* Tombol Simpan */}
          {hasil && (
            <button
              onClick={handleSave}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Simpan Perhitungan
            </button>
          )}

          {/* Riwayat */}
          <HistoryPanel
            calculations={calculations}
            onLoad={handleLoad}
            onDelete={remove}
            onExport={handleExport}
          />
        </div>
      </div>
    </main>
  );
}
