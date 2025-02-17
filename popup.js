document.addEventListener("DOMContentLoaded", function () {
  // Load saved settings
  chrome.storage.sync.get(
    ["urls", "difficulty", "customPhrases"],
    function (data) {
      if (data.urls) {
        displayUrls(data.urls);
      }
      if (data.difficulty) {
        document.getElementById("difficulty").value = data.difficulty;
        updateDifficultyLabel(data.difficulty);
      }
    }
  );

  // Add URL button handler
  document.getElementById("addUrl").addEventListener("click", addUrl);
  document.getElementById("newUrl").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addUrl();
    }
  });

  // Difficulty slider handler
  const difficultySlider = document.getElementById("difficulty");
  difficultySlider.addEventListener("input", function () {
    updateDifficultyLabel(this.value);
  });
  difficultySlider.addEventListener("change", function () {
    chrome.storage.sync.set({ difficulty: parseInt(this.value) });
  });

  // Add custom phrase handler
  document.getElementById("addPhrase").addEventListener("click", addPhrase);
  document
    .getElementById("customPhrase")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        addPhrase();
      }
    });
});

function cleanUrl(url) {
  // Remove protocol, www, and any paths/parameters
  url = url.toLowerCase().trim();
  url = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
  url = url.split(/[/?#]/)[0]; // Remove paths, query parameters, and hashes
  return url;
}

function addUrl() {
  const urlInput = document.getElementById("newUrl");
  let url = urlInput.value.trim();

  if (url) {
    url = cleanUrl(url);
    console.log("Adding URL:", url); // Debug log

    chrome.storage.sync.get(["urls"], function (data) {
      const urls = data.urls || [];
      if (!urls.includes(url)) {
        urls.push(url);
        chrome.storage.sync.set({ urls: urls }, function () {
          console.log("URLs saved:", urls); // Debug log
          displayUrls(urls);
          urlInput.value = "";
          showMessage(urlInput, "Website added successfully!");
        });
      } else {
        urlInput.value = "";
        showMessage(urlInput, "URL already added!");
      }
    });
  }
}

function addPhrase() {
  const phraseInput = document.getElementById("customPhrase");
  const phrase = phraseInput.value.trim();

  if (phrase) {
    chrome.storage.sync.get(["customPhrases"], function (data) {
      const phrases = data.customPhrases || [];
      if (!phrases.includes(phrase)) {
        phrases.push(phrase);
        chrome.storage.sync.set({ customPhrases: phrases }, function () {
          phraseInput.value = "";
          showMessage(phraseInput, "Phrase added successfully!");
        });
      } else {
        phraseInput.value = "";
        showMessage(phraseInput, "Phrase already exists!");
      }
    });
  }
}

function showMessage(input, message) {
  const originalPlaceholder = input.placeholder;
  input.placeholder = message;
  setTimeout(() => {
    input.placeholder = originalPlaceholder;
  }, 2000);
}

function displayUrls(urls) {
  const urlList = document.getElementById("urlList");
  urlList.innerHTML = ""; // Safe to clear the list

  urls.forEach((url, index) => {
    const div = document.createElement("div");
    div.className = "url-item";

    const span = document.createElement("span");
    span.textContent = url;

    const button = document.createElement("button");
    button.className = "delete-btn";
    button.setAttribute("data-index", index.toString());
    button.setAttribute("title", "Remove website");

    // Create SVG icon
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "14");
    svg.setAttribute("height", "14");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    const line1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    line1.setAttribute("x1", "18");
    line1.setAttribute("y1", "6");
    line1.setAttribute("x2", "6");
    line1.setAttribute("y2", "18");

    const line2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    line2.setAttribute("x1", "6");
    line2.setAttribute("y1", "6");
    line2.setAttribute("x2", "18");
    line2.setAttribute("y2", "18");

    svg.appendChild(line1);
    svg.appendChild(line2);
    button.appendChild(svg);

    div.appendChild(span);
    div.appendChild(button);
    urlList.appendChild(div);
  });

  // Add delete button handlers
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      chrome.storage.sync.get(["urls"], function (data) {
        const currentUrls = data.urls || [];
        currentUrls.splice(index, 1);
        chrome.storage.sync.set({ urls: currentUrls }, function () {
          console.log("ReConsider: URL deleted, remaining URLs:", currentUrls);
          displayUrls(currentUrls);
        });
      });
    });
  });
}

function updateDifficultyLabel(value) {
  const difficultyValue = document.querySelector(".difficulty-value");
  const labels = {
    1: "Basic (2-3 words)",
    2: "Light (4-5 words)",
    3: "Moderate (6-7 words)",
    4: "Hard (8-9 words)",
    5: "Complex (10+ words)",
  };
  difficultyValue.textContent = labels[value] || labels[3];
}
