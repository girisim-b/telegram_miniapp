'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Glass {
  id: number;
  isTempered: boolean;
  isRevealed: boolean;
  isBroken: boolean;
}

export default function GlassBridge() {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'won' | 'lost'>('waiting');
  const [currentRow, setCurrentRow] = useState(0);
  const [glasses, setGlasses] = useState<Glass[][]>([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState<{row: number, side: 'left' | 'right' | null}>({ row: -1, side: null });

  const TOTAL_ROWS = 8;

  const initializeGlasses = () => {
    const newGlasses: Glass[][] = [];
    for (let row = 0; row < TOTAL_ROWS; row++) {
      const leftGlass: Glass = {
        id: row * 2,
        isTempered: Math.random() > 0.5, // 50% chance
        isRevealed: false,
        isBroken: false
      };
      const rightGlass: Glass = {
        id: row * 2 + 1,
        isTempered: !leftGlass.isTempered, // One must be tempered, one normal
        isRevealed: false,
        isBroken: false
      };
      newGlasses.push([leftGlass, rightGlass]);
    }
    return newGlasses;
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentRow(0);
    setGlasses(initializeGlasses());
    setTimeLeft(90);
    setScore(0);
    setPlayerPosition({ row: -1, side: null });
    
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGlassClick = (rowIndex: number, side: 'left' | 'right') => {
    if (gameState !== 'playing' || rowIndex !== currentRow) return;

    const newGlasses = [...glasses];
    const glassIndex = side === 'left' ? 0 : 1;
    const selectedGlass = newGlasses[rowIndex][glassIndex];

    // Reveal the glass
    selectedGlass.isRevealed = true;

    if (selectedGlass.isTempered) {
      // Safe glass - move forward
      setPlayerPosition({ row: rowIndex, side });
      
      if (rowIndex === TOTAL_ROWS - 1) {
        // Reached the end!
        setGameState('won');
        setScore(3000 + timeLeft * 15);
      } else {
        setCurrentRow(prev => prev + 1);
      }
    } else {
      // Normal glass - breaks
      selectedGlass.isBroken = true;
      setGameState('lost');
    }

    setGlasses(newGlasses);
  };

  const getGlassAppearance = (glass: Glass, rowIndex: number, side: 'left' | 'right') => {
    let className = "w-full h-16 rounded-lg border-2 transition-all duration-300 flex items-center justify-center font-bold ";
    
    // Player position
    const isPlayerHere = playerPosition.row === rowIndex && playerPosition.side === side;
    
    if (glass.isBroken) {
      className += "bg-red-900 border-red-500 text-red-300";
    } else if (glass.isRevealed) {
      if (glass.isTempered) {
        className += "bg-green-800 border-green-400 text-green-200";
      }
    } else if (rowIndex === currentRow) {
      className += "bg-blue-800 border-blue-400 text-blue-200 hover:bg-blue-700 cursor-pointer";
    } else if (rowIndex < currentRow) {
      // Revealed safe glasses from previous steps
      const wasClicked = glasses[rowIndex]?.find(g => g.isRevealed);
      if (wasClicked?.isTempered) {
        className += "bg-green-900 border-green-600 text-green-400";
      }
    } else {
      className += "bg-gray-800 border-gray-600 text-gray-400";
    }

    if (isPlayerHere) {
      className += " ring-4 ring-pink-500";
    }

    return className;
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="text-pink-500 hover:text-pink-400 mb-4 inline-block">
            ← Ana Menüye Dön
          </Link>
          <h1 className="text-2xl font-bold text-purple-500 mb-2">
            🌉 GLASS BRIDGE
          </h1>
          <p className="text-white/70 text-sm">
            Doğru camı seç ve karşıya geç!
          </p>
        </div>

        {gameState === 'waiting' && (
          <div className="text-center space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
              <h2 className="text-xl font-bold mb-4">OYUN KURALLARI</h2>
              <div className="text-left space-y-2 text-sm">
                <p>• Her sırada 2 cam var: bir güvenli, bir tehlikeli</p>
                <p>• Güvenli camı seçersen ilerlersin</p>
                <p>• Tehlikeli camı seçersen düşersin</p>
                <p>• 8 sırayı geçerek karşıya ulaş</p>
                <p>• 90 saniye süren var</p>
                <p>• Sadece mevcut sıradaki camları seçebilirsin</p>
              </div>
            </div>
            <button 
              onClick={startGame}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg font-bold text-lg"
            >
              OYUNU BAŞLAT
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="space-y-4">
            {/* Game Status */}
            <div className="text-center bg-gray-900 p-3 rounded-lg">
              <p className="text-sm">
                Süre: {timeLeft}s | Sıra: {currentRow + 1}/{TOTAL_ROWS}
              </p>
              <div className="mt-2">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentRow) / TOTAL_ROWS) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Bridge */}
            <div className="space-y-2">
              <div className="text-center text-sm text-green-400 mb-2">
                🏁 FİNİŞ
              </div>
              
              {glasses.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                  {row.map((glass, glassIndex) => {
                    const side = glassIndex === 0 ? 'left' : 'right';
                    return (
                      <button
                        key={glass.id}
                        onClick={() => handleGlassClick(rowIndex, side)}
                        className={getGlassAppearance(glass, rowIndex, side)}
                        disabled={rowIndex !== currentRow}
                      >
                        <div className="text-center">
                          {playerPosition.row === rowIndex && playerPosition.side === side && (
                            <div className="text-2xl">👤</div>
                          )}
                          {glass.isBroken && (
                            <div className="text-xl">💥</div>
                          )}
                          {!glass.isBroken && !(playerPosition.row === rowIndex && playerPosition.side === side) && (
                            <div className="text-xs">
                              {side === 'left' ? 'L' : 'R'}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
              
              <div className="text-center text-sm text-red-400 mt-2">
                🏃 BAŞLANGIÇ
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-900 p-3 rounded-lg text-center">
              <p className="text-sm text-white/70">
                {currentRow < TOTAL_ROWS ? 
                  `Sıra ${currentRow + 1}: Sol (L) veya Sağ (R) camı seç` :
                  'Tebrikler! Köprüyü geçtin!'
                }
              </p>
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="text-center space-y-6">
            <div className="bg-purple-900 p-6 rounded-xl border-2 border-purple-500">
              <h2 className="text-3xl font-bold text-purple-400 mb-4">🎉 BAŞARDIN!</h2>
              <p className="text-xl mb-2">Puan: {score}</p>
              <p className="text-sm text-purple-300">
                Cam köprüyü güvenle geçtin! Tüm oyunları tamamladın!
              </p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={startGame}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-bold"
              >
                TEKRAR OYNA
              </button>
              <Link href="/leaderboard">
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg font-bold">
                  LİDER TABLOSU
                </button>
              </Link>
              <Link href="/">
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg">
                  Ana Menüye Dön
                </button>
              </Link>
            </div>
          </div>
        )}

        {gameState === 'lost' && (
          <div className="text-center space-y-6">
            <div className="bg-red-900 p-6 rounded-xl border-2 border-red-500">
              <h2 className="text-3xl font-bold text-red-400 mb-4">💀 DÜŞTÜN!</h2>
              <p className="text-sm text-red-300">
                {timeLeft <= 0 ? 'Süren doldu!' : `Sıra ${currentRow + 1}'de yanlış camı seçtin!`}
              </p>
              <p className="text-lg mt-2">Geçilen Sıra: {currentRow}</p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={startGame}
                className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-bold"
              >
                TEKRAR DENE
              </button>
              <Link href="/">
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg">
                  Ana Menüye Dön
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}