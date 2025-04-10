// Utility function to add a row to the table
function addRow(data) {
    const tableBody = document.querySelector("#monitorTable tbody");
    const row = document.createElement("tr");
  
    // Timestamp cell
    const tsCell = document.createElement("td");
    tsCell.textContent = new Date(data.timestamp).toLocaleString();
    row.appendChild(tsCell);
  
    // Value cell
    const valueCell = document.createElement("td");
    valueCell.textContent = data.value;
    row.appendChild(valueCell);
  
    // URL cell (make it clickable)
    const urlCell = document.createElement("td");
    const link = document.createElement("a");
    link.href = data.url;
    link.textContent = data.url;
    link.target = "_blank";
    urlCell.appendChild(link);
    row.appendChild(urlCell);
  
    tableBody.appendChild(row);
  }
  
  // Load initial history from storage
  chrome.storage.local.get({ monitoringHistory: [] }, (result) => {
    const history = result.monitoringHistory;
    history.forEach(addRow);
  });
  
  // Listen for new values forwarded from the background worker
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "NEW_VALUE") {
      addRow(message.data);
    }
  });  