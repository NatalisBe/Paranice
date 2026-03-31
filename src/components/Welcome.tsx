import React, { useState } from 'react';
import { useGame } from '../store/GameContext';

export const Welcome = () => {
  const [name, setName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const { createGame, joinGame } = useGame();
  const [isJoining, setIsJoining] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || loading) return;

    setLoading(true);
    try {
      await createGame(name);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!name.trim() || !gameCode.trim() || loading) return;

    setLoading(true);
    try {
      await joinGame(gameCode.toUpperCase(), name);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="z-10 bg-white/80 backdrop-blur-md p-8 rounded-[15px] shadow-xl w-full max-w-md flex flex-col items-center animate-spawn">
        <img
          src="https://paranice.co/wp-content/themes/whynot-web/paranice/eng-icons/logo_paranice.png"
          alt="Paranice Logo"
          className="w-48 mb-8"
        />

        <input
          type="text"
          placeholder="Tu Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-6 py-3 mb-4 border-2 border-pn-cream-light rounded-[50px] bg-transparent text-pn-text font-bold text-center outline-none focus:border-pn-accent transition-colors"
        />

        {!isJoining ? (
          <>
            <button
              onClick={handleCreate}
              disabled={!name.trim() || loading}
              className="w-full py-3 bg-pn-accent text-pn-cream rounded-[28px] font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 mb-4"
            >
              {loading ? "Creando..." : "¡Crear Partida!"}
            </button>

            <button
              onClick={() => setIsJoining(true)}
              disabled={loading}
              className="text-pn-text font-bold underline text-sm disabled:opacity-50"
            >
              O unirse a una partida
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Código de Partida"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              className="w-full px-6 py-3 mb-4 border-2 border-pn-cream-light rounded-[50px] bg-transparent text-pn-text font-bold text-center outline-none focus:border-pn-accent transition-colors uppercase"
            />

            <button
              onClick={handleJoin}
              disabled={!name.trim() || !gameCode.trim() || loading}
              className="w-full py-3 bg-pn-accent text-pn-cream rounded-[28px] font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 mb-4"
            >
              {loading ? "Uniendo..." : "¡Unirme!"}
            </button>

            <button
              onClick={() => setIsJoining(false)}
              disabled={loading}
              className="text-pn-text font-bold underline text-sm disabled:opacity-50"
            >
              Volver
            </button>
          </>
        )}
      </div>
    </div>
  );
};
