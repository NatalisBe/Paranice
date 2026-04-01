import React, { useEffect, useState } from 'react';
import { useGame } from '../store/GameContext';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';
import { CharacterSVG } from './Characters';

export const Podium = () => {
  const { players, player, game, resetGame } = useGame();
  const [step, setStep] = useState(0);
  const isHost = game?.hostId === player?.id;

  useEffect(() => {
    // Sequence:
    // 0: "¡TIEMPO!" flash (1.5s)
    // 1: Suspenso (2s)
    // 2: 3er lugar (1s)
    // 3: 2do lugar (1s)
    // 4: 1er lugar + confeti

    const s1 = setTimeout(() => setStep(1), 1500);
    const s2 = setTimeout(() => setStep(2), 3500);
    const s3 = setTimeout(() => setStep(3), 4500);
    const s4 = setTimeout(() => {
      setStep(4);
      triggerConfetti();
    }, 5500);

    return () => {
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(s3);
      clearTimeout(s4);
    };
  }, [game?.id]);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#1F155B', '#CFCADB', '#EEDBB6', '#F4E1C1', '#2A1D65'],
      });

      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#1F155B', '#CFCADB', '#EEDBB6', '#F4E1C1', '#2A1D65'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const topPlayers = sortedPlayers.slice(0, 3);
  const remainingPlayers = sortedPlayers.slice(3);

  const colors = [
    { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
    { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  ];

  if (step === 0) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50 animate-pulse">
        <h1 className="text-6xl md:text-8xl font-black text-pn-accent animate-spawn">¡TIEMPO!</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-pn-dark-lavender flex flex-col items-center justify-end p-4 overflow-hidden relative">
      <h1 className="absolute top-12 text-4xl md:text-5xl font-black text-pn-cream-light text-center w-full uppercase tracking-wider">
        RESULTADOS FINALES
      </h1>

      <div className="flex items-end justify-center gap-2 md:gap-6 w-full max-w-3xl h-[60vh]">
        {/* 2nd Place */}
        {topPlayers[1] &&
          (() => {
            const playerIndex = players.findIndex((p) => p.id === topPlayers[1].id);
            const color = colors[playerIndex >= 0 ? playerIndex % colors.length : 0];

            return (
              <div
                className={cn(
                  "flex flex-col items-center w-1/3 transition-all duration-1000 transform translate-y-full",
                  step >= 3 && "translate-y-0"
                )}
              >
                <div className="text-pn-bg font-bold text-center mb-4 relative">
                  <div
                    className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-2 figura-idle"
                    style={{ animationDelay: '0.5s' }}
                  >
                    <CharacterSVG id={topPlayers[1].characterId || 'nugget-bros'} className="w-full h-full drop-shadow-xl" />
                  </div>

                  <div className="text-xl md:text-2xl truncate px-2">{topPlayers[1].name}</div>
                  <div className="text-sm opacity-80">{topPlayers[1].score} pts</div>
                </div>

                <div className={cn("w-full h-[40%] rounded-t-xl flex items-start justify-center pt-4 shadow-2xl", color.bg)}>
                  <span className={cn("text-4xl font-black opacity-50", color.text)}>2</span>
                </div>
              </div>
            );
          })()}

        {/* 1st Place */}
        {topPlayers[0] &&
          (() => {
            const playerIndex = players.findIndex((p) => p.id === topPlayers[0].id);
            const color = colors[playerIndex >= 0 ? playerIndex % colors.length : 0];

            return (
              <div
                className={cn(
                  "flex flex-col items-center w-1/3 transition-all duration-1000 transform translate-y-full z-10",
                  step >= 4 && "translate-y-0"
                )}
              >
                <div className="text-pn-cream font-bold text-center mb-4 relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-3xl md:text-4xl animate-bounce z-10">
                    👑
                  </div>

                  <div className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-2 figura-idle">
                    <CharacterSVG id={topPlayers[0].characterId || 'nugget-bros'} className="w-full h-full drop-shadow-2xl" />
                  </div>

                  <div className="text-2xl md:text-3xl truncate px-2">{topPlayers[0].name}</div>
                  <div className="text-lg opacity-90">{topPlayers[0].score} pts</div>
                </div>

                <div className={cn("w-full h-[60%] rounded-t-xl flex items-start justify-center pt-4 shadow-2xl", color.bg)}>
                  <span className={cn("text-6xl font-black opacity-50", color.text)}>1</span>
                </div>
              </div>
            );
          })()}

        {/* 3rd Place */}
        {topPlayers[2] &&
          (() => {
            const playerIndex = players.findIndex((p) => p.id === topPlayers[2].id);
            const color = colors[playerIndex >= 0 ? playerIndex % colors.length : 0];

            return (
              <div
                className={cn(
                  "flex flex-col items-center w-1/3 transition-all duration-1000 transform translate-y-full",
                  step >= 2 && "translate-y-0"
                )}
              >
                <div className="text-pn-cream-light font-bold text-center mb-4 relative">
                  <div
                    className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-2 figura-idle"
                    style={{ animationDelay: '1s' }}
                  >
                    <CharacterSVG id={topPlayers[2].characterId || 'nugget-bros'} className="w-full h-full drop-shadow-xl" />
                  </div>

                  <div className="text-lg md:text-xl truncate px-2">{topPlayers[2].name}</div>
                  <div className="text-sm opacity-80">{topPlayers[2].score} pts</div>
                </div>

                <div className={cn("w-full h-[30%] rounded-t-xl flex items-start justify-center pt-4 shadow-2xl", color.bg)}>
                  <span className={cn("text-3xl font-black opacity-50", color.text)}>3</span>
                </div>
              </div>
            );
          })()}

      </div>

      {/* Remaining players list */}
      {step >= 4 && remainingPlayers.length > 0 && (
        <div className="absolute top-20 right-4 md:top-28 md:right-8 flex flex-col gap-3 z-40 max-h-[60vh] overflow-y-auto pr-2">
          {remainingPlayers.map((p, index) => {
            const rankIndex = index + 3;
            const playerIndex = players.findIndex((pl) => pl.id === p.id);
            const color = colors[playerIndex >= 0 ? playerIndex % colors.length : 0];

            return (
              <div
                key={p.id}
                className={cn(
                  "flex items-center gap-3 bg-white/90 backdrop-blur-sm p-2 md:p-3 rounded-xl shadow-lg border-2 animate-spawn",
                  color.border
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={cn("text-xl md:text-2xl font-black opacity-50 w-6 text-center", color.text)}>
                  {rankIndex + 1}
                </div>

                <div className="w-8 h-8 md:w-10 md:h-10 figura-idle">
                  <CharacterSVG id={p.characterId || 'nugget-bros'} className="w-full h-full drop-shadow-md" />
                </div>

                <div className="flex flex-col pr-2">
                  <span className={cn("text-xs md:text-sm font-bold truncate max-w-[100px]", color.text)}>{p.name}</span>
                  <span className="text-[10px] md:text-xs font-bold opacity-70 text-pn-text">
                    {p.score} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reset Button */}
      {step >= 4 && isHost && (
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
          <button
            onClick={resetGame}
            className="px-4 py-2 md:px-6 md:py-3 bg-white text-[#52446E] rounded-full font-black text-sm md:text-lg shadow-xl hover:scale-105 transition-transform animate-spawn border-2 md:border-4 border-[#52446E]"
          >
            ¡Volver a Jugar!
          </button>
        </div>
      )}
    </div>
  );
};