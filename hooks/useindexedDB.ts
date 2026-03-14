import { useState, useEffect } from 'react';
import { DataPerhitungan } from '@/types';

export function useIndexedDB() {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const request = indexedDB.open('HPPDatabase', 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('perhitungan')) {
        const store = db.createObjectStore('perhitungan', { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      setDb((event.target as IDBOpenDBRequest).result);
      setIsReady(true);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
    };
  }, []);

  const simpanPerhitungan = async (data: DataPerhitungan): Promise<void> => {
    if (!db) throw new Error('Database not ready');
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('perhitungan', 'readwrite');
      const store = transaction.objectStore('perhitungan');
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const ambilRiwayat = async (): Promise<DataPerhitungan[]> => {
    if (!db) throw new Error('Database not ready');
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('perhitungan', 'readonly');
      const store = transaction.objectStore('perhitungan');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const hapusPerhitungan = async (id: string): Promise<void> => {
    if (!db) throw new Error('Database not ready');
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('perhitungan', 'readwrite');
      const store = transaction.objectStore('perhitungan');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const muatPerhitungan = async (id: string): Promise<DataPerhitungan | undefined> => {
    if (!db) throw new Error('Database not ready');
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('perhitungan', 'readonly');
      const store = transaction.objectStore('perhitungan');
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  return { isReady, simpanPerhitungan, ambilRiwayat, hapusPerhitungan, muatPerhitungan };
}
