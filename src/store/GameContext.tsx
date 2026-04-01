import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  query,
  where,
  runTransaction,
  increment,
  getDocs
} from 'firebase/firestore';
import { Game, Player, Team, Figure } from '../types';

interface GameContextType {
  game: Game | null;
  player: Player | null;
  players: Player[];
  figures: Figure[];
  joinGame: (gameId: string, playerName: string) => Promise<void>;
  createGame: (playerName: string) => Promise<string>;
  startGame: () => Promise<void>;
  catchFigure: (figure: Figure) => Promise<boolean>;
  resetGame: () => Promise<void>;
  selectCharacter: (characterId: string) => Promise<void>;
  isMuted: boolean;
  toggleMute: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};

const getLocalUid = () => {
  let uid = localStorage.getItem('local_uid');
  if (!uid) {
    uid = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('local_uid', uid);
  }
  return uid;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [figures, setFigures] = useState<Figure[]>([]);
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => setIsMuted(prev => !prev);

  useEffect(() => {
    setCurrentUserUid(getLocalUid());
  }, []);

  useEffect(() => {
    if (!game?.id || !currentUserUid) return;

    const unsubGame = onSnapshot(doc(db, 'games', game.id), (docSnap) => {
      if (docSnap.exists()) {
        setGame({ id: docSnap.id, ...docSnap.data() } as Game);
      }
    });

    const unsubPlayer = onSnapshot(doc(db, `games/${game.id}/players`, currentUserUid), (docSnap) => {
      if (docSnap.exists()) {
        setPlayer({ id: docSnap.id, ...docSnap.data() } as Player);
      }
    });

    const unsubPlayers = onSnapshot(collection(db, `games/${game.id}/players`), (snapshot) => {
      const p: Player[] = [];
      snapshot.forEach(d => p.push({ id: d.id, ...d.data() } as Player));
      setPlayers(p);
    });

    const unsubFigures = onSnapshot(
      query(collection(db, `games/${game.id}/figures`), where('caughtBy', '==', null)),
      (snapshot) => {
        const f: Figure[] = [];
        snapshot.forEach(d => f.push({ id: d.id, ...d.data() } as Figure));
        setFigures(f);
      }
    );

    return () => {
      unsubGame();
      unsubPlayer();
      unsubPlayers();
      unsubFigures();
    };
  }, [game?.id, currentUserUid]);

  const createGame = async (playerName: string) => {
    const uid = getLocalUid();
    const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();

    await setDoc(doc(db, 'games', gameId), {
      status: 'waiting',
      hostId: uid,
      startedAt: null,
      duration: 40
    });

    await joinGame(gameId, playerName);
    return gameId;
  };

  const joinGame = async (gameId: string, playerName: string) => {
    const uid = getLocalUid();

    await setDoc(doc(db, `games/${gameId}/players`, uid), {
      name: playerName,
      characterId: 'nugget-bros', // Default character
      score: 0,
      joinedAt: Date.now()
    });

    setGame({ id: gameId, status: 'waiting', hostId: '', startedAt: null, duration: 40 });
  };

  const selectCharacter = async (characterId: string) => {
    if (!game?.id || !player?.id) return;
    await updateDoc(doc(db, `games/${game.id}/players`, player.id), {
      characterId
    });
  };

  const startGame = async () => {
    if (!game?.id) return;

    await updateDoc(doc(db, 'games', game.id), {
      status: 'countdown'
    });

    setTimeout(async () => {
      await updateDoc(doc(db, 'games', game.id), {
        status: 'playing',
        startedAt: Date.now()
      });
    }, 3000);
  };

  // 🔥 Actualiza score del jugador Y equipo en tiempo real
  const catchFigure = async (figure: Figure): Promise<boolean> => {
    if (!game?.id) return false;

    const uid = getLocalUid();
    const figureRef = doc(db, `games/${game.id}/figures`, figure.id);
    const playerRef = doc(db, `games/${game.id}/players`, uid);

    try {
      await runTransaction(db, async (transaction) => {
        const figDoc = await transaction.get(figureRef);

        if (!figDoc.exists() || figDoc.data().caughtBy !== null) {
          throw new Error("Already caught");
        }

        const pDoc = await transaction.get(playerRef);
        if (!pDoc.exists()) throw new Error("Missing player doc");

        const pData = pDoc.data() as Player;

        let points = 0;

        if (figure.type === 'normal') {
          points = 1;
        } else if (figure.type === 'powerup') {
          points = pData.score > 0 ? pData.score : 1;
        } else if (figure.type === 'bomb') {
          points = -2;
        } else if (figure.type === 'dodge') {
          points = 2;
        }

        // Actualizar figura
        transaction.update(figureRef, {
          caughtBy: uid,
          caughtAt: Date.now()
        });

        // Actualizar jugador
        transaction.update(playerRef, {
          score: increment(points)
        });
      });
      return true;
    } catch (e) {
      console.log("Missed figure", e);
      return false;
    }
  };

  const resetGame = async () => {
    if (!game?.id) return;

    await updateDoc(doc(db, 'games', game.id), {
      status: 'waiting',
      startedAt: null
    });

    for (const p of players) {
      await updateDoc(doc(db, `games/${game.id}/players`, p.id), {
        score: 0
      });
    }
  };

  return (
    <GameContext.Provider
      value={{
        game,
        player,
        players,
        figures,
        joinGame,
        createGame,
        startGame,
        catchFigure,
        resetGame,
        selectCharacter,
        isMuted,
        toggleMute
      }}
    >
      {children}
    </GameContext.Provider>
  );
};