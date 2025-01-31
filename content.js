chrome.storage.sync.get(
  ["urls", "difficulty", "customPhrases"],
  function (data) {
    const currentUrl = window.location.hostname.toLowerCase();
    const cleanCurrentUrl = currentUrl.replace(/^www\./i, "");
    const urls = data.urls || [];

    if (urls.some((url) => cleanCurrentUrl.includes(url))) {
      const difficulty = data.difficulty || 5;
      const customPhrases = data.customPhrases || [];

      // Add custom phrases if they exist
      if (customPhrases.length > 0) {
        PHRASES.push(...customPhrases);
      }

      const phraseData = getRandomPhrase(difficulty);
      createOverlay(phraseData);
    }
  }
);

function createOverlay(phraseData) {
  const overlay = document.createElement("div");
  overlay.className = "reconsider-overlay";

  const content = document.createElement("div");
  content.className = "reconsider-content";

  content.innerHTML = `
    <div class="reconsider-header">
      <h2>Take a Moment</h2>
      <p class="subtitle">Before continuing to this website, let's pause and reflect.</p>
    </div>
    <div class="reconsider-body">
      <div class="phrase-container">
        <p class="phrase-instruction">${phraseData.display}</p>
        <div class="phrase-highlight">${phraseData.original}</div>
      </div>
      <input type="text" id="reconsider-input" placeholder="Type to continue..." autocomplete="off" />
      <button id="reconsider-submit">Continue</button>
    </div>
  `;

  overlay.appendChild(content);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  const input = document.getElementById("reconsider-input");
  const button = document.getElementById("reconsider-submit");

  function checkPhrase() {
    if (input.value === phraseData.verify) {
      overlay.classList.add("fade-out");
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = "";
      }, 300);
    } else {
      input.classList.add("error");
      input.value = "";
      input.placeholder = "Try again...";
      setTimeout(() => {
        input.classList.remove("error");
        input.placeholder = "Type to continue...";
      }, 500);
    }
  }

  button.addEventListener("click", checkPhrase);
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      checkPhrase();
    }
  });

  // Focus the input field
  input.focus();
}
