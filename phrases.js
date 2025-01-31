const DEFAULT_PHRASES = {
  natural: [
    "Do I really want to do this?",
    "Is this worth my time right now?",
    "Maybe I should take a break",
    "Let's think about this for a moment",
    "Time to reflect on this decision",
    "Consider your future self",
    "What's the purpose of this visit?",
    "Is this adding value to my day?",
    "Remember your goals and priorities",
    "Take a deep breath and think",
  ],
  camelCase: [
    "takeAMomentToReflect",
    "isThisReallyNecessary",
    "shouldIBeDoingThis",
    "mindfulBrowsingCheck",
    "considerYourActions",
    "thinkBeforeClicking",
    "makeConsciousChoices",
    "reflectOnThisMoment",
    "pauseAndReconsider",
    "timeForMindfulness",
  ],
  kebabCase: [
    "take-a-moment-to-reflect",
    "is-this-really-necessary",
    "should-i-be-doing-this",
    "mindful-browsing-check",
    "consider-your-actions",
    "think-before-clicking",
    "make-conscious-choices",
    "reflect-on-this-moment",
    "pause-and-reconsider",
    "time-for-mindfulness",
  ],
};

// Difficulty modifiers for phrases
const DIFFICULTY_MODIFIERS = {
  1: {
    prefix: "",
    suffix: "",
    transform: (phrase) => phrase,
  },
  3: {
    prefix: "Please type: ",
    suffix: " (exactly)",
    transform: (phrase) => phrase,
  },
  5: {
    prefix: "Type this carefully: ",
    suffix: " (case-sensitive)",
    transform: (phrase) => phrase,
  },
  7: {
    prefix: "Enter precisely: ",
    suffix: " (including punctuation)",
    transform: (phrase) => phrase + "!",
  },
  10: {
    prefix: "Type the following exactly: ",
    suffix: " (with correct spacing and punctuation)",
    transform: (phrase) => `"${phrase}..." - Your Future Self`,
  },
};

// Function to get a random phrase based on type and difficulty
function getRandomPhrase(types = ["natural"], difficulty = 1) {
  // Combine all selected types of phrases
  let availablePhrases = [];
  types.forEach((type) => {
    if (DEFAULT_PHRASES[type]) {
      availablePhrases = availablePhrases.concat(DEFAULT_PHRASES[type]);
    }
  });

  if (availablePhrases.length === 0) {
    return "Do I really want to do this?";
  }

  const randomPhrase =
    availablePhrases[Math.floor(Math.random() * availablePhrases.length)];
  const modifier = DIFFICULTY_MODIFIERS[difficulty] || DIFFICULTY_MODIFIERS[1];

  return {
    original: randomPhrase,
    display: modifier.prefix + randomPhrase + modifier.suffix,
    verify: modifier.transform(randomPhrase),
  };
}
