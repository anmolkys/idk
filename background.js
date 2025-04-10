// Place your Pushover credentials here.
// WARNING: Hard-coding tokens in an extension means they can be viewed by others.
const PUSHOVER_USER_KEY = "";
const PUSHOVER_API_TOKEN = "";

// Function to send a Pushover notification using fetch
function sendPushoverNotification(data) {
  // Endpoint for sending messages via Pushover
  const endpoint = "https://api.pushover.net/1/messages.json";
  
  // Construct the payload using URLSearchParams
  const params = new URLSearchParams();
  params.append("token", PUSHOVER_API_TOKEN);
  params.append("user", PUSHOVER_USER_KEY);
  params.append("message", `The monitored value is ${data.value} at ${data.url} (recorded at ${data.timestamp}).`);
  params.append("title", "Alert: Threshold Exceeded");

  fetch(endpoint, {
    method: "POST",
    body: params
  })
  .then(response => response.json())
  .then(result => console.log("Pushover notification sent:", result))
  .catch(error => console.error("Error sending Pushover notification:", error));
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "VALUE_UPDATE") {
    const data = message.data;
    
    // Log the received data (optional for debugging)
    console.log("Background received update:", data);
    
    // Check if the monitored value exceeds the threshold (e.g., > 5)
    if (data.value > 5) {
      sendPushoverNotification(data);
    }
  }
});
sendPushoverNotification()