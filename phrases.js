const PHRASES = {
  1: [
    // Easy - 2-3 words with simple punctuation
    "Take a breath.",
    "Stay focused!",
    "Be mindful.",
    "Think twice.",
    "Pause now.",
    "Consider this.",
    "Breathe deeply.",
    "Stay present.",
    "Be patient.",
    "Think carefully!",
  ],
  2: [
    // Light - 4-5 words with punctuation
    "Is this really necessary?",
    "Take your time today.",
    "Make it count today!",
    "Remember your priorities today.",
    "Think about your goals.",
    "Consider your time wisely.",
    "Focus on what matters.",
    "Stay true to yourself!",
    "Keep your goals clear.",
    "Remember why you started.",
  ],
  3: [
    // Moderate - 6-7 words with punctuation
    "Are you making the best choice today?",
    "Take a moment to think it through.",
    "Is this aligned with your goals?",
    "Remember what matters most to you.",
    "Consider how you'll feel about this.",
    "Think about your future self today.",
    "Is this the best use of time?",
    "Take time to make good choices.",
    "Will this matter in a month?",
    "How does this serve your purpose?",
  ],
  4: [
    // Challenging - 8-9 words with punctuation
    "Is this the best way to spend your time?",
    "Take a deep breath and consider your choices.",
    "Remember the goals you set for yourself today.",
    "Think carefully about how this affects your future.",
    "Consider whether this aligns with your personal growth.",
    "Are you making choices that serve your purpose?",
    "Will this choice bring you closer to success?",
    "Take time to reflect on your priorities today.",
    "Is this activity worth your precious time today?",
    "How will this decision impact your future self?",
  ],
  5: [
    // Complex - 10+ words with punctuation
    "Take a moment to consider if this aligns with your goals today.",
    "Is this the most productive use of your valuable time right now?",
    "Remember that every choice you make shapes your future path forward.",
    "Consider how this moment could be better spent pursuing your dreams.",
    "Think about whether this activity serves your long-term vision and goals.",
    "Will this choice bring you closer to where you want to be?",
    "Take time to reflect on whether this truly matters to you.",
    "Are you making a conscious choice that supports your personal growth?",
    "Consider the impact of this decision on your future opportunities.",
    "How will you feel about this choice when you reflect back later?",
  ],
};

// Difficulty modifiers for phrases
const DIFFICULTY_MODIFIERS = {
  1: {
    prefix: "Type: ",
    suffix: "",
    transform: (phrase) => phrase,
    phraseCount: 5, // Uses first 5 phrases
  },
  3: {
    prefix: "Please type: ",
    suffix: " (exactly)",
    transform: (phrase) => phrase,
    phraseCount: 5,
  },
  5: {
    prefix: "Type this carefully: ",
    suffix: " (case-sensitive)",
    transform: (phrase) => phrase,
    phraseCount: 7,
  },
  7: {
    prefix: "Enter precisely: ",
    suffix: " (including punctuation)",
    transform: (phrase) => phrase + "!",
    phraseCount: 7,
  },
  10: {
    prefix: "Type the following exactly: ",
    suffix: " (with correct spacing and punctuation)",
    transform: (phrase) => `"${phrase}..." - Your Future Self`,
    phraseCount: 5,
  },
};

function getRandomPhrase(difficulty) {
  // Ensure difficulty is between 1 and 5
  difficulty = Math.max(1, Math.min(5, difficulty));

  // Get phrases for the selected difficulty
  const phrases = PHRASES[difficulty];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];

  return {
    original: phrase,
    display: "Type this phrase exactly as shown:",
    verify: phrase,
  };
}
