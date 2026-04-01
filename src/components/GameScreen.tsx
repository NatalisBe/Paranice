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
  const { game, player, players, figures, catchFigure, isMuted } = useGame();
  const [timeLeft, setTimeLeft] = useState(40);
  const [pops, setPops] = useState<{ id: string, x: number, y: number, points: number, type: string }[]>([]);
  const [caughtIds, setCaughtIds] = useState<Set<string>>(new Set());
  const [expiredIds, setExpiredIds] = useState<Set<string>>(new Set());
  const isHost = game?.hostId === player?.id;

  const hasFinishedRef = useRef(false);

  const [optimisticPlayerScore, setOptimisticPlayerScore] = useState(0);

  const [rivalReaction, setRivalReaction] = useState<{ playerName: string, characterId: string, message: string } | null>(null);
  const hasTriggered15s = useRef(false);
  const hasTriggered30s = useRef(false);

  const [thiefSpawned, setThiefSpawned] = useState(false);
  const [thiefCaughtEvent, setThiefCaughtEvent] = useState<{ catcherName: string, victimName: string } | null>(null);
  const prevFiguresRef = useRef<Figure[]>([]);

  useEffect(() => {
    setOptimisticPlayerScore(player?.score || 0);
  }, [player?.score]);

  // Thief Events
  useEffect(() => {
    const newThief = figures.find(f => f.type === 'thief' && !prevFiguresRef.current.find(pf => pf.id === f.id));
    if (newThief) {
      setThiefSpawned(true);
      setTimeout(() => setThiefSpawned(false), 2000);
    }

    const caughtThief = figures.find(f => f.type === 'thief' && f.caughtBy && !prevFiguresRef.current.find(pf => pf.id === f.id)?.caughtBy);
    if (caughtThief) {
      const catcher = players.find(p => p.id === caughtThief.caughtBy);
      const victim = players.find(p => p.id === caughtThief.victimId);
      if (catcher && victim && catcher.id !== victim.id) {
        setThiefCaughtEvent({ catcherName: catcher.name, victimName: victim.name });
        setTimeout(() => setThiefCaughtEvent(null), 3000);
        
        if (player?.id === victim.id && navigator.vibrate) {
          navigator.vibrate([100, 50, 100, 50, 200]);
        }
      }
    }

    prevFiguresRef.current = figures;
  }, [figures, players, player?.id]);

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
          updateDoc(doc(db, 'games', game.id), { status: 'finished' }).catch(e => console.error("Error finishing game", e));
        } else {
          setTimeout(() => {
            updateDoc(doc(db, 'games', game.id), { status: 'finished' }).catch(e => console.error("Error finishing game", e));
          }, 3000);
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [game?.startedAt, game?.duration, game?.id, isHost]);

  // 😈 Reacción Rival
  useEffect(() => {
    if (!game?.startedAt) return;
    const elapsed = Math.floor((Date.now() - game.startedAt) / 1000);

    const triggerReaction = () => {
      if (!players || players.length < 2) return;
      let maxScore = -Infinity;
      let winningPlayer = players[0];

      players.forEach((p) => {
        if (p.score > maxScore) {
          maxScore = p.score;
          winningPlayer = p;
        }
      });

      // Solo mostrar si nuestro jugador va perdiendo
      if (player && player.score < maxScore) {
        const messages = ["¡Te estoy ganando! 😈", "¡Vamos arriba! 🚀", "¡Más rápido! 🐢", "¡Come polvo! 💨"];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        
        setRivalReaction({
          playerName: winningPlayer.name,
          characterId: winningPlayer.characterId || 'nugget-bros',
          message: randomMsg
        });

        setTimeout(() => {
          setRivalReaction(null);
        }, 1500); // Desaparece después de 1.5s
      }
    };

    if (elapsed === 15 && !hasTriggered15s.current) {
      hasTriggered15s.current = true;
      triggerReaction();
    } else if (elapsed === 30 && !hasTriggered30s.current) {
      hasTriggered30s.current = true;
      triggerReaction();
    }
  }, [timeLeft, game?.startedAt, players, player?.id]);

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
    if (!isMuted) {
      const audio = new Audio(
        'https://image2url.com/r2/default/audio/1774856742267-0abfb452-0ba4-455a-904c-646fd2ed0c4f.mp3'
      );
      audio.play().catch(() => {});
    }

    // ⭐ Pop visual con puntaje optimista
    let points = 0;

    if (figure.type === 'normal') {
      points = 1;
    } else if (figure.type === 'dodge') {
      points = 3;
    } else if (figure.type === 'bomb') {
      points = -2;
    } else if (figure.type === 'powerup') {
      points = optimisticPlayerScore > 0 ? optimisticPlayerScore : 1;
    } else if (figure.type === 'thief') {
      if (figure.victimId && figure.victimId !== player?.id) {
        points = 3;
      } else {
        points = 1;
      }
    }

    setOptimisticPlayerScore(prev => prev + points);

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
    }
  };

  return (
    <div className="relative w-full h-screen bg-pn-bg overflow-hidden select-none">
      <GameEngine />

      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border-2 border-pn-accent/20 flex flex-col items-center">
          <span className="text-sm font-bold text-pn-text uppercase tracking-wider">Tu Puntaje</span>
          <span className="text-3xl font-black text-pn-accent">{optimisticPlayerScore}</span>
        </div>

        <div className={cn(
          "bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border-4 font-black text-4xl transition-colors",
          timeLeft <= 10 ? "text-pn-red border-pn-red animate-pulse" : "text-pn-accent border-pn-cream"
        )}>
          {timeLeft}
        </div>
        
        {/* Placeholder to keep timer centered if we want, or just player info */}
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border-2 border-pn-accent/20 text-right">
          <div className="text-xs font-bold uppercase tracking-wider text-pn-text">{player?.name}</div>
          <div className="w-10 h-10 mx-auto mt-1">
            <CharacterSVG id={player?.characterId || 'nugget-bros'} className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Reacción Rival */}
      <AnimatePresence>
        {rivalReaction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
            className={cn(
              "absolute z-50 flex flex-col items-center pointer-events-none drop-shadow-2xl",
              Math.random() > 0.5 ? "top-32 left-6" : "top-32 right-6"
            )}
          >
            <div className="bg-white/95 backdrop-blur-sm text-pn-accent font-black px-4 py-2 rounded-2xl shadow-xl mb-2 text-center border-2 border-pn-accent animate-bounce">
              {rivalReaction.message}
            </div>
            <div className="w-28 h-28 relative">
              <CharacterSVG
                id={rivalReaction.characterId}
                className="w-full h-full object-contain drop-shadow-md"
              />
              <div className="absolute -top-2 -right-2 text-3xl animate-pulse">😈</div>
            </div>
            <div className="mt-2 px-4 py-1 rounded-full text-sm font-bold text-white shadow-md border-2 border-white/50 bg-pn-accent">
              {rivalReaction.playerName}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thief Spawn Banner */}
      <AnimatePresence>
        {thiefSpawned && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1F155B] text-[#EEDBB6] px-6 py-3 rounded-[15px] shadow-xl font-bold text-lg border-2 border-[#EEDBB6]"
          >
            ¡Cuidado... hay un ladrón suelto!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thief Caught Banner */}
      <AnimatePresence>
        {thiefCaughtEvent && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1F155B] text-[#EEDBB6] px-6 py-3 rounded-[15px] shadow-xl border-2 border-[#EEDBB6] text-center"
          >
            <div className="font-bold text-lg">{thiefCaughtEvent.catcherName} robó 3 puntos</div>
            <div className="text-sm opacity-90">a {thiefCaughtEvent.victimName}</div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    fig.type === 'powerup' && "animate-glow",
                    fig.type === 'thief' && "brightness-75 contrast-125"
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

                  {fig.type === 'thief' && (
                    <>
                      {/* Sombrero */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 z-10 animate-bounce" style={{ animationDuration: '2s' }}>
                        <svg viewBox="0 0 24 24" fill="#111"><path d="M2 20h20L12 4z"/></svg>
                      </div>
                      {/* Bolsita */}
                      <div className="absolute top-1/2 -right-2 w-6 h-8 bg-[#1F155B] rounded-b-md rounded-t-sm z-10 flex items-center justify-center rotate-12">
                        <span className="text-[#EEDBB6] text-[10px] font-bold">$</span>
                      </div>
                      {/* Antifaz */}
                      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[60%] h-[15%] bg-[#111] rounded-full opacity-80 z-10 mix-blend-multiply" />
                      {/* Sombra */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1F155B40] rounded-[100%] blur-[6px] -z-10" />
                    </>
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
          <div className={cn("animate-splat absolute inset-0 rounded-full", pop.type === 'thief' ? "border-[#D4AF37]" : "border-pn-cream-light")} />
          <div className={cn("animate-pop w-24 h-24 rounded-full blur-md", pop.type === 'thief' ? "bg-[#EEDBB6]/40" : "bg-white/20")} />

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
                      : pop.type === 'thief'
                        ? '#EEDBB6'
                        : 'var(--color-pn-accent)'
            }}
          >
            {pop.type === 'powerup' ? (
              <span className="bg-pn-accent text-pn-cream px-3 py-1 rounded-full text-xl">
                x2
              </span>
            ) : pop.type === 'thief' ? (
              <span className="text-4xl">+3 🔥</span>
            ) : (
              pop.points > 0 ? `+${pop.points}` : pop.points
            )}
          </div>
        </div>
      ))}
    </div>
  );
};