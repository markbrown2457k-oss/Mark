import React from 'react';
import { Ruler, ArrowUpFromLine, Users, Banknote } from 'lucide-react';
import { LocationData } from '../types';

interface FeaturesProps {
  location: LocationData;
}

export const Features: React.FC<FeaturesProps> = ({ location }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="flex items-center gap-2 text-gray-700">
        <div className="p-2 bg-red-50 rounded-lg text-red-600">
          <Ruler size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Площадь</p>
          <p className="font-semibold">{location.area} м²</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-gray-700">
        <div className="p-2 bg-red-50 rounded-lg text-red-600">
          <ArrowUpFromLine size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Этаж</p>
          <p className="font-semibold">{location.floor}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-700">
        <div className="p-2 bg-red-50 rounded-lg text-red-600">
          <Banknote size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Аренда</p>
          <p className="font-semibold">{location.price.toLocaleString()} ₽</p>
        </div>
      </div>
      
       <div className="flex items-center gap-2 text-gray-700">
        <div className="p-2 bg-red-50 rounded-lg text-red-600">
          <Users size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Соседи</p>
          <p className="font-medium text-sm truncate w-24" title={location.neighbors.join(', ')}>
             {location.neighbors[0]}...
          </p>
        </div>
      </div>
    </div>
  );
};