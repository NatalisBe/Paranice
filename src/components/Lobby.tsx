import React, { useEffect, useState } from 'react';
import { useGame } from '../store/GameContext';
import { db, auth } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Player } from '../types';
import { CharacterSVG } from './Characters';

export const Lobby = () => {
  const { game, player, players, startGame } = useGame();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => setCurrentUser(user));
    return () => unsub();
  }, []);

  const isHost = game?.hostId === currentUser?.uid || game?.hostId === player?.id;

  // SOLO 4 EQUIPOS: A, B, C, D
  const colors = [
    { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-800', itemBg: 'bg-white', itemText: 'text-pink-900', itemBorder: 'border-pink-200', hostBg: 'bg-pink-500', char: 'mermaid-cookie' }, // A
    { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800', itemBg: 'bg-white', itemText: 'text-blue-900', itemBorder: 'border-blue-200', hostBg: 'bg-blue-500', char: 'mr-tv' }, // B
    { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800', itemBg: 'bg-white', itemText: 'text-green-900', itemBorder: 'border-green-200', hostBg: 'bg-green-500', char: 'semillita' }, // C
    { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800', itemBg: 'bg-white', itemText: 'text-yellow-900', itemBorder: 'border-yellow-200', hostBg: 'bg-yellow-500', char: 'spreadie' }, // D
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start pt-4 md:pt-8 p-4 md:p-6 bg-pn-bg overflow-y-auto">
      <div className="z-10 bg-white/60 backdrop-blur-md p-6 rounded-[15px] shadow-lg w-full max-w-2xl animate-spawn text-center mb-8">
        <h1 className="text-3xl font-bold text-pn-accent mb-2">SALA DE ESPERA</h1>
        <p className="text-pn-text mb-6">
          Código de Partida:{' '}
          <strong className="text-2xl tracking-widest bg-pn-cream px-4 py-1 rounded-lg ml-2">
            {game?.id}
          </strong>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6 w-full">
          {players.map((p) => (
            <div
              key={p.id}
              className="bg-white/80 p-4 rounded-xl border-2 border-pn-accent/20 flex flex-col items-center justify-center gap-2 shadow-sm relative overflow-hidden"
            >
              <div className="w-16 h-16">
                <CharacterSVG id={p.characterId || 'nugget-bros'} className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-pn-accent truncate w-full text-center text-sm">
                {p.name}
              </span>
              {p.id === game?.hostId && (
                <span className="absolute top-2 right-2 text-[10px] bg-pn-accent text-white px-2 py-0.5 rounded-full">
                  Host
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="text-pn-text font-bold mb-6">
          {players.length} Jugadores en sala
        </div>

        {isHost ? (
          <button
            onClick={startGame}
            className="w-full max-w-xs py-4 bg-pn-accent text-pn-cream rounded-[28px] font-bold text-xl hover:opacity-90 transition-opacity shadow-lg mx-auto block"
          >
            EMPEZAR LA PARTIDA
          </button>
        ) : (
          <p className="text-pn-text font-bold animate-pulse">
            Esperando al host para empezar...
          </p>
        )}
      </div>
    </div>
  );
};
