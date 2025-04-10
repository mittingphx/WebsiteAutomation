(function() {
  const filename = `chatgpt-export-${Date.now()}.html`;

  // Basic HTML structure with some styling
  const htmlHeader = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ChatGPT Export</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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
<div class="wrapper">
`;

  const htmlFooter = `
</div>
</body>
</html>`;

  // Grab all messages based on role
  const messageBlocks = Array.from(document.querySelectorAll('[data-message-author-role]'));

  const formattedMessages = messageBlocks.map(el => {
    const role = el.dataset.messageAuthorRole;
    const content = el.innerText.replace(/\n{2,}/g, "\n\n").trim();
    const safeContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const className = role === 'user' ? 'user' : 'assistant';
    return `<div class="message ${className}">${safeContent}</div>`;
  });

  const fullHTML = htmlHeader + formattedMessages.join("\n") + htmlFooter;

  // Trigger download
  const blob = new Blob([fullHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
})();
