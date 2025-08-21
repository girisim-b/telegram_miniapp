'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function TugOfWar() {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'won' | 'lost'>('waiting');
  const [ropePosition, setRopePosition] = useState(50); // 50 is center, 0 is left win, 100 is right win
  const [timeLeft, setTimeLeft] = useState(60);
  const [playerPower, setPlayerPower] = useState(0);
  const [opponentPower, setOpponentPower] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [score, setScore] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setGameState('playing');
    setRopePosition(50);
    setTimeLeft(60);
    setPlayerPower(0);
    setOpponentPower(0);
    setTapCount(0);
    setScore(0);
    startGameLoop();
  };

  const startGameLoop = () => {
    const gameInterval = setInterval(() => {
      // Opponent AI - gets stronger over time
      const aiStrength = Math.random() * 15 + 10;
      setOpponentPower(prev => prev + aiStrength);
      
      // Calculate rope position based on power difference
      setRopePosition(prev => {
        const powerDiff = playerPower - opponentPower;
        const newPosition = prev + (powerDiff * 0.1);
        return Math.max(0, Math.min(100, newPosition));
      });
      
      // Decay player power over time (stamina)
      setPlayerPower(prev => Math.max(0, prev - 5));
      
    }, 100);

    // Game timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(gameInterval);
          // Check win condition
          if (ropePosition > 70) {
            setGameState('won');
            setScore(2000);
          } else {
            setGameState('lost');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    intervalRef.current = gameInterval;
  };

  const handleTap = () => {
    if (gameState !== 'playing') return;
    
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime;
    
    // Reward rapid tapping but prevent spam
    let powerIncrease = 20;
    if (timeSinceLastTap < 200) {
      powerIncrease = 25; // Bonus for rapid tapping
    }
    
    setPlayerPower(prev => prev + powerIncrease);
    setTapCount(prev => prev + 1);
    setLastTapTime(now);
  };

  useEffect(() => {
    if (ropePosition <= 20) {
      setGameState('lost');
      clearInterval(intervalRef.current!);
    } else if (ropePosition >= 80) {
      setGameState('won');
      setScore(2000 + timeLeft * 10);
      clearInterval(intervalRef.current!);
    }
  }, [ropePosition, timeLeft]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getRopeColor = () => {
    if (ropePosition > 70) return 'bg-green-600';
    if (ropePosition < 30) return 'bg-red-600';
    return 'bg-yellow-600';
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="text-pink-500 hover:text-pink-400 mb-4 inline-block">
            ← Ana Menüye Dön
          </Link>
          <h1 className="text-2xl font-bold text-blue-500 mb-2">
            🪢 TUG OF WAR
          </h1>
          <p className="text-white/70 text-sm">
            Hızlıca dokunarak rakibini yen!
          </p>
        </div>

        {gameState === 'waiting' && (
          <div className="text-center space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
              <h2 className="text-xl font-bold mb-4">OYUN KURALLARI</h2>
              <div className="text-left space-y-2 text-sm">
                <p>• Ekrana hızlıca dokunarak güç topla</p>
                <p>• Rakibini kendi tarafına çek</p>
                <p>• 60 saniye içinde %80&apos;e ulaş</p>
                <p>• Rakip seni %20&apos;ye çekerse kaybedersin</p>
                <p>• Hızlı dokunma daha çok güç verir</p>
              </div>
            </div>
            <button 
              onClick={startGame}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-bold text-lg"
            >
              OYUNU BAŞLAT
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="space-y-6">
            {/* Game Status */}
            <div className="text-center">
              <div className="bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2">Süre: {timeLeft}s | Dokunma: {tapCount}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Rakip: {Math.round(opponentPower)}</span>
                  <span className="text-green-400">Sen: {Math.round(playerPower)}</span>
                </div>
              </div>
            </div>

            {/* Tug of War Visualization */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
              <div className="relative">
                {/* Teams */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <div className="text-2xl mb-1">👥</div>
                    <p className="text-xs text-red-400">RAKIP TAKIM</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">👤</div>
                    <p className="text-xs text-green-400">SEN</p>
                  </div>
                </div>

                {/* Rope Track */}
                <div className="relative h-8 bg-gray-800 rounded-lg mb-4">
                  {/* Win zones */}
                  <div className="absolute top-0 left-0 w-1/5 h-full bg-red-900 rounded-l-lg"></div>
                  <div className="absolute top-0 right-0 w-1/5 h-full bg-green-900 rounded-r-lg"></div>
                  
                  {/* Center line */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-white"></div>
                  
                  {/* Rope position indicator */}
                  <div 
                    className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 ${getRopeColor()} rounded-full border-2 border-white transition-all duration-200`}
                    style={{ left: `${ropePosition}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                  >
                    <div className="w-full h-full rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Progress indicators */}
                <div className="flex justify-between text-xs">
                  <span className="text-red-400">KAYBET</span>
                  <span className="text-white/60">MERKEZ</span>
                  <span className="text-green-400">KAZAN</span>
                </div>
              </div>
            </div>

            {/* Tap Button */}
            <div className="space-y-4">
              <button 
                onTouchStart={handleTap}
                onClick={handleTap}
                className="w-full h-32 bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 active:from-blue-700 active:to-blue-900 text-white rounded-xl font-bold text-2xl border-4 border-blue-400 transition-all duration-75 transform active:scale-95"
              >
                <div className="flex flex-col items-center">
                  <span className="text-4xl mb-2">💪</span>
                  <span>ÇEK!</span>
                </div>
              </button>
              
              <div className="text-center">
                <div className="text-sm text-white/70 mb-2">
                  Hızlıca dokunarak güç topla!
                </div>
                <div className={`text-lg font-bold ${ropePosition > 50 ? 'text-green-400' : 'text-red-400'}`}>
                  {ropePosition > 70 ? '🟢 Kazanıyorsun!' : ropePosition < 30 ? '🔴 Kaybediyorsun!' : '🟡 Dengede!'}
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="text-center space-y-6">
            <div className="bg-blue-900 p-6 rounded-xl border-2 border-blue-500">
              <h2 className="text-3xl font-bold text-blue-400 mb-4">🎉 KAZANDIN!</h2>
              <p className="text-xl mb-2">Puan: {score}</p>
              <p className="text-sm text-blue-300">Toplam {tapCount} dokunma ile rakibini yendin!</p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={startGame}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold"
              >
                TEKRAR OYNA
              </button>
              <Link href="/games/glass-bridge">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-bold">
                  SONRAKİ OYUN: GLASS BRIDGE
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
              <h2 className="text-3xl font-bold text-red-400 mb-4">💀 KAYBETTİN!</h2>
              <p className="text-sm text-red-300">Rakip takım seni yendi!</p>
              <p className="text-lg mt-2">Toplam Dokunma: {tapCount}</p>
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