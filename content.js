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
    <input type="text" id="reconsider-input" placeholder="Type the phrase">
    <button id="reconsider-submit">Continue</button>
  `;

  overlay.appendChild(content);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  document
    .getElementById("reconsider-submit")
    .addEventListener("click", checkPhrase);
  document
    .getElementById("reconsider-input")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        checkPhrase();
      }
    });

  function checkPhrase() {
    const input = document.getElementById("reconsider-input").value;
    if (input === phrase) {
      overlay.remove();
      document.body.style.overflow = "";
    } else {
      document.getElementById("reconsider-input").style.borderColor = "red";
    }
  }
}
