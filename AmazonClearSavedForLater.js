/*
 * Deletes all saved for later items on Amazon.com.
 * Paste this script into the Javascript Console and watch the
 * "Saved for later (725 items)" head toward zero.
 */

function deleteSaved() {
	// look at all submit elements
	let submitList = document.querySelectorAll('input[type="submit"]');
	let submit = null;
	for (let i = 0; i < submitList.length;i++) {
		let name = submitList[i].name || '';
		if (name.indexOf('delete') !== -1) {
			console.log('deleting ' + name + ' at index ' + i);
			submit = submitList[i];
			break;
		}
	}
	if (submit != null) {
		// found aa delete saved item, let's click it
		submit.click();
		setTimeout(deleteSaved,100);
	}
	else {
		// wait a while, we must have hit the quota limit
		console.log('no delete button found');
		setTimeout(deleteSaved,4000);
	}
}
deleteSaved();
