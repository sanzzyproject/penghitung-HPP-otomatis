import React from 'react';
import { Megaphone, ShoppingBag, Utensils, Factory, Leaf, Package } from 'lucide-react';

interface Props {
  selectedMode: string;
  onSelect: (mode: string) => void;
}

const modes = [
  { id: 'iklan-cod', label: 'Iklan & COD', icon: Megaphone },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  { id: 'ritel-fnb', label: 'Bisnis Ritel/F&B', icon: Utensils },
  { id: 'manufaktur', label: 'Manufaktur / Pabrik', icon: Factory },
  { id: 'produksi-turunan', label: 'Produksi Turunan', icon: Leaf },
  { id: 'jasa', label: 'Produk Jasa', icon: Package },
];

const BusinessModeSelector: React.FC<Props> = ({ selectedMode, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              isSelected
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium text-center">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BusinessModeSelector;
