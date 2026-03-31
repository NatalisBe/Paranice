import React from 'react';
import { cn } from '../lib/utils';

interface CharacterProps {
  id: string;
  className?: string;
}

export const CharacterSVG: React.FC<CharacterProps> = ({ id, className }) => {
  const renderCharacter = () => {
    switch (id) {
      case 'choco-cool':
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("personaje-svg", className)}>
            {/* Arms */}
            <line x1="25" y1="50" x2="10" y2="65" stroke="#5C3D1E" strokeWidth="4" strokeLinecap="round"/>
            <line x1="75" y1="50" x2="90" y2="65" stroke="#5C3D1E" strokeWidth="4" strokeLinecap="round"/>
            {/* Legs */}
            <line x1="35" y1="75" x2="30" y2="90" stroke="#5C3D1E" strokeWidth="4" strokeLinecap="round"/>
            <line x1="65" y1="75" x2="70" y2="90" stroke="#5C3D1E" strokeWidth="4" strokeLinecap="round"/>
            {/* Body */}
            <rect x="25" y="20" width="50" height="55" rx="5" fill="#5C3D1E" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Chocolate squares */}
            <rect x="30" y="25" width="18" height="15" rx="2" fill="#4A3118" stroke="#1F1F1F" strokeWidth="1.5"/>
            <rect x="52" y="25" width="18" height="15" rx="2" fill="#4A3118" stroke="#1F1F1F" strokeWidth="1.5"/>
            <rect x="30" y="45" width="18" height="15" rx="2" fill="#4A3118" stroke="#1F1F1F" strokeWidth="1.5"/>
            <rect x="52" y="45" width="18" height="15" rx="2" fill="#4A3118" stroke="#1F1F1F" strokeWidth="1.5"/>
            {/* Sunglasses */}
            <path d="M 28 50 Q 50 50 72 50" stroke="#1F1F1F" strokeWidth="3" fill="none"/>
            <path d="M 30 50 L 46 50 L 44 58 L 32 58 Z" fill="#1F1F1F"/>
            <path d="M 54 50 L 70 50 L 68 58 L 56 58 Z" fill="#1F1F1F"/>
            {/* Mouth */}
            <path d="M 40 65 Q 50 72 60 65" stroke="#1F1F1F" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        );
      case 'nugget-bros':
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("personaje-svg", className)}>
            <circle cx="50" cy="50" r="35" fill="#C4773B" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Eyes */}
            <circle cx="35" cy="40" r="10" fill="white" stroke="#1F1F1F" strokeWidth="2"/>
            <circle cx="35" cy="40" r="5" fill="#1F1F1F"/>
            <circle cx="33" cy="38" r="2" fill="white"/>
            <circle cx="65" cy="40" r="10" fill="white" stroke="#1F1F1F" strokeWidth="2"/>
            <circle cx="65" cy="40" r="5" fill="#1F1F1F"/>
            <circle cx="63" cy="38" r="2" fill="white"/>
            {/* Mouth */}
            <path d="M 35 65 Q 50 80 65 65" stroke="#1F1F1F" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </svg>
        );
      case 'mr-tv':
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("personaje-svg", className)}>
            <rect x="20" y="30" width="60" height="50" rx="10" fill="#CFCADB" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Screen */}
            <rect x="25" y="35" width="50" height="35" rx="5" fill="#1F1F1F" stroke="#1F1F1F" strokeWidth="2"/>
            {/* Rainbow bars */}
            <rect x="26" y="36" width="8" height="33" fill="#E84A5F"/>
            <rect x="34" y="36" width="8" height="33" fill="#FF847C"/>
            <rect x="42" y="36" width="8" height="33" fill="#FECEA8"/>
            <rect x="50" y="36" width="8" height="33" fill="#99B898"/>
            <rect x="58" y="36" width="8" height="33" fill="#2A363B"/>
            <rect x="66" y="36" width="8" height="33" fill="#6C5B7B"/>
            {/* Text */}
            <text x="50" y="52" fontFamily="sans-serif" fontSize="6" fontWeight="bold" fill="white" textAnchor="middle">WHY</text>
            <text x="50" y="59" fontFamily="sans-serif" fontSize="6" fontWeight="bold" fill="white" textAnchor="middle">F*CKING</text>
            <text x="50" y="66" fontFamily="sans-serif" fontSize="6" fontWeight="bold" fill="white" textAnchor="middle">NOT?</text>
            {/* Antennas */}
            <line x1="45" y1="30" x2="35" y2="15" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="55" y1="30" x2="65" y2="15" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="35" cy="15" r="3" fill="#1F1F1F"/>
            <circle cx="65" cy="15" r="3" fill="#1F1F1F"/>
            {/* Feet */}
            <rect x="30" y="80" width="8" height="10" rx="4" fill="#CFCADB" stroke="#1F1F1F" strokeWidth="2.5"/>
            <rect x="62" y="80" width="8" height="10" rx="4" fill="#CFCADB" stroke="#1F1F1F" strokeWidth="2.5"/>
          </svg>
        );
      case 'spreadie':
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("personaje-svg", className)}>
            {/* Jar body */}
            <path d="M 30 30 L 70 30 L 75 80 Q 75 90 50 90 Q 25 90 25 80 Z" fill="#F4E1C1" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Lid */}
            <rect x="28" y="20" width="44" height="10" rx="2" fill="#8B6342" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Label */}
            <path d="M 27 50 Q 50 55 73 50 L 75 75 Q 50 80 25 75 Z" fill="#FFFFFF" stroke="#1F1F1F" strokeWidth="2"/>
            {/* Label Text */}
            <text x="50" y="68" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#1F1F1F" textAnchor="middle">pn</text>
            {/* Eyes */}
            <circle cx="40" cy="40" r="4" fill="white" stroke="#1F1F1F" strokeWidth="1.5"/>
            <circle cx="41" cy="40" r="2" fill="#1F1F1F"/>
            <circle cx="60" cy="40" r="4" fill="white" stroke="#1F1F1F" strokeWidth="1.5"/>
            <circle cx="59" cy="40" r="2" fill="#1F1F1F"/>
            {/* Mouth */}
            <path d="M 45 45 Q 50 50 55 45" stroke="#1F1F1F" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        );
      case 'nuez-gafas':
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("personaje-svg", className)}>
            <circle cx="50" cy="50" r="35" fill="#8B6342" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Texture lines */}
            <path d="M 30 30 Q 40 40 30 50" stroke="#6B4A31" strokeWidth="2" fill="none"/>
            <path d="M 70 30 Q 60 40 70 50" stroke="#6B4A31" strokeWidth="2" fill="none"/>
            <path d="M 40 70 Q 50 60 60 70" stroke="#6B4A31" strokeWidth="2" fill="none"/>
            {/* Glasses */}
            <path d="M 25 45 Q 50 45 75 45" stroke="#1F1F1F" strokeWidth="3" fill="none"/>
            <path d="M 28 45 L 45 45 L 42 55 L 31 55 Z" fill="#1F1F1F"/>
            <path d="M 55 45 L 72 45 L 69 55 L 58 55 Z" fill="#1F1F1F"/>
            {/* Mouth */}
            <line x1="42" y1="65" x2="58" y2="65" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round"/>
            {/* Bomb icon */}
            <circle cx="75" cy="25" r="10" fill="#E84A5F" stroke="#1F1F1F" strokeWidth="2"/>
            <path d="M 75 15 Q 80 10 85 15" stroke="#1F1F1F" strokeWidth="2" fill="none"/>
            <circle cx="85" cy="15" r="2" fill="#F9A03F"/>
          </svg>
        );
      case 'semillita':
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("personaje-svg", className)}>
            {/* Arms */}
            <path d="M 25 60 Q 15 50 10 40" stroke="#7BAE5C" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M 75 60 Q 85 50 90 40" stroke="#7BAE5C" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* Body */}
            <path d="M 50 15 C 80 15 90 55 50 85 C 10 55 20 15 50 15 Z" fill="#7BAE5C" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Eyes */}
            <circle cx="38" cy="45" r="8" fill="white" stroke="#1F1F1F" strokeWidth="2"/>
            <circle cx="38" cy="45" r="4" fill="#1F1F1F"/>
            <circle cx="36" cy="43" r="1.5" fill="white"/>
            <circle cx="62" cy="45" r="8" fill="white" stroke="#1F1F1F" strokeWidth="2"/>
            <circle cx="62" cy="45" r="4" fill="#1F1F1F"/>
            <circle cx="60" cy="43" r="1.5" fill="white"/>
            {/* Mouth */}
            <path d="M 42 60 Q 50 70 58 60" stroke="#1F1F1F" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        );
      case 'paleta-ninja':
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("personaje-svg", className)}>
            {/* Stick */}
            <rect x="45" y="70" width="10" height="25" rx="5" fill="#EEDBB6" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Popsicle Body */}
            <path d="M 30 40 Q 30 15 50 15 Q 70 15 70 40 L 70 75 Q 70 80 65 80 L 35 80 Q 30 80 30 75 Z" fill="#F4E1C1" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Chocolate Top */}
            <path d="M 30 40 Q 30 15 50 15 Q 70 15 70 40 L 70 50 Q 60 55 50 50 Q 40 45 30 50 Z" fill="#5C3D1E" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Headband */}
            <rect x="29" y="35" width="42" height="12" fill="#E84A5F" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Headband knot */}
            <path d="M 71 40 L 85 35 L 80 45 Z" fill="#E84A5F" stroke="#1F1F1F" strokeWidth="2"/>
            <path d="M 71 40 L 85 45 L 80 50 Z" fill="#E84A5F" stroke="#1F1F1F" strokeWidth="2"/>
            {/* Eyes */}
            <circle cx="40" cy="41" r="3" fill="white" stroke="#1F1F1F" strokeWidth="1"/>
            <circle cx="60" cy="41" r="3" fill="white" stroke="#1F1F1F" strokeWidth="1"/>
            {/* Mouth */}
            <path d="M 45 60 Q 50 65 55 60" stroke="#1F1F1F" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        );
      case 'mermaid-cookie':
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("personaje-svg", className)}>
            {/* Tail */}
            <path d="M 50 60 Q 70 90 85 85 Q 75 70 50 60 Z" fill="#6C5B7B" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Body */}
            <circle cx="50" cy="50" r="25" fill="#99B898" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Shell Head */}
            <path d="M 25 50 C 25 20 75 20 75 50 C 75 60 65 65 50 65 C 35 65 25 60 25 50 Z" fill="#FF847C" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Shell lines */}
            <path d="M 35 30 Q 40 40 35 50" stroke="#E84A5F" strokeWidth="2" fill="none"/>
            <path d="M 50 25 Q 50 40 50 50" stroke="#E84A5F" strokeWidth="2" fill="none"/>
            <path d="M 65 30 Q 60 40 65 50" stroke="#E84A5F" strokeWidth="2" fill="none"/>
            {/* Glasses */}
            <circle cx="40" cy="45" r="8" fill="none" stroke="#1F1F1F" strokeWidth="2"/>
            <circle cx="60" cy="45" r="8" fill="none" stroke="#1F1F1F" strokeWidth="2"/>
            <line x1="48" y1="45" x2="52" y2="45" stroke="#1F1F1F" strokeWidth="2"/>
            {/* Eyes */}
            <circle cx="40" cy="45" r="3" fill="#1F1F1F"/>
            <circle cx="60" cy="45" r="3" fill="#1F1F1F"/>
            {/* Mouth */}
            <path d="M 42 55 Q 50 65 58 55" fill="white" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round"/>
            <line x1="45" y1="55" x2="45" y2="60" stroke="#1F1F1F" strokeWidth="1"/>
            <line x1="50" y1="55" x2="50" y2="61" stroke="#1F1F1F" strokeWidth="1"/>
            <line x1="55" y1="55" x2="55" y2="60" stroke="#1F1F1F" strokeWidth="1"/>
          </svg>
        );
      case 'granola-dragon':
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("personaje-svg", className)}>
            {/* Spikes */}
            <polygon points="25,40 35,15 45,35" fill="#9B8BB4" stroke="#1F1F1F" strokeWidth="2.5" strokeLinejoin="round"/>
            <polygon points="45,35 55,10 65,35" fill="#9B8BB4" stroke="#1F1F1F" strokeWidth="2.5" strokeLinejoin="round"/>
            <polygon points="65,35 75,15 85,40" fill="#9B8BB4" stroke="#1F1F1F" strokeWidth="2.5" strokeLinejoin="round"/>
            {/* Body */}
            <circle cx="50" cy="55" r="35" fill="#6C5B7B" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Eyes */}
            <circle cx="35" cy="45" r="10" fill="white" stroke="#1F1F1F" strokeWidth="2"/>
            <circle cx="35" cy="45" r="5" fill="#1F1F1F"/>
            <circle cx="33" cy="43" r="2" fill="white"/>
            <circle cx="65" cy="45" r="10" fill="white" stroke="#1F1F1F" strokeWidth="2"/>
            <circle cx="65" cy="45" r="5" fill="#1F1F1F"/>
            <circle cx="63" cy="43" r="2" fill="white"/>
            {/* Mouth */}
            <path d="M 35 65 Q 50 85 65 65" fill="#1F1F1F" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Teeth/Granola */}
            <polygon points="40,68 45,75 50,68" fill="#F9A03F" stroke="#1F1F1F" strokeWidth="1"/>
            <polygon points="50,68 55,75 60,68" fill="#F9A03F" stroke="#1F1F1F" strokeWidth="1"/>
          </svg>
        );
      case 'pez-hojuela':
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("personaje-svg", className)}>
            {/* Tail */}
            <polygon points="25,50 10,25 10,75" fill="#E8A87C" stroke="#1F1F1F" strokeWidth="2.5" strokeLinejoin="round"/>
            {/* Body */}
            <path d="M 85 50 Q 50 15 20 50 Q 50 85 85 50 Z" fill="#F9A03F" stroke="#1F1F1F" strokeWidth="2.5"/>
            {/* Fins */}
            <path d="M 40 25 Q 50 10 60 25" fill="#E8A87C" stroke="#1F1F1F" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M 40 75 Q 50 90 60 75" fill="#E8A87C" stroke="#1F1F1F" strokeWidth="2.5" strokeLinejoin="round"/>
            {/* Eye */}
            <circle cx="65" cy="45" r="6" fill="white" stroke="#1F1F1F" strokeWidth="2"/>
            <circle cx="65" cy="45" r="3" fill="#1F1F1F"/>
            <circle cx="63" cy="43" r="1" fill="white"/>
            {/* Mouth */}
            <path d="M 75 55 Q 70 60 65 55" stroke="#1F1F1F" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("personaje-svg", className)}>
            <ellipse cx="50" cy="55" rx="32" ry="30" fill="#CFCADB" stroke="#1F1F1F" strokeWidth="2.5"/>
            <circle cx="39" cy="48" r="8" fill="white" stroke="#1F1F1F" strokeWidth="2"/>
            <circle cx="40" cy="49" r="4.5" fill="#1F1F1F"/>
            <circle cx="38" cy="47" r="1.5" fill="white"/>
            <circle cx="61" cy="48" r="8" fill="white" stroke="#1F1F1F" strokeWidth="2"/>
            <circle cx="62" cy="49" r="4.5" fill="#1F1F1F"/>
            <circle cx="60" cy="47" r="1.5" fill="white"/>
            <path d="M 42 60 Q 50 67 58 60" stroke="#1F1F1F" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        );
    }
  };

  return renderCharacter();
};
