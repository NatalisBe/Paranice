import React, { useState } from 'react';
import { useGame } from '../store/GameContext';
import { CharacterSVG } from './Characters';
import { cn } from '../lib/utils';

const CHARACTERS_INFO = [
  { id: 'choco-cool', name: 'Choco Cool', label: '+3 Esquiva', type: 'dodge' },
  { id: 'nugget-bros', name: 'Nugget Bro', label: '+1 Normal', type: 'normal' },
  { id: 'mr-tv', name: 'Mr. TV', label: 'x2 Power-Up', type: 'powerup' },
  { id: 'spreadie', name: 'Spreadie', label: 'x2 Power-Up', type: 'powerup' },
  { id: 'nuez-gafas', name: 'Nuez Gafas', label: '-2 Bomba', type: 'bomb' },
  { id: 'semillita', name: 'Semillita', label: '+1 Normal', type: 'normal' },
  { id: 'paleta-ninja', name: 'Paleta Ninja', label: '+1 Normal', type: 'normal' },
  { id: 'mermaid-cookie', name: 'Mermaid Cookie', label: '+3 Esquiva', type: 'dodge' },
  { id: 'granola-dragon', name: 'Granola Dragon', label: '+3 Esquiva', type: 'dodge' },
  { id: 'pez-hojuela', name: 'Pez Hojuela', label: '+1 Normal', type: 'normal' }
];

export const CharacterSelection = ({ onComplete }: { onComplete: () => void }) => {
  const { selectCharacter, player } = useGame();
  const [selectedId, setSelectedId] = useState<string>(player?.characterId || 'nugget-bros');

  const handleSelect = async () => {
    await selectCharacter(selectedId);
    onComplete();
  };

  const getLabelColor = (type: string) => {
    switch (type) {
      case 'dodge': return 'bg-[#7A6B96] text-white';
      case 'normal': return 'bg-[#1F155B] text-white';
      case 'powerup': return 'bg-[#EAB388] text-[#1F155B]';
      case 'bomb': return 'bg-[#CC2200] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen w-full bg-pn-bg flex flex-col items-center justify-start p-6 overflow-y-auto">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-[15px] shadow-xl w-full max-w-4xl animate-spawn text-center my-8">
        <h1 className="text-3xl font-black text-pn-accent mb-2">Elige tu Personaje</h1>
        <p className="text-pn-text font-bold mb-8">Desliza para ver más opciones</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8 max-h-[60vh] overflow-y-auto p-4 rounded-xl bg-pn-cream/50 border-2 border-pn-accent/10">
          {CHARACTERS_INFO.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelectedId(char.id)}
              className={cn(
                "relative flex flex-col items-center justify-between p-4 rounded-2xl transition-all duration-200 border-4 h-full",
                selectedId === char.id 
                  ? "border-pn-accent bg-white shadow-lg scale-105" 
                  : "border-transparent bg-white/50 hover:bg-white hover:scale-105 hover:shadow-md"
              )}
            >
              <div className="w-20 h-20 mb-3">
                <CharacterSVG id={char.id} className="w-full h-full object-contain drop-shadow-md" />
              </div>
              
              <div className="flex flex-col items-center gap-1 w-full">
                <span className="text-sm font-bold text-pn-accent text-center leading-tight">{char.name}</span>
                <span className={cn("text-[10px] font-black px-2 py-1 rounded-full w-full text-center whitespace-nowrap", getLabelColor(char.type))}>
                  {char.label}
                </span>
              </div>

              {selectedId === char.id && (
                <div className="absolute -top-3 -right-3 bg-pn-accent text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleSelect}
          className="w-full max-w-sm mx-auto py-4 bg-pn-accent text-pn-cream rounded-[28px] font-bold text-xl hover:opacity-90 transition-opacity shadow-lg"
        >
          ¡Estoy Listo!
        </button>
      </div>
    </div>
  );
};
