export interface BahanBaku {
  id: string;
  nama: string;
  hargaTotal: number;
  jumlah: number;
  satuan: string;
}

export interface BiayaPengolahan {
  id: string;
  nama: string;
  harga: number;
  periode: 'per_batch' | 'per_bulan';
}

export interface ProdukTurunan {
  id: string;
  nama: string;
  qty: number;
  satuan: string;
  hargaJual: number;
}

export interface HPPPerProduk {
  nama: string;
  qty: number;
  alokasiBiaya: number;
  hppPerUnit: number;
}

export interface HasilPerhitungan {
  totalBiayaProduksi: number;
  totalPotensiPenjualan: number;
  proyeksiLaba: number;
  hppPerProduk: HPPPerProduk[];
}

export interface Bundling {
  id: string;
  produkIds: string[];
  totalHPP: number;
  hargaNormal: number;
  hargaHemat: number;
  hargaSeimbang: number;
  hargaMaksimal: number;
}

export interface CalculationData {
  id?: number;
  businessName: string;
  businessMode: string;
  batchPerMonth: number;
  bahanBaku: BahanBaku[];
  biayaPengolahan: BiayaPengolahan[];
  produkTurunan: ProdukTurunan[];
  hasilPerhitungan?: HasilPerhitungan;
  bundling?: Bundling[];
  createdAt: number;
}
