'use client';

import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
      
      tg.MainButton.text = "Kapat";
      tg.MainButton.onClick(() => {
        tg.close();
      });
      tg.MainButton.show();
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Hoş Geldin! 👋
          </h1>
          {user && (
            <p className="text-xl text-white/90">
              {user.first_name} {user.last_name || ''}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
            <h2 className="text-xl font-semibold text-white mb-4">
              🎯 Hızlı İşlemler
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-white transition-all duration-200 border border-white/30">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium">Dashboard</div>
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-white transition-all duration-200 border border-white/30">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="text-sm font-medium">Ayarlar</div>
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-white transition-all duration-200 border border-white/30">
                <div className="text-2xl mb-2">📈</div>
                <div className="text-sm font-medium">İstatistik</div>
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-white transition-all duration-200 border border-white/30">
                <div className="text-2xl mb-2">💬</div>
                <div className="text-sm font-medium">Destek</div>
              </button>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
            <h2 className="text-xl font-semibold text-white mb-4">
              📱 Kullanıcı Bilgileri
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Ad:</span>
                <span className="text-white font-medium">
                  {user?.first_name || 'Bilinmiyor'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Soyad:</span>
                <span className="text-white font-medium">
                  {user?.last_name || 'Belirtilmemiş'}
                </span>
              </div>
              {user?.username && (
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Kullanıcı Adı:</span>
                  <span className="text-white font-medium">@{user.username}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
            <h2 className="text-xl font-semibold text-white mb-4">
              🚀 Son Aktiviteler
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white/90 text-sm">Uygulamaya giriş yapıldı</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-white/90 text-sm">Profil güncellendi</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-white/90 text-sm">Yeni özellik keşfedildi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-white/70 text-sm">
            Telegram Mini App ile güçlendirilmiştir
          </p>
        </div>
      </div>
    </div>
  );
}
