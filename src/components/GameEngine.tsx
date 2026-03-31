import { useEffect, useRef } from 'react';
import { useGame } from '../store/GameContext';
import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { CHARACTERS, FigureType } from '../types';

export const GameEngine = () => {
  const { game, player } = useGame();
  const isHost = game?.hostId === player?.id;
  const loopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isHost || game?.status !== 'playing' || !game?.id) {
      if (loopRef.current) clearTimeout(loopRef.current);
      return;
    }

    const spawnFigure = async () => {
      if (!game?.id || game.status !== 'playing') return;

      const timeElapsed = Date.now() - (game.startedAt || Date.now());
      const secondsElapsed = timeElapsed / 1000;

      // Intervalo CONSTANTE (igual todo el juego)
      const spawnInterval = 800;

      // Dificultad CONSTANTE
      const bombChance = 0.10;
      const dodgeChance = 0.10;
      const powerupChance = 0.15;

      // Duración constante
      const lifespan = 2500;

      // Movimiento constante (no cambia al final)
      const animDurationMin = 2.0;
      const animDurationMax = 3.5;

      // Aquí aumenta el número de figuras al final (pero sin cambiar intervalo principal)
      let spawnCount = 1;

      if (secondsElapsed > 25 && secondsElapsed <= 35) {
        spawnCount = 2;
      } else if (secondsElapsed > 35) {
        spawnCount = 3;
      }

      // IMPORTANTE: programamos el siguiente spawn antes de esperar Firestore
      loopRef.current = setTimeout(spawnFigure, spawnInterval);

      for (let i = 0; i < spawnCount; i++) {
        setTimeout(async () => {
          if (!game?.id || game.status !== 'playing') return;

          const rand = Math.random();
          let type: FigureType = 'normal';
          let characterList = CHARACTERS.normal;

          if (rand < dodgeChance) {
            type = 'dodge';
            characterList = CHARACTERS.dodge;
          } else if (rand < dodgeChance + bombChance) {
            type = 'bomb';
            characterList = CHARACTERS.bomb;
          } else if (rand < dodgeChance + bombChance + powerupChance) {
            type = 'powerup';
            characterList = CHARACTERS.powerup;
          }

          const characterId =
            characterList[Math.floor(Math.random() * characterList.length)];

          const x = Math.random() * 80 + 10;
          const y = Math.random() * 80 + 10;

          const animDuration =
            Math.random() * (animDurationMax - animDurationMin) + animDurationMin;

          const animDelay = Math.random() * 0.4;

          try {
            await addDoc(collection(db, `games/${game.id}/figures`), {
              characterId,
              type,
              x,
              y,
              spawnedAt: Date.now(),
              caughtBy: null,
              caughtAt: null,
              animDuration,
              animDelay,
              lifespan,
            });
          } catch (e) {
            console.error("Error spawning figure", e);
          }
        }, i * 150); // aparecen casi al mismo tiempo
      }
    };

    loopRef.current = setTimeout(spawnFigure, 800);

    return () => {
      if (loopRef.current) clearTimeout(loopRef.current);
    };
  }, [isHost, game?.status, game?.id, game?.startedAt]);

  // Clean up old figures
  useEffect(() => {
    if (!isHost || game?.status !== 'playing' || !game?.id) return;

    const cleanup = setInterval(async () => {
      try {
        const q = query(collection(db, `games/${game.id}/figures`), where('caughtBy', '==', null));
        const snapshot = await getDocs(q);
        const now = Date.now();

        snapshot.forEach(doc => {
          const data = doc.data();
          if (now > data.spawnedAt + (data.lifespan || 2500) + 800) {
            deleteDoc(doc.ref);
          }
        });
      } catch (e) {
        console.error("Error cleaning up figures", e);
      }
    }, 1500);

    return () => clearInterval(cleanup);
  }, [isHost, game?.status, game?.id]);

  return null;
};