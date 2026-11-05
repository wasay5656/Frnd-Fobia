import { Question } from '../types';

export const QUESTION_BANK: Question[] = [
  {
    id: 'red_flag',
    text: "What's my biggest red flag? 🚩",
    category: 'Vibe Check',
    emoji: '🚩',
    options: [
      'Takes 3 to 5 business days to reply',
      'Overthinking scenarios that never happen',
      'Starting drama then saying "anyway"',
      'Believing I can fix emotionally unavailable people'
    ]
  },
  {
    id: 'obsession',
    text: "What's my biggest obsession right now? 💅",
    category: 'Habits',
    emoji: '💅',
    options: [
      'Doomscrolling TikTok/Reels till 3 AM',
      'An iced latte that costs half my life savings',
      'A hyper-fixated hobby I will abandon in 2 weeks',
      'Online shopping carts I will never checkout'
    ]
  },
  {
    id: 'angry_instantly',
    text: "What makes me angry instantly? 🤬",
    category: 'Pet Peeves',
    emoji: '🤬',
    options: [
      'Leaving me on "Delivered" while posting stories',
      'People walking at 0.5x speed in front of me',
      'When someone cancels plans at the very last second',
      'Being told "it\'s not that deep"'
    ]
  },
  {
    id: 'biggest_weakness',
    text: "What's my biggest weakness? 🫠",
    category: 'Vibe Check',
    emoji: '🫠',
    options: [
      'Saying "yes" when my soul screams "no"',
      'Late-night snacks and bad decisions',
      'Falling in love with people who have zero personality',
      'Buying things because "I deserve a little treat"'
    ]
  },
  {
    id: 'favourite_excuse',
    text: "What's my favourite excuse for cancelling plans? 🛌",
    category: 'Excuses',
    emoji: '🛌',
    options: [
      '"My stomach feels weird today guys"',
      '"My parents need me for family dinner"',
      '"I literally just woke up with a migraine"',
      '"My social battery is at -12%"'
    ]
  },
  {
    id: 'bored_late_night',
    text: "What do I do when I'm bored at 2 AM? 🦉",
    category: 'Habits',
    emoji: '🦉',
    options: [
      'Reorganize my entire life playlist / Pinterest board',
      'Stalk my middle school nemesis on Instagram',
      'Contemplate every embarrassing moment since 2017',
      'Watch 45-minute YouTube video essays on random lore'
    ]
  },
  {
    id: 'biggest_fear',
    text: "What is my biggest irrational fear? 😱",
    category: 'Secrets',
    emoji: '😱',
    options: [
      'Accidentally liking an ex\'s 4-year-old post',
      'Replying to all on a work or class email',
      'Being perceived by public society on a bad hair day',
      'Having my Spotify Wrapped exposed to the world'
    ]
  },
  {
    id: 'most_used_phrase',
    text: "What's my most-used phrase in conversation? 🗣️",
    category: 'Slang',
    emoji: '🗣️',
    options: [
      '"I literally cannot do this today"',
      '"Wait, hear me out..."',
      '"No because actually..."',
      '"I\'m crying / screaming / throwing up"'
    ]
  },
  {
    id: 'person_annoys_me',
    text: "What type of person annoys me the most? 🙄",
    category: 'Pet Peeves',
    emoji: '🙄',
    options: [
      'Pick-me energy / fake humble-braggers',
      'Loud chewers and mouth-breathers',
      'People with no sense of humor who take everything seriously',
      'Those who act completely different around their crushes'
    ]
  },
  {
    id: 'biggest_green_flag',
    text: "What's my biggest green flag? 🌿",
    category: 'Compliments',
    emoji: '🌿',
    options: [
      'Sends you memes tailored to your specific mental breakdown',
      'Always down for spontaneous midnight food runs',
      'Hypes you up in every photo & group chat',
      'Will defend you in private and in public with receipts'
    ]
  },
  {
    id: 'spend_all_money',
    text: "What would I spend all my money on without thinking? 💸",
    category: 'Money',
    emoji: '💸',
    options: [
      'Concert/festival tickets with VIP upgrades',
      'Aesthetic drinks and trendy food spots',
      'Thrifted outfits that don\'t match anything I own',
      'A random weekend flight or road trip'
    ]
  },
  {
    id: 'toxic_trait',
    text: "What's my biggest toxic trait? ☠️",
    category: 'Vibe Check',
    emoji: '☠️',
    options: [
      'Ghosting for 3 days then acting like nothing happened',
      'Thinking my music taste is superior to everyone else\'s',
      'Saying "I\'m 5 minutes away" while still in a towel',
      'Giving elite relationship advice while single as a pringle'
    ]
  },
  {
    id: 'arrested_for',
    text: "If I ever got arrested, what would it be for? 🚔",
    category: 'Secrets',
    emoji: '🚔',
    options: [
      'Road rage at someone driving 10mph under the speed limit',
      'Sneaking into VIP or backstage without a pass',
      'Stealing aesthetic glasses/menus from a restaurant',
      'Fighting someone who disrespected my best friend'
    ]
  },
  {
    id: 'comfort_food',
    text: "What's my ultimate comfort meal? 🍟",
    category: 'Habits',
    emoji: '🍟',
    options: [
      'Extra spicy instant ramen with cheese and egg',
      'Midnight crispy fries and chicken nuggets',
      'Cheesy pizza slices at 1 AM',
      'Boba milk tea with double brown sugar pearls'
    ]
  },
  {
    id: 'left_on_read',
    text: "How do I react when someone leaves me on read? 📱",
    category: 'Vibe Check',
    emoji: '📱',
    options: [
      'Delete the chat and pretend they ceased to exist',
      'Send a reel 2 hours later like nothing happened',
      'Over-analyze the exact timestamp and tone of my text',
      'Leave them on delivered for double the time as revenge'
    ]
  },
  {
    id: 'keep_secret',
    text: "How good am I at keeping a juicy secret? 🤐",
    category: 'Secrets',
    emoji: '🤐',
    options: [
      'Vault status — taking it to the grave with me',
      'Only telling my ONE absolute best friend with strict confidentiality',
      'I won\'t tell anyone, but my facial expressions will give it away',
      '"Don\'t tell anyone I told you, BUT..." within 24 hours'
    ]
  }
];

