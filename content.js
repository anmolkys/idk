// content.js

/**
 * Processes the target cell by reading its value,
 * parsing it as a number, and sending the data to the background script.
 */
function processValue() {
  // Select the target cell from the table.
  const cell = document.querySelector(".fwi-grid-table-wrapper tr:nth-child(2) td:nth-child(6)");
  if (!cell) {
    console.log("Target cell not found!");
    return;
  }

  // Get the text inside the cell, trim it, and parse it as a float.
  const textValue = cell.innerText.trim();
  const value = parseFloat(textValue);
  if (isNaN(value)) {
    console.log("No valid number in cell:", textValue);
    return;
  }

  // Build a monitoring data object including the value and some metadata.
  const monitoringData = {
    value,
    url: window.location.href,
    timestamp: new Date().toISOString()
  };

  console.log("Monitored value:", monitoringData);

  // Send the data to the background script.
  chrome.runtime.sendMessage({ type: "VALUE_UPDATE", data: monitoringData });
}

/**
 * Initializes a MutationObserver on the target cell so that whenever the cell's
 * content changes, processValue() is called.
 */
function initMutationObserver() {
  // Select the target cell.
  const cell = document.querySelector(".fwi-grid-table-wrapper tr:nth-child(2) td:nth-child(6)");
  if (!cell) {
    console.log("Target cell not found for observation!");
    return;
  }

  // Create a new MutationObserver instance.
  const observer = new MutationObserver((mutationsList) => {
    // Loop through any mutations.
    for (const mutation of mutationsList) {
      // If child nodes or character data has changed, process the updated value.
      if (mutation.type === "childList" || mutation.type === "characterData") {
        // A short delay ensures the DOM has fully updated.
        setTimeout(processValue, 100);
        break; // Process once per batch of mutations.
      }
    }
  });

  // Set the observer's configuration.
  observer.observe(cell, {
    childList: true,
    characterData: true,
    subtree: true
  });

  console.log("Mutation observer initialized on target cell.");
}

// Run the observer and process the initial value once the page loads.
window.addEventListener("load", () => {
  setTimeout(()=>{
    initMutationObserver();
    processValue();
  },5000);
});
