(() => {
  const container = document.querySelector('[data-testid="modal-memories"]');

  if (!container) {
    alert('Please open the memory window first:\nSettings > Personalization > Memory > Manage memories');
    console.log('Missing element: data-testid="modal-memories". You must open the memory manager first.');
    return;
  }

  const rows = container.querySelectorAll('table tr');
  const memories = Array.from(rows)
    .map(row => row.querySelector('td div.py-2'))
    .filter(div => div)
    .map(div => div.innerText.trim());

  if (memories.length === 0) {
    alert('No memories found in the memory window.');
    console.log('The memory window is open but contains no extractable memory rows.');
    return;
  }

  const mdContent = memories.join('\n\n---\n\n');

  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const filename = `chatgpt-memories-${timestamp}.md`;

  const blob = new Blob([mdContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();

  URL.revokeObjectURL(url);
  document.body.removeChild(a);
})();
