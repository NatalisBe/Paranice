import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './store/GameContext';
import { Welcome } from './components/Welcome';
import { Lobby } from './components/Lobby';
import { Countdown } from './components/Countdown';
import { GameScreen } from './components/GameScreen';
import { Podium } from './components/Podium';

const RulesScreen = ({ onAccept }: { onAccept: () => void }) => {
  return (
    <div className="min-h-screen w-full bg-pn-bg flex flex-col items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-[15px] shadow-xl w-full max-w-md animate-spawn text-center">
        <h1 className="text-3xl font-black text-pn-accent mb-6">¿Cómo Jugar?</h1>

        <div className="space-y-4 text-left mb-8">
          <div className="flex items-center gap-4">
            <div className="text-3xl">👆</div>
            <p className="text-pn-text font-bold">Toca las figuritas para ganar puntos.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl">💣</div>
            <p className="text-pn-text font-bold">¡Evita las bombas! Te restan puntos.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl">⭐</div>
            <p className="text-pn-text font-bold">Atrapa los power-ups para multiplicar x2.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl">🏃</div>
            <p className="text-pn-text font-bold">¡Las figuras rápidas dan más puntos!</p>
          </div>
        </div>

        <button
          onClick={onAccept}
          className="w-full py-4 bg-pn-accent text-pn-cream rounded-[28px] font-bold text-xl hover:opacity-90 transition-opacity shadow-lg"
        >
          ¡Entendido!
        </button>
      </div>
    </div>
  );
};

const GameRouter = () => {
  const { game } = useGame();
  const [hasSeenRules, setHasSeenRules] = useState(false);

  // Cada vez que se crea/entra a una partida nueva, mostramos reglas de nuevo
  useEffect(() => {
    if (game?.id) {
      setHasSeenRules(false);
    }
  }, [game?.id]);

  if (!game) return <Welcome />;

  if (!hasSeenRules && game.status === 'waiting') {
    return <RulesScreen onAccept={() => setHasSeenRules(true)} />;
  }

  if (game.status === 'waiting') return <Lobby />;
  if (game.status === 'countdown') return <Countdown />;
  if (game.status === 'playing') return <GameScreen />;
  if (game.status === 'finished') return <Podium />;

  return <Welcome />;
};

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}