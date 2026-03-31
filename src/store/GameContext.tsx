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
  teams: Team[];
  figures: Figure[];
  joinGame: (gameId: string, playerName: string) => Promise<void>;
  createGame: (playerName: string) => Promise<string>;
  startGame: () => Promise<void>;
  catchFigure: (figure: Figure) => Promise<boolean>;
  resetGame: () => Promise<void>;
  finalizeScores: () => Promise<void>;
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
  const [teams, setTeams] = useState<Team[]>([]);
  const [figures, setFigures] = useState<Figure[]>([]);
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

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

    const unsubTeams = onSnapshot(collection(db, `games/${game.id}/teams`), (snapshot) => {
      const t: Team[] = [];
      snapshot.forEach(d => t.push({ id: d.id, ...d.data() } as Team));
      t.sort((a, b) => a.id.localeCompare(b.id));
      setTeams(t);
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
      unsubTeams();
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

    const teamNames = ['EQUIPO A', 'EQUIPO B', 'EQUIPO C', 'EQUIPO D'];
    for (let i = 0; i < teamNames.length; i++) {
      await setDoc(doc(db, `games/${gameId}/teams`, `team${i}`), {
        name: teamNames[i],
        totalScore: 0,
        playerIds: []
      });
    }

    await joinGame(gameId, playerName);
    return gameId;
  };

  const joinGame = async (gameId: string, playerName: string) => {
    const uid = getLocalUid();
    let assignedTeamId = 'team0';

    await runTransaction(db, async (transaction) => {
      let foundTeam = false;
      let minPlayers = 999;
      let minTeamId = 'team0';

      for (let i = 0; i < 4; i++) {
        const teamRef = doc(db, `games/${gameId}/teams`, `team${i}`);
        const teamDoc = await transaction.get(teamRef);

        if (teamDoc.exists()) {
          const pIds = teamDoc.data().playerIds || [];

          if (pIds.includes(uid)) {
            assignedTeamId = `team${i}`;
            foundTeam = true;
            break;
          }

          if (pIds.length < minPlayers) {
            minPlayers = pIds.length;
            minTeamId = `team${i}`;
          }

          if (pIds.length < 2 && !foundTeam) {
            assignedTeamId = `team${i}`;
            transaction.update(teamRef, { playerIds: [...pIds, uid] });
            foundTeam = true;
            break;
          }
        }
      }

      if (!foundTeam) {
        assignedTeamId = minTeamId;
        const teamRef = doc(db, `games/${gameId}/teams`, minTeamId);
        const teamDoc = await transaction.get(teamRef);

        if (teamDoc.exists()) {
          const pIds = teamDoc.data().playerIds || [];
          transaction.update(teamRef, { playerIds: [...pIds, uid] });
        }
      }

      const playerRef = doc(db, `games/${gameId}/players`, uid);

      transaction.set(playerRef, {
        name: playerName,
        teamId: assignedTeamId,
        score: 0,
        joinedAt: Date.now()
      });
    });

    setGame({ id: gameId, status: 'waiting', hostId: '', startedAt: null, duration: 40 });
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

        // 🔥 Actualizar puntaje del equipo
        const teamRef = doc(db, `games/${game.id}/teams`, pData.teamId);
        transaction.update(teamRef, {
          totalScore: increment(points)
        });
      });
      return true;
    } catch (e) {
      console.log("Missed figure", e);
      return false;
    }
  };

  // 🔥 Calcular totalScore del equipo sumando jugadores
  const finalizeScores = async () => {
    if (!game?.id) return;

    const playersSnap = await getDocs(collection(db, `games/${game.id}/players`));
    const allPlayers: Player[] = [];

    playersSnap.forEach(docSnap => {
      allPlayers.push({ id: docSnap.id, ...docSnap.data() } as Player);
    });

    const teamScores: Record<string, number> = {};
    allPlayers.forEach(p => {
      if (!teamScores[p.teamId]) teamScores[p.teamId] = 0;
      teamScores[p.teamId] += p.score || 0;
    });

    for (const teamId in teamScores) {
      await updateDoc(doc(db, `games/${game.id}/teams`, teamId), {
        totalScore: teamScores[teamId]
      });
    }
  };

  const resetGame = async () => {
    if (!game?.id) return;

    await updateDoc(doc(db, 'games', game.id), {
      status: 'waiting',
      startedAt: null
    });

    for (const t of teams) {
      await updateDoc(doc(db, `games/${game.id}/teams`, t.id), {
        totalScore: 0
      });
    }

    if (player) {
      await updateDoc(doc(db, `games/${game.id}/players`, player.id), {
        score: 0
      });
    }
  };

  return (
    <GameContext.Provider
      value={{
        game,
        player,
        teams,
        figures,
        joinGame,
        createGame,
        startGame,
        catchFigure,
        resetGame,
        finalizeScores
      }}
    >
      {children}
    </GameContext.Provider>
  );
};