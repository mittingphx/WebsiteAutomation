
/*
 * Running this code from the javascript console in Chrome (and other browsers)
 * will output the entire transcript of the youtube video on the current page.
 */

function grabTranscript() {
  let textParts = [];
  let segments = document.querySelectorAll('.segment-text');
  for (let i = 0; i < segments.length; i++) {
    let s = segments[i].innerText;
    textParts.push(s);
  }
  let outputText = textParts.join('\n');
  console.log(outputText);
}
grabTranscript();
