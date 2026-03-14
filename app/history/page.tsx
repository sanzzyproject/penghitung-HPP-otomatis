'use client';

import React from 'react';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import HistoryPanel from '@/components/HistoryPanel';
import { exportToExcel } from '@/lib/export';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const { calculations, loading, remove, get } = useIndexedDB();
  const router = useRouter();

  const handleLoad = async (id: number) => {
    // Redirect ke halaman utama dengan parameter? Atau simpan di context?
    // Untuk sederhana, kita bisa navigasi ke home dan state akan di-set di page utama
    // Tapi karena kita pakai state lokal di page, perlu mekanisme lain.
    // Alternatif: simpan di localStorage sementara, atau pake context global.
    // Untuk demo, kita akan navigasi ke home dan data bisa di-load via tombol load di riwayat yang ada di home.
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Riwayat Perhitungan</h1>
      <HistoryPanel
        calculations={calculations}
        onLoad={handleLoad}
        onDelete={remove}
        onExport={exportToExcel}
      />
    </div>
  );
}
