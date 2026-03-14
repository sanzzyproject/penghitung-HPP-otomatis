import * as XLSX from 'xlsx';
import { CalculationData } from '@/types';

export const exportToExcel = (data: CalculationData) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Ringkasan
  const ringkasan = [
    ['Nama Bisnis', data.businessName],
    ['Mode Bisnis', data.businessMode],
    ['Batch per Bulan', data.batchPerMonth],
    ['Total Biaya Produksi', data.hasilPerhitungan?.totalBiayaProduksi],
    ['Total Potensi Penjualan', data.hasilPerhitungan?.totalPotensiPenjualan],
    ['Proyeksi Laba', data.hasilPerhitungan?.proyeksiLaba],
  ];
  const wsRingkasan = XLSX.utils.aoa_to_sheet(ringkasan);
  XLSX.utils.book_append_sheet(wb, wsRingkasan, 'Ringkasan');

  // Sheet 2: Bahan Baku
  const bahanBakuData = data.bahanBaku.map((b) => [b.nama, b.hargaTotal, b.jumlah, b.satuan]);
  bahanBakuData.unshift(['Nama', 'Harga Total', 'Jumlah', 'Satuan']);
  const wsBahan = XLSX.utils.aoa_to_sheet(bahanBakuData);
  XLSX.utils.book_append_sheet(wb, wsBahan, 'Bahan Baku');

  // Sheet 3: Biaya Pengolahan
  const biayaData = data.biayaPengolahan.map((b) => [b.nama, b.harga, b.periode]);
  biayaData.unshift(['Nama', 'Harga', 'Periode']);
  const wsBiaya = XLSX.utils.aoa_to_sheet(biayaData);
  XLSX.utils.book_append_sheet(wb, wsBiaya, 'Biaya Pengolahan');

  // Sheet 4: Produk Turunan
  const produkData = data.produkTurunan.map((p) => [p.nama, p.qty, p.satuan, p.hargaJual]);
  produkData.unshift(['Nama', 'Qty', 'Satuan', 'Harga Jual']);
  const wsProduk = XLSX.utils.aoa_to_sheet(produkData);
  XLSX.utils.book_append_sheet(wb, wsProduk, 'Produk Turunan');

  // Sheet 5: HPP per Produk
  if (data.hasilPerhitungan) {
    const hppData = data.hasilPerhitungan.hppPerProduk.map((h) => [h.nama, h.qty, h.alokasiBiaya, h.hppPerUnit]);
    hppData.unshift(['Nama', 'Qty', 'Alokasi Biaya', 'HPP per Unit']);
    const wsHPP = XLSX.utils.aoa_to_sheet(hppData);
    XLSX.utils.book_append_sheet(wb, wsHPP, 'HPP per Produk');
  }

  // Export file
  XLSX.writeFile(wb, `${data.businessName}_perhitungan.xlsx`);
};
