(async () => {
  // Function to pause execution for a given time
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Identify the scrollable container for messages
  const scrollContainer = document.querySelector('[aria-label="Message list"]');
  if (!scrollContainer) {
    console.error("Unable to locate the message container.");
    return;
  }

  // Auto-scroll to load all messages
  let previousHeight = -1;
  let sameHeightCount = 0;
  while (sameHeightCount < 5) {
    scrollContainer.scrollTop = 0;
    await sleep(500);
    const currentHeight = scrollContainer.scrollHeight;
    if (currentHeight === previousHeight) {
      sameHeightCount++;
    } else {
      sameHeightCount = 0;
      previousHeight = currentHeight;
    }
  }

  // Extract messages
  const messageElements = document.querySelectorAll('[data-testid="message-container"]');
  const messages = [];
  messageElements.forEach((element) => {
    const senderElement = element.querySelector('[role="button"] span span');
    const sender = senderElement ? senderElement.textContent.trim() : 'Unknown';

    const timestampElement = element.querySelector('abbr');
    const timestamp = timestampElement ? timestampElement.getAttribute('data-tooltip-content') : '';

    const textElements = element.querySelectorAll('[data-testid="message-text"]');
    textElements.forEach((textEl) => {
      const text = textEl.textContent.trim();
      if (text) {
        messages.push({
          sender,
          timestamp,
          text
        });
      }
    });
  });

  // Prepare JSON data
  const chatData = {
    extractedAt: new Date().toISOString(),
    messages
  };

  // Create and trigger download
  const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const filename = `messenger_chat_${new Date().toISOString().split('T')[0]}.json`;
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log(`Downloaded ${messages.length} messages to "${filename}"`);
})();
