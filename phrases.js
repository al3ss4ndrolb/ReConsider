const PHRASES = [
  // Easy phrases (difficulty 1-3)
  "Do I really want to do this?",
  "Take a break",
  "Think twice",
  "Is this necessary?",
  "Pause and think",

  // Medium phrases (difficulty 4-7)
  "takeAMomentToReflect",
  "isThisReallyNecessary",
  "consider-your-actions",
  "think-before-clicking",
  "What's the purpose of this visit?",
  "Is this adding value to my day?",
  "Remember your goals and priorities",

  // Hard phrases (difficulty 8-10)
  "Do I really need to visit this website right now?",
  "Take a deep breath and reconsider your choice",
  "Is this the best use of my time and energy?",
  "Remember why you installed this extension",
  "Your future self will thank you for being mindful",
];

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

// Function to get a random phrase based on difficulty
function getRandomPhrase(difficulty = 1) {
  const modifier = DIFFICULTY_MODIFIERS[difficulty] || DIFFICULTY_MODIFIERS[1];

  // Select phrases based on difficulty level
  let availablePhrases;
  if (difficulty <= 3) {
    availablePhrases = PHRASES.slice(0, 5); // Easy phrases
  } else if (difficulty <= 7) {
    availablePhrases = PHRASES.slice(5, 12); // Medium phrases
  } else {
    availablePhrases = PHRASES.slice(12); // Hard phrases
  }

  const randomPhrase =
    availablePhrases[Math.floor(Math.random() * availablePhrases.length)];

  return {
    original: randomPhrase,
    display: modifier.prefix + randomPhrase + modifier.suffix,
    verify: modifier.transform(randomPhrase),
  };
}
