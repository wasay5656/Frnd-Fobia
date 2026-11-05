export interface Mascot {
  id: string;
  name: string;
  role: string;
  catchphrase: string;
  image: string;
  accentColor: string;
  badgeBg: string;
  description: string;
}

export const MASCOTS: Record<string, Mascot> = {
  suspicious_bestie: {
    id: 'suspicious_bestie',
    name: 'Suspicious Bestie',
    role: 'The Chief Inspector',
    catchphrase: "Wait... who actually are you? 👀",
    image: '/src/assets/images/mascot_suspicious_bestie_1793894901516.jpg',
    accentColor: '#CCFF00', // Neon Lime
    badgeBg: 'bg-[#ccff00] text-black',
    description: 'Carries a magnifying glass and audits group chat loyalty. Spots fake friends from 50 miles away.'
  },
  drama_queen: {
    id: 'drama_queen',
    name: 'Drama Queen',
    role: 'The Hype Royalty',
    catchphrase: "I am literally crying screaming throwing up 👑😭",
    image: '/src/assets/images/mascot_drama_queen_1793894902186.jpg',
    accentColor: '#FF1493', // Hot Pink
    badgeBg: 'bg-[#ff1493] text-white',
    description: 'Exaggerated reactions, gasp queen, and knows every piece of tea before it even happens.'
  },
  the_savage: {
    id: 'the_savage',
    name: 'The Savage',
    role: 'Receipt Collector',
    catchphrase: "I came with receipts and zero mercy 😈",
    image: '/src/assets/images/mascot_the_savage_1793894903527.jpg',
    accentColor: '#F43F5E', // Rose/Red
    badgeBg: 'bg-rose-500 text-white',
    description: 'Mischievous imp with red flags & screenshot archives. Roasts anyone scoring under 3/5.'
  },
  the_chill_one: {
    id: 'the_chill_one',
    name: 'The Chill One',
    role: 'Zen Bestie',
    catchphrase: "It's not that deep bro, you're locked in 🧋😎",
    image: '/src/assets/images/mascot_the_chill_one_1793894904639.jpg',
    accentColor: '#3B82F6', // Cobalt Blue
    badgeBg: 'bg-[#2563eb] text-white',
    description: 'Futuristic Y2K shades, iced boba, zero stress. Gives the legendary 5/5 stamp of approval.'
  }
};

export const MASCOT_LIST = Object.values(MASCOTS);
