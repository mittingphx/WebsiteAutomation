/*
 * Deletes all saved for later items on Amazon.com.
 * Run this script in the browser console while viewing your saved items.
 */
function deleteSaved() {
  // Constants
  const DELETE_BUTTON_SELECTOR = 'input[type="submit"]';
  const RETRY_DELAY = 100;
  const QUOTA_DELAY = 4000;

  // Find delete button
  const submitList = document.querySelectorAll(DELETE_BUTTON_SELECTOR);
  let deleteButton = null;

  for (let button of submitList) {
    const name = button.name || '';
    if (name.includes('delete')) {
      const itemName = button.closest('li')?.querySelector('.a-list-item')?.textContent?.trim() || 'item';
      console.log(`Deleting saved item: ${itemName}`);
      deleteButton = button;
      break;
    }
  }

  if (deleteButton) {
    deleteButton.click();
    setTimeout(deleteSaved, RETRY_DELAY);
  } else {
    console.log('No more items to delete - waiting for rate limit');
    setTimeout(deleteSaved, QUOTA_DELAY);
  }
}

deleteSaved();
