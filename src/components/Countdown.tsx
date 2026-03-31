import React, { useEffect, useState } from 'react';

export const Countdown = () => {
  const [count, setCount] = useState(3);
  const [showGo, setShowGo] = useState(false);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(c => c - 1), 800);
      return () => clearTimeout(timer);
    } else {
      setShowGo(true);
    }
  }, [count]);

  return (
    <div className="fixed inset-0 bg-pn-dark-lavender flex items-center justify-center z-50 overflow-hidden">
      {!showGo ? (
        <div 
          key={count} 
          className="text-[150px] font-bold text-pn-cream animate-spawn drop-shadow-2xl"
        >
          {count}
        </div>
      ) : (
        <div className="text-[120px] font-bold text-pn-cream-light animate-spawn drop-shadow-2xl">
          ¡GO!
        </div>
      )}
    </div>
  );
};
