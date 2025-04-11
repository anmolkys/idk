// Function to extract and process the target value from the topmost row.
function processValue() {
  // Select the topmost row in the table.
  const row = document.querySelector("table.fwi-grid-table-wrapper tbody tr:nth-child(1)");
  if (!row) {
    console.log("Topmost row not found!");
    return;
  }

  // Select the target cell (adjust the nth-child index as necessary).
  const cell = row.querySelector("td:nth-child(3)");
  if (!cell) {
    console.log("Target cell not found!");
    return;
  }

  // Parse the numeric value from the cell.
  const textValue = cell.innerText.trim();
  const value = parseFloat(textValue);
  if (isNaN(value)) {
    console.log("No valid number in the cell:", textValue);
    return;
  }

  // Construct a data object and log it.
  const monitoringData = {
    value,
    url: window.location.href,
    timestamp: new Date().toISOString()
  };
  console.log("Monitored value:", monitoringData);

  // Send the update to the background script.
  chrome.runtime.sendMessage({ type: "VALUE_UPDATE", data: monitoringData });
}

// Set up a MutationObserver to watch for changes in the target cell.
function initObserver() {
  // Select the cell to observe.
  const row = document.querySelector("table.fwi-grid-table-wrapper tbody tr:nth-child(1)");
  if (!row) {
    console.log("Topmost row not found for observation!");
    return;
  }

  const cell = row.querySelector("td:nth-child(3)");
  if (!cell) {
    console.log("Target cell not found for observation!");
    return;
  }

  // Create a new observer instance.
  const observer = new MutationObserver((mutationsList) => {
    // When the cell’s text changes, process the new value.
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        // Delay slightly in case the change happens in multiple steps.
        setTimeout(processValue, 100);
        break; // Process once per batch of mutations.
      }
    }
  });

  // Configure the observer to watch for changes in the cell's child nodes and text content.
  observer.observe(cell, {
    characterData: true,
    childList: true,
    subtree: true
  });

  console.log("Mutation observer initialized on target cell.");
}

// Run the observer when the page has loaded.
window.addEventListener("load", () => {
  initObserver();
  // Optionally, process the value immediately after load.
  processValue();
});