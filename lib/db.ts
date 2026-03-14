import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { CalculationData } from '@/types';

interface HPPCalculatorDB extends DBSchema {
  calculations: {
    key: number;
    value: CalculationData;
    indexes: { 'by-date': number };
  };
}

const dbName = 'hpp_calculator_db';
const storeName = 'calculations';

let dbPromise: Promise<IDBPDatabase<HPPCalculatorDB>> | null = null;

const getDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB<HPPCalculatorDB>(dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('by-date', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
};

export const saveCalculation = async (data: Omit<CalculationData, 'id'>) => {
  const db = await getDB();
  const id = await db.add(storeName, { ...data, createdAt: Date.now() });
  return id;
};

export const getAllCalculations = async (): Promise<CalculationData[]> => {
  const db = await getDB();
  return db.getAllFromIndex(storeName, 'by-date');
};

export const getCalculation = async (id: number): Promise<CalculationData | undefined> => {
  const db = await getDB();
  return db.get(storeName, id);
};

export const deleteCalculation = async (id: number) => {
  const db = await getDB();
  return db.delete(storeName, id);
};
