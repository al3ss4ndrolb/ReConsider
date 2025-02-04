console.log("ReConsider: Content script loaded");

function checkAndCreateOverlay() {
  chrome.storage.sync.get(
    ["urls", "difficulty", "customPhrases"],
    function (data) {
      const currentUrl = window.location.hostname.toLowerCase();
      const cleanCurrentUrl = currentUrl.replace(/^www\./i, "");
      const urls = data.urls || [];

      console.log("ReConsider: Current URL:", currentUrl);
      console.log("ReConsider: Clean URL:", cleanCurrentUrl);
      console.log("ReConsider: Blocked URLs:", urls);

      // Check if any of the blocked URLs match the current URL
      const matchingUrl = urls.find((url) => {
        const cleanBlockedUrl = url.toLowerCase().trim();
        console.log("ReConsider: Checking against:", cleanBlockedUrl);
        return cleanCurrentUrl.includes(cleanBlockedUrl);
      });

      if (matchingUrl) {
        console.log("ReConsider: URL match found:", matchingUrl);
        const difficulty = data.difficulty || 3;
        // Handle the Promise from getRandomPhrase
        getRandomPhrase(difficulty).then((phraseData) => {
          if (!document.querySelector(".reconsider-overlay")) {
            createOverlay(phraseData);
          }
        });
      } else {
        console.log("ReConsider: No URL match found");
      }
    }
  );
}

// Try immediately
checkAndCreateOverlay();

// Also try when DOM is loaded (as backup)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkAndCreateOverlay);
} else {
  checkAndCreateOverlay();
}

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
        <p class="phrase-instruction">Type this phrase exactly as shown:</p>
        <div class="phrase-highlight">${phraseData.verify}</div>
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
    if (input.value.trim() === phraseData.verify) {
      overlay.classList.add("fade-out");
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = "";
      }, 300);
    } else {
      input.classList.add("error");
      setTimeout(() => {
        input.classList.remove("error");
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
