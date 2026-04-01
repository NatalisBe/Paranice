import React, { useState } from 'react';
import { useGame } from '../store/GameContext';
import { CharacterSVG } from './Characters';
import { cn } from '../lib/utils';

const ALL_CHARACTERS = [
  'nugget-bros', 'semillita', 'pez-hojuela', 'paleta-ninja',
  'spreadie', 'mr-tv', 'nuez-gafas', 'choco-cool', 
  'mermaid-cookie', 'granola-dragon'
];

export const CharacterSelection = ({ onComplete }: { onComplete: () => void }) => {
  const { selectCharacter, player } = useGame();
  const [selectedId, setSelectedId] = useState<string>(player?.characterId || 'nugget-bros');

  const handleSelect = async () => {
    await selectCharacter(selectedId);
    onComplete();
  };

  return (
    <div className="min-h-screen w-full bg-pn-bg flex flex-col items-center justify-start p-6 overflow-y-auto">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-[15px] shadow-xl w-full max-w-2xl animate-spawn text-center my-8">
        <h1 className="text-3xl font-black text-pn-accent mb-2">Elige tu Personaje</h1>
        <p className="text-pn-text font-bold mb-8">Desliza para ver más opciones</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8 max-h-[50vh] overflow-y-auto p-4 rounded-xl bg-pn-cream/50 border-2 border-pn-accent/10">
          {ALL_CHARACTERS.map((charId) => (
            <button
              key={charId}
              onClick={() => setSelectedId(charId)}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 border-4",
                selectedId === charId 
                  ? "border-pn-accent bg-white shadow-lg scale-105" 
                  : "border-transparent bg-white/50 hover:bg-white hover:scale-105 hover:shadow-md"
              )}
            >
              <div className="w-24 h-24 mb-2">
                <CharacterSVG id={charId} className="w-full h-full object-contain drop-shadow-md" />
              </div>
              {selectedId === charId && (
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
