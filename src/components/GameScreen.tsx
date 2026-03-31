import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../store/GameContext';
import { GameEngine } from './GameEngine';
import { Figure } from '../types';
import { cn } from '../lib/utils';
import { db } from '../lib/firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { CharacterSVG } from './Characters';

export const GameScreen = () => {
  const { game, player, teams, figures, catchFigure, finalizeScores } = useGame();
  const [timeLeft, setTimeLeft] = useState(40);
  const [pops, setPops] = useState<{ id: string, x: number, y: number, points: number, type: string }[]>([]);
  const [caughtIds, setCaughtIds] = useState<Set<string>>(new Set());
  const [expiredIds, setExpiredIds] = useState<Set<string>>(new Set());
  const isHost = game?.hostId === player?.id;

  const hasFinishedRef = useRef(false);

  const [optimisticPlayerScore, setOptimisticPlayerScore] = useState(0);
  const [optimisticTeamScore, setOptimisticTeamScore] = useState(0);

  useEffect(() => {
    setOptimisticPlayerScore(player?.score || 0);
  }, [player?.score]);

  useEffect(() => {
    const myTeam = teams.find(t => t.id === player?.teamId);
    setOptimisticTeamScore(myTeam?.totalScore || 0);
  }, [teams, player?.teamId]);

  // ⏱ Timer del juego
  useEffect(() => {
    if (!game?.startedAt) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - game.startedAt!) / 1000);
      const remaining = Math.max(0, game.duration - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0 && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        
        if (isHost) {
          finalizeScores().then(() => {
            updateDoc(doc(db, 'games', game.id), { status: 'finished' }).catch(e => console.error("Error finishing game", e));
          });
        } else {
          setTimeout(() => {
            updateDoc(doc(db, 'games', game.id), { status: 'finished' }).catch(e => console.error("Error finishing game", e));
          }, 3000);
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [game?.startedAt, game?.duration, game?.id, isHost, finalizeScores]);

  // ⏳ Marcar figuras expiradas
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setExpiredIds(prev => {
        const next = new Set(prev);
        let changed = false;

        figures.forEach(fig => {
          if (!next.has(fig.id) && now >= fig.spawnedAt + (fig.lifespan || 3000)) {
            next.add(fig.id);
            changed = true;
          }
        });

        return changed ? next : prev;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [figures]);

  // 🎯 Atrapar figura
  const handleCatch = async (figure: Figure) => {
    if (caughtIds.has(figure.id) || expiredIds.has(figure.id)) return;

    setCaughtIds(prev => new Set(prev).add(figure.id));

    // 🔊 Sonido
    const audio = new Audio(
      'https://image2url.com/r2/default/audio/1774856742267-0abfb452-0ba4-455a-904c-646fd2ed0c4f.mp3'
    );
    audio.play().catch(() => {});

    // ⭐ Pop visual con puntaje optimista
    let points = 0;

    if (figure.type === 'normal') {
      points = 1;
    } else if (figure.type === 'dodge') {
      points = 2;
    } else if (figure.type === 'bomb') {
      points = -2;
    } else if (figure.type === 'powerup') {
      points = optimisticPlayerScore > 0 ? optimisticPlayerScore : 1;
    }

    setOptimisticPlayerScore(prev => prev + points);
    setOptimisticTeamScore(prev => prev + points);

    const popId = Math.random().toString(36).substring(2, 9);
    setPops(prev => [...prev, { id: popId, x: figure.x, y: figure.y, points, type: figure.type }]);

    if (navigator.vibrate) {
      if (figure.type === 'bomb') navigator.vibrate([30, 20, 30]);
      else navigator.vibrate(40);
    }

    setTimeout(() => {
      setPops(prev => prev.filter(p => p.id !== popId));
    }, 800);

    // ✅ El puntaje REAL se calcula en GameContext (Firestore transaction)
    const success = await catchFigure(figure);
    if (!success) {
      // Revertir si falló la transacción (ej. otro jugador la atrapó primero o hubo error)
      setOptimisticPlayerScore(player?.score || 0);
      const myTeam = teams.find(t => t.id === player?.teamId);
      setOptimisticTeamScore(myTeam?.totalScore || 0);
    }
  };

  const myTeam = teams.find(t => t.id === player?.teamId);
  const myTeamIndex = teams.findIndex(t => t.id === player?.teamId);

  const colors = [
    { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-800', score: 'text-pink-600', badge: 'bg-pink-500' },
    { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800', score: 'text-blue-600', badge: 'bg-blue-500' },
    { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800', score: 'text-green-600', badge: 'bg-green-500' },
    { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800', score: 'text-yellow-600', badge: 'bg-yellow-500' },
    { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800', score: 'text-purple-600', badge: 'bg-purple-500' },
  ];

  const teamColor = colors[myTeamIndex >= 0 ? myTeamIndex % colors.length : 0];

  return (
    <div className="relative w-full h-screen bg-pn-bg overflow-hidden select-none">
      <GameEngine />

      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 pointer-events-none">
        <div className={cn(
          "bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border-2",
          teamColor.border
        )}>
          <div className={cn(
            "text-xs font-bold uppercase tracking-wider",
            teamColor.text
          )}>{myTeam?.name}</div>

          <div className={cn(
            "text-3xl font-black",
            teamColor.score
          )}>{optimisticTeamScore}</div>
        </div>

        <div className={cn(
          "bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border-4 font-black text-4xl transition-colors",
          timeLeft <= 10 ? "text-pn-red border-pn-red animate-pulse" : "text-pn-accent border-pn-cream"
        )}>
          {timeLeft}
        </div>

        <div className={cn(
          "bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border-2 text-right",
          teamColor.border
        )}>
          <div className={cn(
            "text-xs font-bold uppercase tracking-wider",
            teamColor.text
          )}>{player?.name}</div>

          <div className={cn(
            "text-sm font-bold flex items-center justify-end gap-1",
            teamColor.score
          )}>
            Pts: {optimisticPlayerScore}
          </div>
        </div>
      </div>

      {/* Play Area */}
      <div className="absolute inset-0 z-10">
        <AnimatePresence>
          {figures
            .filter(fig => !caughtIds.has(fig.id) && !expiredIds.has(fig.id))
            .map(fig => (
              <motion.div
                key={fig.id}
                onClick={() => handleCatch(fig)}
                className="absolute cursor-pointer touch-manipulation"
                style={{
                  left: `${fig.x}%`,
                  top: `${fig.y}%`,
                  width: fig.type === 'powerup' ? '140px' : '100px',
                  height: fig.type === 'powerup' ? '140px' : '100px',
                }}
                initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%", rotate: -15 }}
                animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%", rotate: 0 }}
                exit={{
                  scale: 0,
                  opacity: 0,
                  x: "-50%",
                  y: "-50%",
                  rotate: -20,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15
                }}
              >
                <div
                  className={cn(
                    "w-full h-full relative",
                    fig.type === 'dodge' ? "animate-dodge" : "figura-idle",
                    fig.type === 'powerup' && "animate-glow"
                  )}
                  style={{
                    animationDuration: `${fig.animDuration}s`,
                    animationDelay: `${fig.animDelay}s`
                  }}
                >
                  <CharacterSVG
                    id={fig.characterId}
                    className={cn(
                      "w-full h-full object-contain drop-shadow-xl",
                      fig.type === 'bomb' && "hue-rotate-180 saturate-200"
                    )}
                  />

                  {fig.type === 'bomb' && (
                    <div className="absolute -top-2 -right-2 bg-pn-red text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-md">
                      💣
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Pops / Floating Scores */}
      {pops.map(pop => (
        <div
          key={pop.id}
          className="absolute z-30 pointer-events-none"
          style={{ left: `${pop.x}%`, top: `${pop.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="animate-splat absolute inset-0 border-pn-cream-light rounded-full" />
          <div className="animate-pop w-24 h-24 bg-white/20 rounded-full blur-md" />

          <div
            className="animate-score-float absolute top-0 left-1/2 -translate-x-1/2 text-3xl font-black drop-shadow-md whitespace-nowrap"
            style={{
              color:
                pop.type === 'bomb'
                  ? 'var(--color-pn-red)'
                  : pop.type === 'powerup'
                    ? 'var(--color-pn-cream)'
                    : pop.type === 'dodge'
                      ? 'var(--color-pn-text)'
                      : 'var(--color-pn-accent)'
            }}
          >
            {pop.type === 'powerup' ? (
              <span className="bg-pn-accent text-pn-cream px-3 py-1 rounded-full text-xl">
                x2
              </span>
            ) : (
              pop.points > 0 ? `+${pop.points}` : pop.points
            )}
          </div>
        </div>
      ))}
    </div>
  );
};