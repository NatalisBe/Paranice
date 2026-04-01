import React from 'react';
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

const getLabelColor = (type: string) => {
  switch (type) {
    case 'dodge': return 'bg-[#7A6B96] text-white';
    case 'normal': return 'bg-[#1F155B] text-white';
    case 'powerup': return 'bg-[#EAB388] text-[#1F155B]';
    case 'bomb': return 'bg-[#CC2200] text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export const MeetCharactersScreen = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <div className="min-h-screen w-full bg-pn-bg flex flex-col items-center justify-center p-6 overflow-y-auto relative">
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-4xl overflow-hidden border-4 border-pn-accent flex flex-col max-h-[90vh] relative z-10 animate-spawn">
        {/* Header */}
        <div className="bg-pn-cream p-5 text-center relative shrink-0">
          <h2 className="text-2xl md:text-3xl font-black text-pn-accent tracking-wide">¡Conoce a tus aliados y desafíos!</h2>
        </div>

        {/* Grid Box */}
        <div className="px-4 md:px-6 pb-4 pt-6 flex-1 overflow-hidden bg-white flex flex-col min-h-0">
          <div className="bg-pn-cream/30 p-4 md:p-5 rounded-[20px] border-2 border-pn-cream flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {CHARACTERS_INFO.map((char) => (
                <div
                  key={char.id}
                  className="relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 border-2 border-pn-cream bg-white shadow-sm"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 mb-3 figura-idle" style={{ animationDelay: `${Math.random()}s` }}>
                    <CharacterSVG id={char.id} className="w-full h-full object-contain drop-shadow-md" />
                  </div>
                  
                  <div className="flex flex-col items-center gap-1 w-full">
                    <span className="text-xs md:text-sm font-bold text-pn-accent text-center leading-tight">{char.name}</span>
                    <span className={cn("text-[10px] font-black px-2 py-1 rounded-full w-full text-center whitespace-nowrap", getLabelColor(char.type))}>
                      {char.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 pb-6 pt-2 bg-white shrink-0">
          <button
            onClick={onComplete}
            className="w-full max-w-sm mx-auto block py-4 bg-pn-accent text-pn-cream rounded-[28px] font-bold text-xl hover:opacity-90 transition-opacity shadow-lg hover:scale-105 transform duration-200"
          >
            ¡ESTOY PREPARADO!
          </button>
        </div>
      </div>
    </div>
  );
};

export const ThiefAnnouncementScreen = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <div className="min-h-screen w-full bg-pn-bg flex flex-col items-center justify-center p-6 overflow-y-auto relative">
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-md overflow-hidden border-4 border-pn-accent flex flex-col max-h-[90vh] relative z-10 animate-spawn">
        {/* Header */}
        <div className="bg-pn-cream p-5 text-center relative shrink-0">
          <h2 className="text-3xl font-black text-pn-accent tracking-wide">¡ATENCIÓN!</h2>
        </div>

        {/* Character Animation / Icon */}
        <div className="flex justify-center items-center pt-4 pb-0 bg-gradient-to-b from-pn-cream to-white shrink-0">
          <div className="w-32 h-32 figura-idle relative">
            <CharacterSVG id="ladron" className="w-full h-full object-contain drop-shadow-xl" />
            <div className="absolute -top-4 -right-2 text-4xl animate-bounce">👑</div>
          </div>
        </div>

        {/* Lore Box */}
        <div className="px-6 pb-4 pt-4 flex-1 overflow-hidden bg-white flex flex-col min-h-0">
          <div className="bg-pn-cream/30 p-5 rounded-[20px] border-2 border-pn-cream flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <p className="text-pn-text text-sm leading-relaxed font-medium mb-4 text-justify">
              Por decreto real, se informa a todos los jugadores que <strong className="text-pn-accent">La Figurita Ladrón</strong> anda suelta por el reino.
            </p>
            <p className="text-pn-text text-sm leading-relaxed font-medium mb-4 text-justify">
              Esta escurridiza figura aparecerá una sola vez por partida. Quien logre atraparla, le robará <strong className="text-pn-accent">3 puntos</strong> al jugador que vaya en segundo lugar y se los quedará para sí mismo.
            </p>
            <p className="text-pn-accent font-bold italic text-center text-sm mt-6">
              "¡Mantengan los ojos bien abiertos!"
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 pb-6 pt-2 bg-white shrink-0">
          <button
            onClick={onComplete}
            className="w-full py-4 bg-pn-accent text-pn-cream rounded-[28px] font-bold text-xl hover:opacity-90 transition-opacity shadow-lg hover:scale-105 transform duration-200"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
