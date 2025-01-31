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
  urlList.innerHTML = "";

  urls.forEach((url, index) => {
    const div = document.createElement("div");
    div.className = "url-item";
    div.innerHTML = `
      <span>${url}</span>
      <button class="delete-btn" data-index="${index}">×</button>
    `;
    urlList.appendChild(div);
  });

  // Add delete button handlers
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      urls.splice(index, 1);
      chrome.storage.sync.set({ urls: urls }, function () {
        console.log("URL deleted, remaining URLs:", urls); // Debug log
        displayUrls(urls);
      });
    });
  });
}

function updateDifficultyLabel(value) {
  const difficultyValue = document.querySelector(".difficulty-value");
  const labels = {
    1: "Very Easy",
    3: "Easy",
    5: "Moderate",
    7: "Hard",
    10: "Very Hard",
  };
  difficultyValue.textContent = `${labels[value]} (${value})`;
}
