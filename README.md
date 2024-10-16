# WebsiteAutomation
Scripts for pasting into the javascript console to automate tasks that might take a lot of time if you have a lot of data.

The idea here is to copy the entire file (optionally skipping the description comment at the top) and the code will run immediately after it is pasted into the Javascript Console window.  The progress will be displayed in the console window itself.

## How to Open the Javascript Console window.
In most browsers, right click somewhere on the webpage you want to run the script against, and choose "Inspect" (near the bottom of the context menu that appears).  This opens the DevTools window.  The "Console" tab is what you are looking for.  You will see a flashing cursor.  Paste your code here and it will start running.  An error will be displayed in red if there is some issue with the code, though many red errors may be part of the normal operation of the script.

## Scripts In This Repository

* [AmazonClearSavedForLater.js](AmazonClearSavedForLater.js) - for use on your shopping cart screen on Amazon.com when looking at the Saved for Later items.  Will press the "delete" link on every item saved for later until there are no items left.  (Actually it'll keep trying to click after there are no items left, you might right to refresh the page when it's done)
  
