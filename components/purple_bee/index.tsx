'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

type Symbol = '🍒' | '🔔' | '⭐' | '💎' | '7️⃣' | '🍋' | '🍀' | '🎰' | '🃏';

const SYMBOLS: Symbol[] = ['🍒', '🔔', '⭐', '💎', '7️⃣', '🍋', '🍀', '🎰', '🃏'];

function PurpleBee() {
  const [slots, setSlots] = useState<(Symbol | 'bee')[]>(Array(9).fill('bee'));
  const [isSpinning, setIsSpinning] = useState(false);
  const [spins, setSpins] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('purpleBeeSpins');
    const today = new Date().toDateString();

    if (storedData) {
      const { lastSpinDate, spinCount } = JSON.parse(storedData);
      if (lastSpinDate === today) {
        setSpins(spinCount);
      } else {
        localStorage.setItem('purpleBeeSpins', JSON.stringify({ lastSpinDate: today, spinCount: 0 }));
        setSpins(0);
      }
    } else {
      localStorage.setItem('purpleBeeSpins', JSON.stringify({ lastSpinDate: today, spinCount: 0 }));
    }
  }, []);

  const spin = useCallback(() => {
    if (isSpinning || spins >= 3) return;

    setIsSpinning(true);
    setShowModal(false);
    setSpins((prev) => {
      const newSpinCount = prev + 1;
      const today = new Date().toDateString();
      localStorage.setItem('purpleBeeSpins', JSON.stringify({ lastSpinDate: today, spinCount: newSpinCount }));
      return newSpinCount;
    });

    const intervalId = setInterval(() => {
      setSlots(Array(9).fill(null).map(() => (Math.random() < 0.2 ? 'bee' : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])));
    }, 100);

    setTimeout(() => {
      clearInterval(intervalId);

      const finalSlots: (Symbol | 'bee')[] = Array(9).fill(null);
      const shouldHaveBees = Math.random() < 0.3;
      const chosenRow = shouldHaveBees ? Math.floor(Math.random() * 3) : null;

      for (let i = 0; i < 3; i++) {
        if (i === chosenRow) {
          finalSlots[i * 3] = 'bee';
          finalSlots[i * 3 + 1] = 'bee';
          finalSlots[i * 3 + 2] = 'bee';
        } else {
          finalSlots[i * 3] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          finalSlots[i * 3 + 1] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          finalSlots[i * 3 + 2] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        }
      }

      setSlots(finalSlots);
      setIsSpinning(false);

      // Verifica se uma linha inteira contém três "bee"
      if (finalSlots.some((_, i) => i % 3 === 0 && finalSlots[i] === 'bee' && finalSlots[i + 1] === 'bee' && finalSlots[i + 2] === 'bee')) {
        setShowModal(true);
      }
    }, 2000);
  }, [isSpinning, spins]);

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
    <div className="h-[100vh] bg-[#3A0057] flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-4 mb-6">
        <Image alt="logo-unica" src="/logo-unica.webp" width={175} height={175} />
        <div className="h-16 w-1 bg-white"></div>
        <div className="text-white font-Krona font-bold text-xl flex text-start">Ganhe descontos <br />exclusivos</div>
      </div>
      <div className="max-w-[400px] w-full bg-[#6A0DAD] rounded-2xl shadow-2xl p-8 border-4 border-[#FFD700]">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Image src="/bee.png" alt="Bee" width={30} height={30} />
          <h1 className="text-3xl font-bold text-white">Matrícula da Sorte</h1>
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
              {symbol === 'bee' ? <Image src="/bee.png" alt="Bee" width={40} height={40} /> : symbol}
            </div>
          ))}
        </div>

        <button
          onClick={spin}
          disabled={isSpinning || spins >= 3}
          className={`
            w-full py-4 px-8 rounded-lg text-xl font-bold
            transition-all duration-200 transform
            ${isSpinning || spins >= 3
              ? 'bg-gray-500 text-white cursor-not-allowed'
              : 'bg-[#FFD700] text-[#3A0057] hover:bg-[#FFC300] hover:scale-105 shadow-lg'
            }
          `}
        >
          {spins >= 3 ? 'Limite diário atingido' : isSpinning ? 'Girando...' : 'Girar'}
        </button>

        <div className="mt-6 text-center text-white">Tentativas restantes: {3 - spins}</div>
        <div className="mt-4 text-center text-sm text-[#FFD700]">Pressione a barra de espaço para girar</div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full relative transform transition-all duration-300 scale-100 animate-fadeIn">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#3A0057] mb-4">🎉 Parabéns! 🎉</h2>
                <p className="text-xl text-[#6A0DAD] mb-6">Você ganhou um desconto na taxa de matrícula!</p>
                <button onClick={() => setShowModal(false)} className="bg-[#FFD700] text-[#3A0057] px-6 py-3 rounded-lg font-bold hover:bg-[#FFC300] transition-colors duration-200 transform hover:scale-105">
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
