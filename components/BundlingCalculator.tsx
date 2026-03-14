import React, { useState, useEffect } from 'react';
import { ProdukTurunan, HPPPerProduk } from '@/types';
import { hitungBundling } from '@/lib/calculations';

interface Props {
  produkTurunan: ProdukTurunan[];
  hppPerProduk: HPPPerProduk[];
}

const BundlingCalculator: React.FC<Props> = ({ produkTurunan, hppPerProduk }) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bundlingResult, setBundlingResult] = useState<any>(null);

  const produkMap = new Map(produkTurunan.map((p) => [p.id, p]));

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (selectedProducts.length === 0) {
      setBundlingResult(null);
      return;
    }
    const produkDipilih = selectedProducts.map((id) => produkMap.get(id)).filter((p) => p !== undefined) as ProdukTurunan[];
    const result = hitungBundling(produkDipilih, produkTurunan, hppPerProduk);
    setBundlingResult(result);
  }, [selectedProducts, produkTurunan, hppPerProduk]);

  return (
    <div className="bg-white p-4 rounded-lg shadow border space-y-4">
      <h3 className="font-semibold">Buat Paket Bundling</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Pilih produk untuk dibundel:</p>
        <div className="flex flex-wrap gap-2">
          {produkTurunan.map((p) => (
            <button
              key={p.id}
              onClick={() => toggleProduct(p.id)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedProducts.includes(p.id)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              {p.nama}
            </button>
          ))}
        </div>
      </div>

      {bundlingResult && (
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm">Total HPP Gabungan: <span className="font-semibold">Rp {bundlingResult.totalHPP.toLocaleString()}</span></p>
            <p className="text-sm">Total Harga Jual Normal: <span className="font-semibold">Rp {bundlingResult.hargaNormal.toLocaleString()}</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Paket Hemat */}
            <div className="border rounded-lg p-3 bg-green-50">
              <h4 className="font-bold text-lg">Paket Hemat</h4>
              <p className="text-2xl font-bold">Rp {bundlingResult.hargaHemat.toLocaleString()}</p>
              <p className="text-sm line-through text-gray-500">Rp {bundlingResult.hargaNormal.toLocaleString()}</p>
              <p className="text-sm">Diskon: Rp {(bundlingResult.hargaNormal - bundlingResult.hargaHemat).toLocaleString()}</p>
              <p className="text-sm">Profit: Rp {bundlingResult.profitHemat.toLocaleString()}</p>
              <p className="text-sm">Margin: {bundlingResult.marginHemat.toFixed(1)}%</p>
              <p className="text-xs text-gray-600 mt-1">Menarik pelanggan baru & mendorong volume penjualan tinggi dengan diskon besar.</p>
            </div>

            {/* Paling Seimbang */}
            <div className="border rounded-lg p-3 bg-blue-50">
              <h4 className="font-bold text-lg">Paling Seimbang</h4>
              <p className="text-2xl font-bold">Rp {bundlingResult.hargaSeimbang.toLocaleString()}</p>
              <p className="text-sm line-through text-gray-500">Rp {bundlingResult.hargaNormal.toLocaleString()}</p>
              <p className="text-sm">Diskon: Rp {(bundlingResult.hargaNormal - bundlingResult.hargaSeimbang).toLocaleString()}</p>
              <p className="text-sm">Profit: Rp {bundlingResult.profitSeimbang.toLocaleString()}</p>
              <p className="text-sm">Margin: {bundlingResult.marginSeimbang.toFixed(1)}%</p>
              <p className="text-xs text-gray-600 mt-1">Keseimbangan optimal antara daya tarik harga dan profitabilitas yang sehat.</p>
            </div>

            {/* Profit Maksimal */}
            <div className="border rounded-lg p-3 bg-purple-50">
              <h4 className="font-bold text-lg">Profit Maksimal</h4>
              <p className="text-2xl font-bold">Rp {bundlingResult.hargaMaksimal.toLocaleString()}</p>
              <p className="text-sm line-through text-gray-500">Rp {bundlingResult.hargaNormal.toLocaleString()}</p>
              <p className="text-sm">Diskon: Rp {(bundlingResult.hargaNormal - bundlingResult.hargaMaksimal).toLocaleString()}</p>
              <p className="text-sm">Profit: Rp {bundlingResult.profitMaksimal.toLocaleString()}</p>
              <p className="text-sm">Margin: {bundlingResult.marginMaksimal.toFixed(1)}%</p>
              <p className="text-xs text-gray-600 mt-1">Memaksimalkan profit per transaksi, cocok untuk pelanggan yang tidak terlalu sensitif harga.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BundlingCalculator;
