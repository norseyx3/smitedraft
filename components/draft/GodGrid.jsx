// File: src/components/draft/GodGrid.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// SMITE 2 Gods list
const GODS = [
  'Achilles',
  'Agni',
  'Aladdin',
  'Amaterasu',
  'Anhur',
  'Anubis',
  'Aphrodite',
  'Apollo',
  'Ares',
  'Artemis',
  'Artio',
  'Athena',
  'Awilix',
  'Bacchus',
  'Baron Samedi',
  'Bellona',
  'Cabrakan',
  'Cerberus',
  'Cernunnos',
  'Chaac',
  'Cupid',
  'Da Ji',
  'Danzaburou',
  'Eset',
  'Fenrir',
  'Ganesha',
  'Geb',
  'Guan Yu',
  'Hades',
  'Hecate',
  'Hercules',
  'Hou Yi',
  'Hua Mulan',
  'Hun Batz',
  'Izanami',
  'Janus',
  'Jing Wei',
  'Jormungandr',
  'Kali',
  'Khepri',
  'Kukulkan',
  'Loki',
  'Medusa',
  'Mercury',
  'Merlin',
  'Mordred',
  'Neith',
  'Nemesis',
  'Nu Wa',
  'Odin',
  'Osiris',
  'Pele',
  'Poseidon',
  'Princess Bari',
  'Ra',
  'Rama',
  'Scylla',
  'Sobek',
  'Sol',
  'Sun Wukong',
  'Susano',
  'Sylvanus',
  'Thanatos',
  'The Morrigan',
  'Thor',
  'Tsukuyomi',
  'Ullr',
  'Vulcan',
  'Xbalanque',
  'Yemoja',
  'Ymir',
  'Zeus'
];

export default function GodGrid({ unavailableGods = [], onSelect, canInteract, selectedGod }) {
  const [search, setSearch] = useState('');

  const filteredGods = GODS.filter(god => 
    god.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search gods..."
          className="pl-10 bg-slate-700 border-blue-500/30 text-white placeholder:text-slate-400"
        />
      </div>

      <div className="grid grid-cols-7 gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredGods.map((god) => {
          const isUnavailable = unavailableGods.includes(god);
          const isBanned = unavailableGods.slice(0, 10).includes(god) && !unavailableGods.slice(10).includes(god);
          const isSelected = selectedGod === god;
          
          return (
            <button
              key={god}
              onClick={() => onSelect(god)}
              disabled={isUnavailable || !canInteract}
              className={`
                relative aspect-square overflow-hidden rounded-lg border-2 transition-all group
                ${isUnavailable 
                  ? 'opacity-40 cursor-not-allowed bg-slate-700/50 border-red-500/30' 
                  : isSelected
                  ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/50 bg-slate-700'
                  : 'hover:border-blue-400 hover:scale-105 bg-slate-700 border-slate-600'
                }
                ${canInteract && !isUnavailable ? 'hover:shadow-lg hover:shadow-blue-500/50' : ''}
              `}
            >
              {/* Placeholder for god image - will be added manually */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-600 to-slate-800" />
              
              {/* God name overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-2">
                <p className={`text-white text-xs font-bold text-center leading-tight ${isUnavailable ? 'line-through' : ''}`}>
                  {god}
                </p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
              )}

              {/* Banned indicator */}
              {isBanned && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-900/60">
                  <span className="text-red-200 font-bold text-xs transform -rotate-12">BANNED</span>
                </div>
              )}

              {/* Picked indicator */}
              {isUnavailable && !isBanned && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-900/60">
                  <span className="text-blue-200 font-bold text-xs">PICKED</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
}