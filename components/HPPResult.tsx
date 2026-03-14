import React from 'react';
import { HasilPerhitungan } from '@/types';

interface Props {
  hasil: HasilPerhitungan;
}

const HPPResult: React.FC<Props> = ({ hasil }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Total Biaya Produksi</p>
          <p className="text-2xl font-bold">Rp {hasil.totalBiayaProduksi.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Total Potensi Penjualan</p>
          <p className="text-2xl font-bold">Rp {hasil.totalPotensiPenjualan.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Proyeksi Laba / (Rugi)</p>
          <p className={`text-2xl font-bold ${hasil.proyeksiLaba >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Rp {hasil.proyeksiLaba.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border">
        <h4 className="font-semibold mb-3">Detail HPP per Produk</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Nama Produk</th>
                <th className="text-left py-2">Qty</th>
                <th className="text-left py-2">Alokasi Biaya</th>
                <th className="text-left py-2">HPP per Satuan</th>
              </tr>
            </thead>
            <tbody>
              {hasil.hppPerProduk.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2">{item.nama}</td>
                  <td className="py-2">{item.qty}</td>
                  <td className="py-2">Rp {item.alokasiBiaya.toLocaleString()}</td>
                  <td className="py-2">Rp {item.hppPerUnit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HPPResult;
