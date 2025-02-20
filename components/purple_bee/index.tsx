'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { Bug, X } from 'lucide-react';

type Symbol = '🐝' | '🍒' | '🔔' | '⭐' | '💎' | '7️⃣' | '🍋' | '🍀' | '🎰' | '🃏';

// Added multiple bees to increase probability
const SYMBOLS: Symbol[] = ['🐝', '🐝', '🐝', '🐝', '🐝', '🍒', '🔔', '⭐', '💎', '7️⃣', '🍋', '🍀', '🎰', '🃏'];

function PurpleBee() {
  const [slots, setSlots] = useState<Symbol[]>(['🐝', '🍒', '🔔', '⭐', '💎', '🍋', '🍀', '🎰', '🃏']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [spins, setSpins] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const checkWin = (results: Symbol[]) => {
    // Check all rows for three bees
    const rows = [
      [0, 1, 2], // First row
      [3, 4, 5], // Second row
      [6, 7, 8]  // Third row
    ];

    return rows.some(row => 
      row.every(index => results[index] === '🐝')
    );
  };

  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);
    setShowModal(false);
    setSpins(prev => prev + 1);

    // Simulate spinning animation
    const intervalId = setInterval(() => {
      setSlots(prevSlots => 
        Array(9).fill(null).map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
      );
    }, 100);

    // Stop spinning after 2 seconds
    setTimeout(() => {
      clearInterval(intervalId);
      const finalSlots = Array.from({ length: 9 }, 
        () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ) as Symbol[];
      
      setSlots(finalSlots);
      setIsSpinning(false);

      // Check for win condition
      if (checkWin(finalSlots)) {
        
        setShowModal(true);
      } else {
        setResult('Tente novamente!');
      }
    }, 2000);
  }, [isSpinning]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        spin();
      } else if (e.code === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [spin, showModal]);

  return (
    <div className="min-h-screen bg-[#3A0057] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#6A0DAD] rounded-2xl shadow-2xl p-8 border-4 border-[#FFD700]">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Bug className="w-8 h-8 text-[#FFD700]" />
          <h1 className="text-3xl font-bold text-white">Jogo da Abelha</h1>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {slots.map((symbol, index) => (
            <div
              key={index}
              className={`
                aspect-square rounded-lg border-4 border-[#FFD700] bg-[#3A0057]
                flex items-center justify-center text-4xl md:text-5xl
                shadow-lg transform transition-all duration-200
                ${isSpinning ? 'animate-bounce' : 'hover:scale-105 hover:shadow-xl'}
              `}
            >
              {symbol}
            </div>
          ))}
        </div>

        <button
          onClick={spin}
          disabled={isSpinning}
          className={`
            w-full py-4 px-8 rounded-lg text-xl font-bold
            transition-all duration-200 transform
            ${isSpinning
              ? 'bg-gray-500 text-white cursor-not-allowed'
              : 'bg-[#FFD700] text-[#3A0057] hover:bg-[#FFC300] hover:scale-105 shadow-lg'
            }
          `}
        >
          {isSpinning ? 'Girando...' : 'Girar'}
        </button>

        {result && (
          <div className={`
            mt-6 p-4 rounded-lg text-center text-xl font-bold shadow-lg
            ${result.includes('Parabéns')
              ? 'bg-[#FFD700] text-[#3A0057] animate-pulse'
              : 'bg-red-900 text-white'
            }
          `}>
            {result}
          </div>
        )}

        <div className="mt-6 text-center text-white">
          Total de jogadas: {spins}
        </div>

        <div className="mt-4 text-center text-sm text-[#FFD700]">
          Pressione a barra de espaço para girar
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full relative transform transition-all duration-300 scale-100 animate-fadeIn">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#3A0057] mb-4">
                  🎉 Parabéns! 🎉
                </h2>
                <p className="text-xl text-[#6A0DAD] mb-6">
                  Você ganhou um desconto na taxa de matrícula!
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-[#FFD700] text-[#3A0057] px-6 py-3 rounded-lg font-bold
                    hover:bg-[#FFC300] transition-colors duration-200 transform hover:scale-105"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PurpleBee;