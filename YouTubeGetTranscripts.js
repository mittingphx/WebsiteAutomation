
/*
 * Extracts the transcript from the current YouTube video.
 * Run this script in the browser console while viewing a video.
 */
function grabTranscript() {
  // Constants
  const TRANSCRIPT_BUTTON_SELECTOR = '[aria-label="Show transcript"]';
  const TITLE_SELECTOR = 'div#title.style-scope.ytd-watch-metadata';
  const CHANNEL_SELECTOR = 'ytd-video-owner-renderer #channel-name';
  const SEGMENT_SELECTOR = '.segment-text';
  const RETRY_DELAY = 100;
  const PAGE_CHANGE_DELAY = 500;
  const FILENAME = `youtube-transcript-${Date.now()}.html`;

  // HTML template parts
  const HTML_HEADER = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>YouTube Transcript Export</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #f7f7f8;
    color: #111;
    padding: 20px;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
  }
  .metadata {
    background-color: #e7e9eb;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .transcript {
    white-space: pre-wrap;
  }
  .segment {
    margin: 10px 0;
  }
</style>
</head>
<body>
<h2>YouTube Transcript Export</h2>
<div class="metadata">
`;

  const HTML_FOOTER = `
</div>
</body>
</html>`;

  // Helper functions
  function clean(text) {
    if (!text) return null;
    const trimmedText = String(text).trim();
    const lines = trimmedText.split('\n').map(line => line.trim());
    return lines.filter(line => line.length > 0).join(' ');
  }

  function openTranscript() {
    const btn = document.querySelector(TRANSCRIPT_BUTTON_SELECTOR);
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }

  function downloadHTML(content) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = FILENAME;
    a.click();
    URL.revokeObjectURL(url);
    console.log(`Downloaded YouTube transcript as ${FILENAME} (${blob.size.toLocaleString()} bytes)`);
  }

  // Collect text parts
  const textParts = [];

  // Title
  const title = document.querySelector(TITLE_SELECTOR);
  if (title) textParts.push(`<p><strong>Title:</strong> ${title.innerText}</p>`);

  // URL
  textParts.push(`<p><strong>URL:</strong> ${location.href}</p>`);

  // Channel
  const channel = document.querySelector(CHANNEL_SELECTOR);
  if (channel) textParts.push(`<p><strong>Channel:</strong> ${clean(channel.innerText)}</p>`);

  // Close metadata div and start transcript
  textParts.push('</div><div class="transcript">');

  // Transcript
  const segments = document.querySelectorAll(SEGMENT_SELECTOR);
  
  if (!segments?.length) {
    if (openTranscript()) {
      setTimeout(grabTranscript, RETRY_DELAY);
      return false;
    }
    textParts.push('<p><strong>ERROR: MAKE SURE YOU EXPAND THE TRANSCRIPT</strong></p>');
  } else {
    textParts.push('<h3>Transcript:</h3>');
    segments.forEach(segment => {
      textParts.push(`<div class="segment">${segment.innerText}</div>`);
    });
  }

  // Close transcript div
  textParts.push('</div>');

  // Generate and download HTML
  const fullHTML = HTML_HEADER + textParts.join('\n') + HTML_FOOTER;
  downloadHTML(fullHTML);

  // Handle page changes
  window.onhashchange = () => setTimeout(grabTranscript, PAGE_CHANGE_DELAY);
}

grabTranscript();
