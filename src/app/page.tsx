'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TelegramWebApp {
  ready(): void;
  expand(): void;
  close(): void;
  initDataUnsafe?: {
    user?: TelegramUser;
  };
  MainButton: {
    text: string;
    show(): void;
    onClick(callback: () => void): void;
  };
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerNumber, setPlayerNumber] = useState<number | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
        // Generate random player number between 001-456
        setPlayerNumber(Math.floor(Math.random() * 456) + 1);
      }
      
      tg.MainButton.text = "Oyuna Başla";
      tg.MainButton.onClick(() => {
        // Navigate to games menu or start first game
        window.location.href = '/games/red-light-green-light';
      });
      tg.MainButton.show();
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-pink-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <span className="text-white text-2xl">🎭</span>
          </div>
          <p className="text-pink-500 font-bold">Oyun Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" fill="none" stroke="%23ffffff" stroke-width="1"/></svg>')`
        }}></div>
      </div>
      
      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-pink-600 rounded-full flex items-center justify-center mb-4 border-4 border-white">
              <span className="text-white text-3xl font-bold">🎭</span>
            </div>
            <h1 className="text-3xl font-bold text-pink-500 mb-2">
              SQUID GAME
            </h1>
            <p className="text-white/80 text-sm">
              Hayatta kalma oyununa hoş geldin
            </p>
          </div>
          
          {user && playerNumber && (
            <div className="bg-pink-600 text-white p-4 rounded-lg mb-6">
              <p className="text-lg font-bold">OYUNCU #{playerNumber.toString().padStart(3, '0')}</p>
              <p className="text-sm opacity-90">{user.first_name} {user.last_name || ''}</p>
            </div>
          )}
        </div>

        {/* Game Menu */}
        <div className="space-y-4">
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border-2 border-pink-600">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              🎮 OYUNLAR
            </h2>
            <div className="space-y-3">
              <Link href="/games/red-light-green-light">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-all duration-200 font-bold">
                  🚦 RED LIGHT, GREEN LIGHT
                </button>
              </Link>
              <Link href="/games/tug-of-war">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-all duration-200 font-bold">
                  🪢 TUG OF WAR
                </button>
              </Link>
              <Link href="/games/glass-bridge">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-all duration-200 font-bold">
                  🌉 GLASS BRIDGE
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border border-gray-600">
            <h2 className="text-xl font-semibold text-white mb-4">
              📊 İSTATİSTİKLER
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Oyuncu Numarası:</span>
                <span className="text-pink-500 font-bold">
                  #{playerNumber?.toString().padStart(3, '0') || '000'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Kazanılan Oyun:</span>
                <span className="text-green-500 font-bold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Toplam Puan:</span>
                <span className="text-yellow-500 font-bold">0</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border border-gray-600">
            <h2 className="text-xl font-semibold text-white mb-4">
              🏆 LİDER TABLOSU
            </h2>
            <Link href="/leaderboard">
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg transition-all duration-200 font-medium">
                Lider Tablosunu Gör
              </button>
            </Link>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-red-500 text-sm font-bold">
            ⚠️ SADECE BİR KİŞİ HAYATTA KALABİLİR
          </p>
        </div>
      </div>
    </div>
  );
}