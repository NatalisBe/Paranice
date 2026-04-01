import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './store/GameContext';
import { Welcome } from './components/Welcome';
import { Lobby } from './components/Lobby';
import { Countdown } from './components/Countdown';
import { GameScreen } from './components/GameScreen';
import { Podium } from './components/Podium';
import { CharactersCatalog } from './components/CharactersCatalog';
<<<<<<< HEAD
import packageJson from '../package.json';
=======
>>>>>>> parent of 8b620b8 (feat: Remove unnecessary catalog screen)

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
  const [hasSeenCatalog, setHasSeenCatalog] = useState(false);

  // Cada vez que se crea/entra a una partida nueva, mostramos reglas de nuevo
  useEffect(() => {
    if (game?.id) {
      setHasSeenRules(false);
      setHasSeenCatalog(false);
    }
  }, [game?.id]);

  if (!game) return <Welcome />;

  if (!hasSeenRules && game.status === 'waiting') {
    return <RulesScreen onAccept={() => setHasSeenRules(true)} />;
  }

  if (hasSeenRules && !hasSeenCatalog && game.status === 'waiting') {
    return <CharactersCatalog onAccept={() => setHasSeenCatalog(true)} />;
  }

  if (game.status === 'waiting') return <Lobby />;
  if (game.status === 'countdown') return <Countdown />;
  if (game.status === 'playing') return <GameScreen />;
  if (game.status === 'finished') return <Podium />;

  return <Welcome />;
};

const BackgroundMusic = () => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { isMuted } = useGame();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.007; // Low volume
    audio.muted = isMuted;

    const playAudio = () => {
      audio.play().catch(error => {
        console.log("Autoplay prevented, waiting for user interaction.", error);
      });
    };

    playAudio();

    const handleInteraction = () => {
      if (audio.paused) {
        playAudio();
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <audio
      ref={audioRef}
      src="https://image2url.com/r2/default/audio/1774945584080-361ea3ab-47ba-4664-9234-e646ef528a40.mp3"
      loop
      autoPlay
    />
  );
};

const GlobalMuteButton = () => {
  const { isMuted, toggleMute } = useGame();

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-4 right-4 z-[100] bg-pn-accent text-pn-cream p-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
      aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
    >
      {isMuted ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
      )}
    </button>
  );
};

const VersionFooter = () => (
  <div className="fixed bottom-2 left-4 z-[100] text-pn-text/60 text-xs font-bold pointer-events-none">
    v{packageJson.version}
  </div>
);

export default function App() {
  return (
    <GameProvider>
      <BackgroundMusic />
      <GameRouter />
      <VersionFooter />
      <GlobalMuteButton />
    </GameProvider>
  );
}