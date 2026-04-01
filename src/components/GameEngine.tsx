import { useEffect, useRef } from 'react';
import { useGame } from '../store/GameContext';
import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { CHARACTERS, FigureType } from '../types';

export const GameEngine = () => {
  const { game, player, players } = useGame();
  const isHost = game?.hostId === player?.id;
  const loopRef = useRef<NodeJS.Timeout | null>(null);
  const thiefSpawnTimeRef = useRef<number>(Math.random() * 18 + 10); // 10 to 28 seconds
  const hasSpawnedThiefRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isHost || game?.status !== 'playing' || !game?.id) {
      if (loopRef.current) clearTimeout(loopRef.current);
      hasSpawnedThiefRef.current = false;
      thiefSpawnTimeRef.current = Math.random() * 18 + 10;
      return;
    }

    const spawnFigure = async () => {
      if (!game?.id || game.status !== 'playing') return;

      const timeElapsed = Date.now() - (game.startedAt || Date.now());
      const secondsElapsed = timeElapsed / 1000;

      // Check if we should spawn the thief
      if (players.length > 1 && secondsElapsed >= thiefSpawnTimeRef.current && !hasSpawnedThiefRef.current) {
        hasSpawnedThiefRef.current = true;
        
        // Find second highest score player
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
        const highestScore = sortedPlayers[0].score;
        const secondPlacePlayers = sortedPlayers.filter(p => p.score < highestScore);
        
        let victimId = null;
        if (secondPlacePlayers.length > 0) {
          const secondHighestScore = secondPlacePlayers[0].score;
          const tiedForSecond = secondPlacePlayers.filter(p => p.score === secondHighestScore);
          victimId = tiedForSecond[Math.floor(Math.random() * tiedForSecond.length)].id;
        } else {
          // Everyone tied for first or only one score exists, pick random (not the host if possible, or just random)
          victimId = sortedPlayers[Math.floor(Math.random() * sortedPlayers.length)].id;
        }

        const allCharacters = [...CHARACTERS.normal, ...CHARACTERS.dodge, ...CHARACTERS.bomb, ...CHARACTERS.powerup];
        const characterId = allCharacters[Math.floor(Math.random() * allCharacters.length)];
        
        try {
          await addDoc(collection(db, `games/${game.id}/figures`), {
            characterId,
            type: 'thief',
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
            spawnedAt: Date.now(),
            caughtBy: null,
            caughtAt: null,
            animDuration: Math.random() * 0.5 + 2.0, // 2 to 2.5s
            animDelay: 0,
            lifespan: 2500,
            victimId,
            pointsTransferred: false
          });
        } catch (e) {
          console.error("Error spawning thief", e);
        }
      }

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
          if (now > data.spawnedAt + (data.lifespan || 2500) + 4000) {
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