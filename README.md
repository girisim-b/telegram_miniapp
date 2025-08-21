# 🎮 Squid Game Telegram Mini App

Telegram üzerinden oynayabileceğin hayatta kalma oyunları! Next.js, TypeScript, ve Tailwind CSS ile geliştirildi.

## 🎯 Oyunlar

- 🚦 **Red Light, Green Light**: Yeşil ışıkta hareket et, kırmızıda dur!
- 🪢 **Tug of War**: Hızlı dokunarak rakibini yen!
- 🌉 **Glass Bridge**: Doğru camı seçerek karşıya geç!

## ✨ Özellikler

- 🎭 Squid Game teması ve atmosferi
- 🏆 Gerçek zamanlı lider tablosu
- 📊 Oyuncu istatistikleri (#001-456 arası numara)
- 📱 Mobil-friendly tasarım
- ⚡ Hızlı ve responsive performans
- 🎯 TypeScript ile tip güvenliği

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Set up your Web App URL using the `/setmenubutton` command
4. Configure the environment variables

## Deployment

Deploy easily on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/telegram-mini-app)

## Bot Configuration

After deployment, configure your bot:

1. Set the Web App URL: `/setmenubutton`
2. Add your deployed URL (e.g., `https://your-app.vercel.app`)
3. Test the integration

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **API**: Telegram Bot API

## License

MIT
# telegram_miniapp