export const RESULT_CATEGORIES = {
  score0_1: {
    min: 0,
    max: 1,
    title: 'ARE YOU EVEN FRIENDS? 💀',
    badge: 'STRANGER DANGER',
    mascotId: 'the_savage',
    mascotQuote: '"I literally have receipts that you don\'t know them at all." — The Savage',
    themeClass: 'neo-box-pink',
    accentColor: '#FF1493',
    description: "Did you just meet at a bus stop yesterday? Because this score is criminal. Time to schedule a 3-hour friendship debrief before they remove you from Close Friends."
  },
  score2_3: {
    min: 2,
    max: 3,
    title: 'FRIENDSHIP UNDER INVESTIGATION 👀',
    badge: 'SUSPICIOUS ACQUAINTANCE',
    mascotId: 'suspicious_bestie',
    mascotQuote: '"Hmm... looking very suspicious. Need to run background checks." — Suspicious Bestie',
    themeClass: 'neo-box-lime',
    accentColor: '#CCFF00',
    description: "You know the surface vibe, but you're blind-guessing the deep lore. The FBI and Suspicious Bestie have launched a formal inquiry into your loyalty."
  },
  score4: {
    min: 4,
    max: 4,
    title: 'OKAY, YOU ACTUALLY KNOW THEM! 💅',
    badge: 'CERTIFIED REAL ONE',
    mascotId: 'drama_queen',
    mascotQuote: '"OMG I am literally screaming! You actually listened to their rants!" — Drama Queen',
    themeClass: 'neo-box-cobalt',
    accentColor: '#2563EB',
    description: "Almost flawless! You know their weird habits, red flags, and exact coffee orders. High-tier bestie privilege permanently granted."
  },
  score5: {
    min: 5,
    max: 5,
    title: 'BESTIE MATERIAL. LEGENDARY! 🏆',
    badge: 'SOULMATE LEVEL 100',
    mascotId: 'the_chill_one',
    mascotQuote: '"Locked in forever. You two share the same single braincell." — The Chill One',
    themeClass: 'neo-box-lime',
    accentColor: '#CCFF00',
    description: "100% ACCURACY! You might actually be their clone. Protect this friendship at all costs or you are both doomed."
  }
};
