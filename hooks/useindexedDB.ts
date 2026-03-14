import { useEffect, useState } from 'react';
import { getAllCalculations, saveCalculation, deleteCalculation, getCalculation } from '@/lib/db';
import { CalculationData } from '@/types';

export const useIndexedDB = () => {
  const [calculations, setCalculations] = useState<CalculationData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCalculations = async () => {
    setLoading(true);
    try {
      const data = await getAllCalculations();
      setCalculations(data);
    } catch (error) {
      console.error('Failed to load calculations', error);
    } finally {
      setLoading(false);
    }
  };

  const save = async (data: Omit<CalculationData, 'id' | 'createdAt'>) => {
    const id = await saveCalculation(data);
    await loadCalculations();
    return id;
  };

  const remove = async (id: number) => {
    await deleteCalculation(id);
    await loadCalculations();
  };

  const get = async (id: number) => {
    return await getCalculation(id);
  };

  useEffect(() => {
    loadCalculations();
  }, []);

  return { calculations, loading, save, remove, get };
};
