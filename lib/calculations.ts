import { BahanBaku, BiayaPengolahan, ProdukTurunan, HasilPerhitungan, HPPPerProduk } from '@/types';

export const hitungTotalBiayaProduksi = (
  bahanBaku: BahanBaku[],
  biayaPengolahan: BiayaPengolahan[],
  batchPerMonth: number
): number => {
  const totalBahan = bahanBaku.reduce((sum, b) => sum + b.hargaTotal, 0);
  const totalBiayaPengolahan = biayaPengolahan.reduce((sum, b) => {
    if (b.periode === 'per_batch') return sum + b.harga;
    else return sum + b.harga / batchPerMonth;
  }, 0);
  return totalBahan + totalBiayaPengolahan;
};

export const hitungHasilPerhitungan = (
  bahanBaku: BahanBaku[],
  biayaPengolahan: BiayaPengolahan[],
  produkTurunan: ProdukTurunan[],
  batchPerMonth: number
): HasilPerhitungan => {
  const totalBiayaProduksi = hitungTotalBiayaProduksi(bahanBaku, biayaPengolahan, batchPerMonth);
  const totalPotensiPenjualan = produkTurunan.reduce((sum, p) => sum + p.qty * p.hargaJual, 0);

  // Alokasi biaya berdasarkan proporsi nilai jual
  const totalNilaiJual = totalPotensiPenjualan;
  const hppPerProduk: HPPPerProduk[] = produkTurunan.map((p) => {
    const proporsi = totalNilaiJual > 0 ? (p.qty * p.hargaJual) / totalNilaiJual : 0;
    const alokasiBiaya = proporsi * totalBiayaProduksi;
    const hppPerUnit = p.qty > 0 ? alokasiBiaya / p.qty : 0;
    return {
      nama: p.nama,
      qty: p.qty,
      alokasiBiaya,
      hppPerUnit,
    };
  });

  return {
    totalBiayaProduksi,
    totalPotensiPenjualan,
    proyeksiLaba: totalPotensiPenjualan - totalBiayaProduksi,
    hppPerProduk,
  };
};

export const hitungBundling = (
  produkDipilih: ProdukTurunan[],
  semuaProduk: ProdukTurunan[],
  hppPerProduk: HPPPerProduk[]
): {
  totalHPP: number;
  hargaNormal: number;
  hargaHemat: number;
  hargaSeimbang: number;
  hargaMaksimal: number;
  profitHemat: number;
  profitSeimbang: number;
  profitMaksimal: number;
  marginHemat: number;
  marginSeimbang: number;
  marginMaksimal: number;
} => {
  const totalHPP = produkDipilih.reduce((sum, p) => {
    const hpp = hppPerProduk.find((h) => h.nama === p.nama)?.hppPerUnit || 0;
    return sum + hpp * p.qty;
  }, 0);
  const hargaNormal = produkDipilih.reduce((sum, p) => sum + p.qty * p.hargaJual, 0);

  // Diskon: hemat 20%, seimbang 12.5%, maksimal 5%
  const hargaHemat = Math.round(hargaNormal * 0.8);
  const hargaSeimbang = Math.round(hargaNormal * 0.875);
  const hargaMaksimal = Math.round(hargaNormal * 0.95);

  const profitHemat = hargaHemat - totalHPP;
  const profitSeimbang = hargaSeimbang - totalHPP;
  const profitMaksimal = hargaMaksimal - totalHPP;

  const marginHemat = (profitHemat / hargaHemat) * 100;
  const marginSeimbang = (profitSeimbang / hargaSeimbang) * 100;
  const marginMaksimal = (profitMaksimal / hargaMaksimal) * 100;

  return {
    totalHPP,
    hargaNormal,
    hargaHemat,
    hargaSeimbang,
    hargaMaksimal,
    profitHemat,
    profitSeimbang,
    profitMaksimal,
    marginHemat,
    marginSeimbang,
    marginMaksimal,
  };
};
