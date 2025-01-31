chrome.storage.sync.get(["urls", "phrase"], function (data) {
  const currentUrl = window.location.hostname;
  const urls = data.urls || [];

  if (urls.some((url) => currentUrl.includes(url))) {
    createOverlay(data.phrase || "Do I really want to do this?");
  }
});

function createOverlay(phrase) {
  const overlay = document.createElement("div");
  overlay.className = "reconsider-overlay";

  const content = document.createElement("div");
  content.className = "reconsider-content";

  content.innerHTML = `
    <h2>Take a Moment to ReConsider</h2>
    <p>Type this phrase to continue: <strong>${phrase}</strong></p>
    <input type="text" id="reconsider-input" placeholder="Type the phrase" autocomplete="off" />
    <button id="reconsider-submit">Continue</button>
  `;

  overlay.appendChild(content);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  const input = document.getElementById("reconsider-input");
  const button = document.getElementById("reconsider-submit");

  function checkPhrase() {
    if (input.value === phrase) {
      overlay.remove();
      document.body.style.overflow = "";
    } else {
      input.classList.add("error");
      input.value = "";
      input.placeholder = "Try again...";
      setTimeout(() => {
        input.classList.remove("error");
        input.placeholder = "Type the phrase";
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
