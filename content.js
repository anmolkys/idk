// Replace '#your-target-element-id' with the actual CSS selector or element ID for your target element

    function monitorValue() {
        // Use class selector (update ".your-target-element-class" to your class name)
        const target = document.querySelector(".gws-csf-randomnumber__result");
        if (!target) return;
      
        const value = parseFloat(target.innerText);
        if (isNaN(value)) return;
      
        const monitoringData = {
          value,
          url: window.location.href,
          timestamp: new Date().toISOString()
        };
      
        console.log("Monitored value:", monitoringData);
      
        // Send the update to the background script
        chrome.runtime.sendMessage({ type: "VALUE_UPDATE", data: monitoringData });
      }
      
      // Check every minute
      setInterval(monitorValue, 10 * 1000);
      
      // Optionally, run immediately after page load.
      monitorValue();
      