import React, { useState } from 'react';
import { useGame } from '../store/GameContext';
import { CharacterSVG } from './Characters';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const CHARACTERS_INFO = [
  { 
    id: 'choco-cool', 
    name: 'Choco Cool', 
    lore: 'Choco Cool nació en una antigua fábrica de dulces encantada donde cada barra de chocolate guardaba un secreto. Siempre soñó con convertirse en el guardián más ágil del reino snack, usando su dulzura para proteger a los demás jugadores de los obstáculos sorpresa. Aunque parece tranquilo, cuando empieza la partida demuestra que su verdadera fuerza está en mantener la calma bajo presión.',
    quote: 'La dulzura también puede ser valentía.'
  },
  { 
    id: 'nugget-bros', 
    name: 'Nugget Bro', 
    lore: 'Nugget Bro es el alma alegre del grupo. Surgió de una receta legendaria perdida entre chefs de otra dimensión y desde entonces su misión es demostrar que la energía positiva siempre gana. Le encanta lanzarse a la aventura sin miedo y contagiar confianza a quien lo elija.',
    quote: 'La mejor jugada siempre empieza con confianza.'
  },
  { 
    id: 'mr-tv', 
    name: 'Mr. TV', 
    lore: 'Mr. TV llegó desde una transmisión intergaláctica que nunca debió ser vista por humanos. Dentro de su pantalla viven historias infinitas, secretos del juego y estrategias ocultas. Cada partida con él se siente como entrar en un nuevo canal lleno de sorpresas.',
    quote: 'Siempre hay un nuevo nivel esperando ser descubierto.'
  },
  { 
    id: 'spreadie', 
    name: 'Spreadie', 
    lore: 'Spreadie fue creado en la mesa de desayuno de un inventor soñador. Su misión es expandir la diversión por todo el mapa, llevando alegría donde otros solo ven retos. Su apariencia tierna esconde una mente brillante y estratégica.',
    quote: 'Cada pequeño paso puede untar felicidad en todo el camino.'
  },
  { 
    id: 'nuez-gafas', 
    name: 'Nuez Gafas', 
    lore: 'Nuez Gafas es el más sabio de todos. Pasó años estudiando mapas secretos y patrones del juego, perfeccionando su visión para detectar peligros antes que nadie. Aunque parece serio, siempre está listo para ayudar a los nuevos jugadores.',
    quote: 'Pensar antes de actuar también es una forma de avanzar.'
  },
  { 
    id: 'semillita', 
    name: 'Semillita', 
    lore: 'Semillita representa el inicio de toda gran aventura. Pequeña pero llena de potencial, cree que incluso el jugador más novato puede crecer hasta convertirse en leyenda. Siempre lleva consigo la esperanza de nuevos comienzos.',
    quote: 'Toda gran victoria empieza siendo una pequeña semilla.'
  },
  { 
    id: 'paleta-ninja', 
    name: 'Paleta Ninja', 
    lore: 'Paleta Ninja mezcla dulzura con velocidad. Entrenó en el templo secreto de los postres veloces, donde aprendió a moverse tan rápido que deja destellos de colores al pasar. Es perfecta para quienes aman el riesgo y la acción.',
    quote: 'La rapidez abre caminos donde otros ven límites.'
  },
  { 
    id: 'mermaid-cookie', 
    name: 'Mermaid Cookie', 
    lore: 'Mermaid Cookie llegó desde un océano de leche y galletas mágicas. Su canto inspira a los jugadores a seguir adelante incluso en las rondas más difíciles. Tiene un aura tranquila que transforma el caos en estrategia.',
    quote: 'La calma del corazón siempre guía al siguiente paso.'
  },
  { 
    id: 'granola-dragon', 
    name: 'Granola Dragon', 
    lore: 'Granola Dragon nació del fuego dorado del horno supremo. Es fuerte, resistente y protector, pero también noble con quienes lo acompañan. Su sueño es llevar a cada jugador hasta la victoria final.',
    quote: 'Dentro de ti también vive un dragón listo para despertar.'
  },
  { 
    id: 'pez-hojuela', 
    name: 'Pez Hojuela', 
    lore: 'Pez Hojuela nada por los mares de cereal crujiente, explorando las profundidades del tazón en busca de tesoros perdidos. Sus escamas brillan con la luz de la mañana, y su agilidad le permite esquivar cualquier obstáculo con gracia.',
    quote: 'Fluye con la corriente, pero nunca pierdas tu rumbo.'
  }
];

export const CharacterSelection = ({ onComplete }: { onComplete: () => void }) => {
  const { selectCharacter } = useGame();
  const [selectedChar, setSelectedChar] = useState<typeof CHARACTERS_INFO[0] | null>(null);

  const handleSelect = async (charId: string) => {
    await selectCharacter(charId);
    onComplete();
  };

  return (
    <div className="min-h-screen w-full bg-pn-bg flex flex-col items-center justify-start p-6 overflow-y-auto relative">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-[15px] shadow-xl w-full max-w-4xl animate-spawn text-center my-8">
        <h1 className="text-3xl font-black text-pn-accent mb-2">Elige tu Personaje</h1>
        <p className="text-pn-text font-bold mb-8">Desliza para ver más opciones</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-h-[60vh] overflow-y-auto p-4 rounded-xl bg-pn-cream/50 border-2 border-pn-accent/10">
          {CHARACTERS_INFO.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelectedChar(char)}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 border-4 h-full border-transparent bg-white/50 hover:bg-white hover:scale-105 hover:shadow-md"
              )}
            >
              <div className="w-20 h-20 mb-3">
                <CharacterSVG id={char.id} className="w-full h-full object-contain drop-shadow-md" />
              </div>
              
              <div className="flex flex-col items-center gap-1 w-full">
                <span className="text-sm font-bold text-pn-accent text-center leading-tight">{char.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedChar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedChar(null)}
              className="absolute inset-0 bg-pn-bg/80 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-white rounded-[28px] shadow-2xl w-full max-w-md overflow-hidden border-4 border-pn-accent flex flex-col max-h-[90vh] relative z-10"
            >
              {/* Header / Name */}
              <div className="bg-pn-cream p-5 text-center relative shrink-0">
                <button 
                  onClick={() => setSelectedChar(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full text-pn-accent font-bold shadow-sm hover:scale-110 transition-transform flex items-center justify-center"
                >
                  ✕
                </button>
                <h2 className="text-3xl font-black text-pn-accent">{selectedChar.name}</h2>
              </div>

              {/* Character Animation */}
              <div className="flex justify-center items-center pt-4 pb-0 bg-gradient-to-b from-pn-cream to-white shrink-0">
                <div className="w-32 h-32 figura-idle">
                  <CharacterSVG id={selectedChar.id} className="w-full h-full object-contain drop-shadow-xl" />
                </div>
              </div>

              {/* Lore Box */}
              <div className="px-6 pb-4 pt-2 flex-1 overflow-hidden bg-white flex flex-col min-h-0">
                <div className="bg-pn-cream/30 p-5 rounded-[20px] border-2 border-pn-cream flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <p className="text-pn-text text-sm leading-relaxed font-medium mb-4 text-justify">
                    {selectedChar.lore}
                  </p>
                  <p className="text-pn-accent font-bold italic text-center text-sm">
                    "{selectedChar.quote}"
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6 pt-2 bg-white shrink-0">
                <button
                  onClick={() => handleSelect(selectedChar.id)}
                  className="w-full py-4 bg-pn-accent text-pn-cream rounded-[28px] font-bold text-xl hover:opacity-90 transition-opacity shadow-lg hover:scale-105 transform duration-200"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
