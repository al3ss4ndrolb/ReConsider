document.addEventListener("DOMContentLoaded", function () {
  // Load saved URLs and phrase
  chrome.storage.sync.get(["urls", "phrase"], function (data) {
    if (data.urls) {
      displayUrls(data.urls);
    }
    if (data.phrase) {
      document.getElementById("verificationPhrase").value = data.phrase;
    }
  });

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

  // Save phrase button handler
  document.getElementById("savePhrase").addEventListener("click", function () {
    const phrase = document.getElementById("verificationPhrase").value.trim();
    if (phrase) {
      chrome.storage.sync.set({ phrase: phrase });
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
      <button class="delete-btn" data-index="${index}">Delete</button>
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
