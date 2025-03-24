
/*
 * Running this code from the javascript console in Chrome (and other browsers)
 * will output the entire transcript of the youtube video on the current page.
 */
function grabTranscript() {
  
//  if (!window._grabbedTranscript) { 
//    window._grabbedTranscript = {};
//  }
  
  function clean(text) {  
    if (!text) return null;
    const trimmedText = String(text).trim();
    const lines = trimmedText.split('\n').map(line => line.trim());
    const nonEmptyLines = lines.filter(line => line.length > 0);
    if (!nonEmptyLines.length) return null;
    return nonEmptyLines.join(' ');
 }
 
 function openTranscript() {
   let btn = document.querySelector('[aria-label="Show transcript"]');
   if (btn) {
     btn.click();
     return true;
   }
   else {
     return false;
   }
 }
  
  let textParts = [];
  
  // grab title
  let $title = document.querySelector('div#title.style-scope.ytd-watch-metadata');
  if ($title) {
    textParts.push('Title: ' + $title.innerText);
  }
  
  // grab url
  let url = '' + location.href;
//  if (window._grabbedTranscript[url] === '1') {
//    console.log('already processed ' + url);
//    return; // skipping already processed
//  }
//  window._grabbedTranscript[url] = '1';
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
    // open the transcript and retry
    if (openTranscript()) {
      setTimeout(grabTranscript, 100);
      return false;
    }
    else {
      textParts.push('MAKE SURE YOU EXPAND THE TRANSCRIPT');
    }
  }
  else {
    textParts.push('Transcript:');
    for (let i = 0; i < segments.length; i++) {
      let s = segments[i].innerText;
      textParts.push(s);
    }
  }
  
  // output as plain text
  let outputText = textParts.join('\n') + '\n\n---\n\n';
  console.log(outputText);
  
  
  // run the next page automatically when a new video is detected
  window.onhashchange = function() {
    setTimeout(grabTranscript, 500);
  };
}
grabTranscript();
