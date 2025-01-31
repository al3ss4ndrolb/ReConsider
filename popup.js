document.addEventListener("DOMContentLoaded", function () {
  // Load saved settings
  chrome.storage.sync.get(
    ["urls", "difficulty", "phraseTypes", "customPhrases"],
    function (data) {
      if (data.urls) {
        displayUrls(data.urls);
      }
      if (data.difficulty) {
        document.getElementById("difficulty").value = data.difficulty;
        updateDifficultyLabel(data.difficulty);
      }
      if (data.phraseTypes) {
        data.phraseTypes.forEach((type) => {
          document.querySelector(`input[value="${type}"]`).checked = true;
        });
      } else {
        // Default to natural language if no settings saved
        chrome.storage.sync.set({ phraseTypes: ["natural"] });
      }
    }
  );

  // Add URL button handler
  document.getElementById("addUrl").addEventListener("click", function () {
    const urlInput = document.getElementById("newUrl");
    const url = urlInput.value.trim();

    if (url) {
      chrome.storage.sync.get(["urls"], function (data) {
        const urls = data.urls || [];
        urls.push(url);
        chrome.storage.sync.set({ urls: urls }, function () {
          displayUrls(urls);
          urlInput.value = "";
        });
      });
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

  // Phrase type checkboxes handler
  document.querySelectorAll('input[name="phraseType"]').forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const selectedTypes = Array.from(
        document.querySelectorAll('input[name="phraseType"]:checked')
      ).map((cb) => cb.value);

      // Ensure at least one type is selected
      if (selectedTypes.length === 0) {
        this.checked = true;
        return;
      }

      chrome.storage.sync.set({ phraseTypes: selectedTypes });
    });
  });

  // Add custom phrase handler
  document.getElementById("addPhrase").addEventListener("click", function () {
    const phraseInput = document.getElementById("customPhrase");
    const phrase = phraseInput.value.trim();

    if (phrase) {
      chrome.storage.sync.get(["customPhrases"], function (data) {
        const phrases = data.customPhrases || [];
        phrases.push(phrase);
        chrome.storage.sync.set({ customPhrases: phrases }, function () {
          phraseInput.value = "";
          // Show success message or update UI
          phraseInput.placeholder = "Phrase added successfully!";
          setTimeout(() => {
            phraseInput.placeholder = "Add your own phrase (optional)";
          }, 2000);
        });
      });
    }
  });
});

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
