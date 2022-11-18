function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    bgpurl: document.querySelector("#bgpurl").value
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#bgpurl").value = result.bgpurl || "https://bgp.tools/as/";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get("bgpurl");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
