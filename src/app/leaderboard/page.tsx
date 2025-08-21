'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Player {
  id: number;
  name: string;
  playerNumber: string;
  totalScore: number;
  gamesWon: number;
  lastActive: string;
  avatar: string;
}

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading leaderboard data
    setTimeout(() => {
      const mockPlayers: Player[] = [
        {
          id: 1,
          name: "Seong Gi-hun",
          playerNumber: "456",
          totalScore: 8500,
          gamesWon: 3,
          lastActive: "2 dakika önce",
          avatar: "🏆"
        },
        {
          id: 2,
          name: "Kang Sae-byeok",
          playerNumber: "067",
          totalScore: 7200,
          gamesWon: 2,
          lastActive: "5 dakika önce",
          avatar: "⚡"
        },
        {
          id: 3,
          name: "Ali Abdul",
          playerNumber: "199",
          totalScore: 6800,
          gamesWon: 2,
          lastActive: "1 saat önce",
          avatar: "💪"
        },
        {
          id: 4,
          name: "Han Mi-nyeo",
          playerNumber: "212",
          totalScore: 5500,
          gamesWon: 1,
          lastActive: "3 saat önce",
          avatar: "🎭"
        },
        {
          id: 5,
          name: "Oh Il-nam",
          playerNumber: "001",
          totalScore: 5000,
          gamesWon: 1,
          lastActive: "1 gün önce",
          avatar: "👴"
        },
        {
          id: 6,
          name: "Cho Sang-woo",
          playerNumber: "218",
          totalScore: 4200,
          gamesWon: 1,
          lastActive: "2 gün önce",
          avatar: "🤓"
        },
        {
          id: 7,
          name: "Jang Deok-su",
          playerNumber: "101",
          totalScore: 3800,
          gamesWon: 0,
          lastActive: "3 gün önce",
          avatar: "😤"
        },
        {
          id: 8,
          name: "Player #123",
          playerNumber: "123",
          totalScore: 3200,
          gamesWon: 0,
          lastActive: "1 hafta önce",
          avatar: "👤"
        }
      ];

      // Add current user if they would be in top rankings
      const currentUserData: Player = {
        id: 999,
        name: "Sen",
        playerNumber: Math.floor(Math.random() * 456 + 1).toString().padStart(3, '0'),
        totalScore: Math.floor(Math.random() * 2000),
        gamesWon: 0,
        lastActive: "Şimdi",
        avatar: "🔥"
      };

      setCurrentUser(currentUserData);
      setPlayers([...mockPlayers, currentUserData].sort((a, b) => b.totalScore - a.totalScore));
      setLoading(false);
    }, 1000);
  }, []);

  const getRankMedal = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-amber-600";
    return "text-white";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-yellow-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <span className="text-white text-2xl">🏆</span>
          </div>
          <p className="text-yellow-500 font-bold">Lider Tablosu Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="text-pink-500 hover:text-pink-400 mb-4 inline-block">
            ← Ana Menüye Dön
          </Link>
          <h1 className="text-3xl font-bold text-yellow-500 mb-2">
            🏆 LİDER TABLOSU
          </h1>
          <p className="text-white/70 text-sm">
            En iyi oyuncular ve skorları
          </p>
        </div>

        {/* Current User Stats */}
        {currentUser && (
          <div className="bg-gradient-to-r from-pink-900 to-purple-900 p-4 rounded-xl mb-6 border-2 border-pink-500">
            <div className="text-center">
              <div className="text-2xl mb-2">{currentUser.avatar}</div>
              <h3 className="font-bold text-pink-300">SENİN DURUMUN</h3>
              <p className="text-white text-lg">Oyuncu #{currentUser.playerNumber}</p>
              <div className="flex justify-around mt-3 text-sm">
                <div>
                  <p className="text-yellow-400 font-bold">{currentUser.totalScore}</p>
                  <p className="text-white/60">Puan</p>
                </div>
                <div>
                  <p className="text-green-400 font-bold">{currentUser.gamesWon}</p>
                  <p className="text-white/60">Kazanılan</p>
                </div>
                <div>
                  <p className="text-blue-400 font-bold">
                    {players.findIndex(p => p.id === currentUser.id) + 1}
                  </p>
                  <p className="text-white/60">Sıra</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        <div className="mb-6">
          <div className="flex justify-center items-end space-x-2 mb-4">
            {players.slice(0, 3).map((player, index) => {
              const rank = index + 1;
              const height = rank === 1 ? 'h-20' : rank === 2 ? 'h-16' : 'h-12';
              return (
                <div key={player.id} className={`bg-gray-800 ${height} px-3 rounded-t-lg flex flex-col justify-end items-center pb-2 ${rank === 1 ? 'border-t-4 border-yellow-400' : rank === 2 ? 'border-t-4 border-gray-400' : 'border-t-4 border-amber-600'}`}>
                  <div className="text-lg">{player.avatar}</div>
                  <div className="text-xs text-center">
                    <p className={`font-bold ${getRankColor(rank)}`}>{getRankMedal(rank)}</p>
                    <p className="text-white/80 text-xs">#{player.playerNumber}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Rankings */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-center text-white/90 mb-4">
            📊 TAM SIRALAMA
          </h2>
          
          {players.map((player, index) => {
            const rank = index + 1;
            const isCurrentUser = player.id === currentUser?.id;
            
            return (
              <div
                key={player.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isCurrentUser
                    ? 'bg-pink-900/50 border-pink-500 border-2'
                    : rank <= 3
                    ? 'bg-yellow-900/30 border-yellow-600'
                    : 'bg-gray-900 border-gray-700'
                } ${rank <= 10 ? 'hover:bg-gray-800' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`font-bold text-lg ${getRankColor(rank)} min-w-[40px]`}>
                      {getRankMedal(rank)}
                    </div>
                    <div className="text-2xl">{player.avatar}</div>
                    <div>
                      <p className={`font-bold ${isCurrentUser ? 'text-pink-300' : 'text-white'}`}>
                        {player.name}
                      </p>
                      <p className="text-sm text-white/60">
                        Oyuncu #{player.playerNumber}
                      </p>
                      <p className="text-xs text-white/40">
                        {player.lastActive}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold text-lg">
                      {player.totalScore.toLocaleString()}
                    </p>
                    <p className="text-green-400 text-sm">
                      {player.gamesWon} galibiyet
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 bg-gray-900 p-4 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-3">📈 İSTATİSTİKLER</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{players.length}</p>
              <p className="text-white/60">Toplam Oyuncu</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {players.reduce((sum, p) => sum + p.gamesWon, 0)}
              </p>
              <p className="text-white/60">Toplam Galibiyet</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Link href="/games/red-light-green-light">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold">
              🎮 OYUN OYNA
            </button>
          </Link>
          <Link href="/">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg">
              Ana Menüye Dön
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}