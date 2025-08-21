'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function RedLightGreenLight() {
  const [gameState, setGameState] = useState<'waiting' | 'green' | 'red' | 'won' | 'lost'>('waiting');
  const [position, setPosition] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setGameState('green');
    setPosition(0);
    setTimeLeft(30);
    setScore(0);
    startGameLoop();
  };

  const startGameLoop = () => {
    const loop = () => {
      // Random green/red light changes
      const isGreen = Math.random() > 0.3;
      setGameState(isGreen ? 'green' : 'red');
      
      if (isGreen) {
        setTimeout(() => setGameState('red'), Math.random() * 2000 + 1000);
      } else {
        setTimeout(() => setGameState('green'), Math.random() * 1500 + 500);
      }
    };

    intervalRef.current = setInterval(loop, 2000);
    
    // Game timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(intervalRef.current!);
          if (position >= 90) {
            setGameState('won');
            setScore(1000);
          } else {
            setGameState('lost');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleMove = () => {
    if (gameState === 'green') {
      setPosition(prev => Math.min(prev + 5, 100));
      setIsMoving(true);
      setTimeout(() => setIsMoving(false), 200);
    } else if (gameState === 'red' && isMoving) {
      setGameState('lost');
      clearInterval(intervalRef.current!);
    }
  };

  const handleStop = () => {
    setIsMoving(false);
  };

  useEffect(() => {
    if (position >= 90 && gameState !== 'won') {
      setGameState('won');
      setScore(1000 + timeLeft * 10);
      clearInterval(intervalRef.current!);
    }
  }, [position, gameState, timeLeft]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="text-pink-500 hover:text-pink-400 mb-4 inline-block">
            ← Ana Menüye Dön
          </Link>
          <h1 className="text-2xl font-bold text-red-500 mb-2">
            🚦 RED LIGHT, GREEN LIGHT
          </h1>
          <p className="text-white/70 text-sm">
            Yeşil ışık yanınca hareket et, kırmızıda dur!
          </p>
        </div>

        {gameState === 'waiting' && (
          <div className="text-center space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
              <h2 className="text-xl font-bold mb-4">OYUN KURALLARI</h2>
              <div className="text-left space-y-2 text-sm">
                <p>• Yeşil ışık yanınca &quot;İLERLE&quot; butonuna bas</p>
                <p>• Kırmızı ışık yanınca hareketi DURDUR</p>
                <p>• Kırmızı ışıkta hareket edersen ELENİRSİN</p>
                <p>• 30 saniye içinde bitiş çizgisine ulaş</p>
                <p>• Hedefe %90 ulaşman yeterli</p>
              </div>
            </div>
            <button 
              onClick={startGame}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-bold text-lg"
            >
              OYUNU BAŞLAT
            </button>
          </div>
        )}

        {(gameState === 'green' || gameState === 'red') && (
          <div className="space-y-6">
            {/* Game Status */}
            <div className="text-center">
              <div className={`text-6xl font-bold p-4 rounded-lg ${
                gameState === 'green' ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {gameState === 'green' ? '🟢 GREEN LIGHT' : '🔴 RED LIGHT'}
              </div>
              <p className="mt-2 text-sm">
                Süre: {timeLeft}s | İlerleme: {position}%
              </p>
            </div>

            {/* Game Area */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
              <div className="relative h-20 bg-gray-800 rounded-lg overflow-hidden">
                {/* Track */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-800 via-yellow-600 to-green-600"></div>
                
                {/* Finish Line */}
                <div className="absolute top-0 right-0 w-2 h-full bg-white"></div>
                <div className="absolute top-2 right-4 text-xs text-white">FİNİŞ</div>
                
                {/* Player */}
                <div 
                  className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
                    isMoving ? 'animate-bounce' : ''
                  }`}
                  style={{ left: `${position}%` }}
                >
                  <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs">👤</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <button 
                onMouseDown={handleMove}
                onMouseUp={handleStop}
                onTouchStart={handleMove}
                onTouchEnd={handleStop}
                disabled={gameState === 'red'}
                className={`w-full p-4 rounded-lg font-bold text-lg ${
                  gameState === 'green' 
                    ? 'bg-green-600 hover:bg-green-700 text-white active:bg-green-800' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {gameState === 'green' ? '🏃 İLERLE!' : '🛑 BEKLE!'}
              </button>
              
              <div className="text-center text-sm text-white/70">
                {gameState === 'green' ? 'Butonu basılı tut!' : 'Kırmızı ışık! Hareket etme!'}
              </div>
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="text-center space-y-6">
            <div className="bg-green-900 p-6 rounded-xl border-2 border-green-500">
              <h2 className="text-3xl font-bold text-green-400 mb-4">🎉 HAYATTA KALDIN!</h2>
              <p className="text-xl mb-2">Puan: {score}</p>
              <p className="text-sm text-green-300">Bir sonraki oyuna geçebilirsin!</p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={startGame}
                className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold"
              >
                TEKRAR OYNA
              </button>
              <Link href="/games/tug-of-war">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold">
                  SONRAKİ OYUN: TUG OF WAR
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
              <h2 className="text-3xl font-bold text-red-400 mb-4">💀 ELENDİN!</h2>
              <p className="text-sm text-red-300">
                {position < 90 ? 'Zamanında bitiremedin!' : 'Kırmızı ışıkta hareket ettin!'}
              </p>
              <p className="text-lg mt-2">Final Pozisyon: {position}%</p>
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