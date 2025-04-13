// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "VALUE_UPDATE") {
    const { value, url, timestamp } = message.data;
    console.log("Background received value:", value, "from", url, "at", timestamp);

    // Check if value exceeds the threshold (5)
    if (value > 5) {
      sendPushoverNotification(value, url, timestamp);
    }
  }
});

/**
 * Sends a Pushover notification via the Pushover API.
 * Replace 'your_app_token' and 'your_user_key' with your actual credentials.
 */
function sendPushoverNotification(value, url, timestamp) {
  const token = "at5yoy77cj9wvt8rys876t8vn7bgce"; // Replace with your Pushover app token
  const user = "u5ntv4yk8yvgsc4pt4zz9osn4tthhe";    // Replace with your Pushover user key
  const message = `Alert: Monitored value exceeded threshold.\nValue: ${value}\nURL: ${url}\nTimestamp: ${timestamp}`;
  const title = "Threshold Exceeded";

  // Pushover expects application/x-www-form-urlencoded data.
  const formData = new URLSearchParams();
  formData.append("token", token);
  formData.append("user", user);
  formData.append("message", message);
  formData.append("title", title);

  console.log("Sending Pushover notification with data:", { token, user, message, title });

  fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log("Pushover API response:", data);
    })
    .catch(error => {
      console.error("Error sending Pushover notification:", error);
    });
}
