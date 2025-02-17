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

  // Header
  const header = document.createElement("div");
  header.className = "reconsider-header";

  const title = document.createElement("h2");
  title.textContent = "Take a Moment";

  const subtitle = document.createElement("p");
  subtitle.className = "subtitle";
  subtitle.textContent =
    "Before continuing to this website, let's pause and reflect.";

  header.appendChild(title);
  header.appendChild(subtitle);

  // Body
  const body = document.createElement("div");
  body.className = "reconsider-body";

  const phraseContainer = document.createElement("div");
  phraseContainer.className = "phrase-container";

  const instruction = document.createElement("p");
  instruction.className = "phrase-instruction";
  instruction.textContent = "Type this phrase exactly as shown:";

  const highlight = document.createElement("div");
  highlight.className = "phrase-highlight";
  highlight.textContent = phraseData.verify;

  const input = document.createElement("input");
  input.type = "text";
  input.id = "reconsider-input";
  input.placeholder = "Type to continue...";
  input.autocomplete = "off";

  const button = document.createElement("button");
  button.id = "reconsider-submit";
  button.textContent = "Continue";

  phraseContainer.appendChild(instruction);
  phraseContainer.appendChild(highlight);
  body.appendChild(phraseContainer);
  body.appendChild(input);
  body.appendChild(button);

  content.appendChild(header);
  content.appendChild(body);
  overlay.appendChild(content);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

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
