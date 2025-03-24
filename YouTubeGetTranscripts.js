
/*
 * Running this code from the javascript console in Chrome (and other browsers)
 * will output the entire transcript of the youtube video on the current page.
 */

function grabTranscript() {
  
  function clean(text) {  
    if (!text) return null;
    const trimmedText = String(text).trim();
    const lines = trimmedText.split('\n').map(line => line.trim());
    const nonEmptyLines = lines.filter(line => line.length > 0);
    if (!nonEmptyLines.length) return null;
    return nonEmptyLines.join(' ');
 }
  

  let textParts = [];
  
  // grab title
  let $title = document.querySelector('div#title.style-scope.ytd-watch-metadata');
  if ($title) {
    textParts.push('Title: ' + $title.innerText);
  }
  
  // grab url
  let url = '' + location.href;
  if (url) {
    textParts.push('Url: ' + url);
  }
  
  
  // grab channel name
//  const CHANNEL_QUERY = '.iv-branding-context-name';
    const CHANNEL_QUERY = 'ytd-video-owner-renderer #channel-name';
//  const CHANNEL_QUERY = '#channel-name';
  let channel = document.querySelector(CHANNEL_QUERY);
  if (channel) {
    textParts.push('Channel: ' + clean(channel.innerText));
  }
  
  
  
  // grab transcript
  textParts.push('');
  let segments = document.querySelectorAll('.segment-text');
  if (!segments || !segments.length) {
    textParts.push('MAKE SURE YOU EXPAND THE TRANSCRIPT');
  }
  else {
    textParts.push('Transcript:');
    for (let i = 0; i < segments.length; i++) {
      let s = segments[i].innerText;
      textParts.push(s);
    }
  }
  
  // output as plain text
  let outputText = textParts.join('\n');
  console.log(outputText);
}
grabTranscript();
