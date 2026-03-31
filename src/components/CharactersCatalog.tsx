import React, { useState } from 'react';
import { CharacterSVG } from './Characters';

interface CatalogProps {
  onAccept: () => void;
}

const SUMAN = [
  { id: 'nugget-bros', name: 'Nugget Bros', desc: '+1 punto. ¡Atrápalos rápido!', points: '+1' },
  { id: 'semillita', name: 'Semillita', desc: '+1 punto. Lenta pero segura.', points: '+1' },
  { id: 'pez-hojuela', name: 'Pez Hojuela', desc: '+1 punto. Un clásico acuático.', points: '+1' },
  { id: 'paleta-ninja', name: 'Paleta Ninja', desc: '+1 punto. Sencilla y deliciosa.', points: '+1' },
  { id: 'choco-cool', name: 'Choco Cool', desc: '+3 puntos. ¡Se mueve mucho, muy escurridizo!', points: '+3' },
  { id: 'mermaid-cookie', name: 'Mermaid Cookie', desc: '+3 puntos. Movimiento errático y mágico.', points: '+3' },
  { id: 'granola-dragon', name: 'Granola Dragon', desc: '+3 puntos. Rápido e impredecible.', points: '+3' },
];

const RESTAN = [
  { id: 'nuez-gafas', name: 'Nuez Gafas', desc: '¡Evítalo a toda costa! Te quitará puntos.', points: '-2' },
];

const MULTIPLICAN = [
  { id: 'spreadie', name: 'Spreadie', desc: 'Multiplica el valor del próximo toque por 2.', points: 'x2' },
  { id: 'mr-tv', name: 'Mr. TV', desc: '¡Doble puntuación en tu siguiente captura!', points: 'x2' },
];

export const CharactersCatalog: React.FC<CatalogProps> = ({ onAccept }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleContinue = () => {
    setIsClosing(true);
    setTimeout(() => {
      onAccept();
    }, 400); // Esperar que la animación termine
  };

  return (
    <div className={`min-h-screen w-full bg-pn-bg flex flex-col items-center justify-center p-4 md:p-6 transition-opacity duration-300 ease-in-out ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-white/95 backdrop-blur-md p-6 md:p-10 rounded-[20px] shadow-2xl w-full max-w-3xl animate-spawn transition-transform duration-300 ease-in-out ${isClosing ? 'scale-95' : 'scale-100'} flex flex-col max-h-[90vh]`}>
        
        <div className="text-center mb-6 shrink-0">
          <h1 className="text-3xl md:text-4xl font-black text-pn-accent mb-2">¡Catálogo de Personajes!</h1>
          <p className="text-pn-text font-medium text-lg">Descubre quiénes son tus amigos y de quiénes debes cuidarte durante la partida.</p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-8" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CFCADB transparent' }}>
          
          {/* Categoría: SUMAN */}
          <section>
            <div className="flex items-center gap-3 mb-4 sticky top-0 bg-white/95 py-2 z-10 border-b-2 border-[#7BAE5C]">
              <div className="text-3xl">👍</div>
              <h2 className="text-2xl font-bold text-[#7BAE5C] tracking-tight">SUMAN PUNTOS</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUMAN.map((char, i) => (
                <div key={char.id} className="bg-[#7BAE5C]/10 border border-[#7BAE5C]/30 rounded-xl p-3 flex items-center gap-4 hover:shadow-md transition-shadow" style={{ animation: `spawn 0.4s ease-out ${i * 0.05}s both` }}>
                  <div className="w-16 h-16 shrink-0 bg-white rounded-full flex items-center justify-center shadow-inner overflow-visible">
                    <CharacterSVG id={char.id} className="w-12 h-12 animate-float" />
                  </div>
                  <div>
                    <h3 className="font-bold text-pn-accent text-lg flex items-center gap-2">
                       {char.name} <span className="text-xs px-2 py-0.5 bg-[#7BAE5C] text-white rounded-full font-bold">{char.points}</span>
                    </h3>
                    <p className="text-sm text-pn-text/80 leading-tight">{char.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Categoría: RESTAN */}
          <section>
            <div className="flex items-center gap-3 mb-4 sticky top-0 bg-white/95 py-2 z-10 border-b-2 border-[#CC2200]">
              <div className="text-3xl">💣</div>
              <h2 className="text-2xl font-bold text-[#CC2200] tracking-tight">RESTAN PUNTOS</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RESTAN.map((char, i) => (
                <div key={char.id} className="bg-[#CC2200]/10 border border-[#CC2200]/30 rounded-xl p-3 flex items-center gap-4 hover:shadow-md transition-shadow relative overflow-hidden" style={{ animation: `spawn 0.4s ease-out ${0.2 + (i * 0.1)}s both` }}>
                  <div className="absolute inset-0 bg-red-500/5 animate-pulse rounded-xl" />
                  <div className="w-16 h-16 shrink-0 bg-white rounded-full flex items-center justify-center shadow-inner overflow-visible relative z-10">
                    <CharacterSVG id={char.id} className="w-12 h-12" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-bold text-pn-accent text-lg flex items-center gap-2">
                       {char.name} <span className="text-xs px-2 py-0.5 bg-[#CC2200] text-white rounded-full font-bold">{char.points}</span>
                    </h3>
                    <p className="text-sm text-pn-text/80 leading-tight">{char.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Categoría: MULTIPLICAN */}
          <section>
            <div className="flex items-center gap-3 mb-4 sticky top-0 bg-white/95 py-2 z-10 border-b-2 border-[#F9A03F]">
              <div className="text-3xl">⭐</div>
              <h2 className="text-2xl font-bold text-[#F9A03F] tracking-tight">MULTIPLICAN PUNTOS</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MULTIPLICAN.map((char, i) => (
                <div key={char.id} className="bg-[#F9A03F]/10 border border-[#F9A03F]/30 rounded-xl p-3 flex items-center gap-4 hover:shadow-md transition-shadow" style={{ animation: `spawn 0.4s ease-out ${0.4 + (i * 0.1)}s both` }}>
                  <div className="w-16 h-16 shrink-0 bg-white rounded-full flex items-center justify-center shadow-inner overflow-visible">
                    <CharacterSVG id={char.id} className="w-12 h-12 animate-float" />
                  </div>
                  <div>
                    <h3 className="font-bold text-pn-accent text-lg flex items-center gap-2">
                       {char.name} <span className="text-xs px-2 py-0.5 bg-[#F9A03F] text-white rounded-full font-bold">{char.points}</span>
                    </h3>
                    <p className="text-sm text-pn-text/80 leading-tight">{char.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 shrink-0">
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-pn-accent text-pn-cream rounded-[28px] font-bold text-xl hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2"
          >
            Ir a la sala de espera <span>→</span>
          </button>
        </div>

      </div>
    </div>
  );
};
