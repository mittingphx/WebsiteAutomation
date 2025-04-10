/*
 * Exports the current ChatGPT conversation as a styled HTML file.
 * Run this script in the browser console while viewing a chat to
 * download an HTML file containing the conversation.
 */
function exportChatGPT() {
  // Constants
  const MESSAGE_SELECTOR = '[data-message-author-role]';
  const FILENAME = `chatgpt-export-${Date.now()}.html`;
  
  // HTML template parts
  const HTML_HEADER = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ChatGPT Export</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #f7f7f8;
    color: #111;
    padding: 20px;
    line-height: 1.6;
  }
  .message { 
    border-radius: 18px; 
    padding: 14px 20px; 
    margin: 10px 0; 
    max-width: 80%; 
    white-space: pre-wrap;
  }
  .user { 
    background-color: #d1e7dd; 
    align-self: flex-end; 
    text-align: right;
    margin-left: auto;
  }
  .assistant { 
    background-color: #e7e9eb; 
    align-self: flex-start; 
    text-align: left;
    margin-right: auto;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
  }
</style>
</head>
<body>
<h2>ChatGPT Conversation Export</h2>
<p><small>Exported from: ${window.location.href}</small></p>
<div class='wrapper'>
`;

  const HTML_FOOTER = `
</div>
</body>
</html>`;

  // Helper functions
  function sanitizeContent(text) {
    return text
      .replace(/\n{2,}/g, '\n\n')
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function formatMessage(element) {
    const role = element.dataset.messageAuthorRole;
    const content = sanitizeContent(element.innerText);
    const className = role === 'user' ? 'user' : 'assistant';
    return `<div class="message ${className}">${content}</div>`;
  }

  function downloadHTML(content) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = FILENAME;
    a.click();
    URL.revokeObjectURL(url);
    console.log(`Downloaded ChatGPT conversation as ${FILENAME} (${blob.size.toLocaleString()} bytes)`);
  }

  // Main logic
  const messageBlocks = Array.from(document.querySelectorAll(MESSAGE_SELECTOR));
  const formattedMessages = messageBlocks.map(formatMessage);
  const fullHTML = HTML_HEADER + formattedMessages.join('\n') + HTML_FOOTER;
  
  // Trigger download
  downloadHTML(fullHTML);
}

exportChatGPT();
