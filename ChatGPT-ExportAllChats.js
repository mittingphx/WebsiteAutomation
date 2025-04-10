(async function () {
    // --- CONFIGURATION ---
    const delayPerChat = 2500; // ms between each load
    const extraDelay = 1000;   // ms for safety
  
    // --- HELPERS ---
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    const toDOSDate = d => ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    const toDOSTime = d => (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2);
    const strToArr = s => new TextEncoder().encode(s);
  
    // --- CHAT LINKS ---
    const chatLinks = [...document.querySelectorAll('nav a[href^="/c/"]')]
      .filter(a => !a.textContent.toLowerCase().includes("project"))
      .map(a => ({ href: a.href, el: a }));
  
    const total = chatLinks.length;
    const estMs = total * (delayPerChat + extraDelay);
    const eta = `${Math.floor(estMs / 60000)}m${String(Math.round((estMs % 60000) / 1000)).padStart(2, '0')}s`;
  
    console.log(`📊 Will download ${total} chats`);
    console.log(`⏱ Waiting ${delayPerChat}ms per chat (+${extraDelay}ms buffer)`);
    console.log(`📦 Total estimated time: ${eta}`);
    console.log("🟡 Confirm dialog waiting in ChatGPT window...");
  
    if (!confirm(`📥 This will download ${total} chats as a .zip file.\n\n• Wait per chat: ${delayPerChat}ms\n• Estimated total time: ${eta}\n\nProceed?`)) {
      console.log("❌ Cancelled by user.");
      return;
    }
  
    const files = [];
  
    for (let i = 0; i < chatLinks.length; i++) {
      const { el, href } = chatLinks[i];
      console.log(`➡️ Loading ${i + 1}/${total}: ${href}`);
      el.click();
      await sleep(delayPerChat);
  
      const messages = [...document.querySelectorAll('[data-message-author-role]')];
      const title = document.title.replace(/[\\/:*?"<>|]/g, '-');
      const output = [];
      output.push(`<html><head><meta charset="utf-8"><title>${title}</title>
        <style>
          body { font-family: sans-serif; padding: 20px; line-height: 1.6; background: #f9f9f9; color: #111; }
          .message { margin: 1em 0; padding: 1em; border-radius: 10px; max-width: 700px; }
          .user { background: #d1e7dd; text-align: right; margin-left: auto; }
          .assistant { background: #e7e9eb; text-align: left; margin-right: auto; }
          .wrapper { display: flex; flex-direction: column; }
          a.link { font-size: 0.9em; color: #444; text-decoration: underline; }
        </style></head><body><h2>${title}</h2>
        <p><a class="link" href="${href}" target="_blank">${href}</a></p><div class="wrapper">`);
  
      for (const msg of messages) {
        const role = msg.dataset.messageAuthorRole;
        const text = msg.innerText.trim();
        if (!text) continue;
        const className = role === 'user' ? 'user' : 'assistant';
        output.push(`<div class="message ${className}">${text.replace(/\n/g, "<br>")}</div>`);
      }
  
      output.push("</div></body></html>");
      files.push({ name: `chat-${title}.html`, content: output.join("\n") });
  
      await sleep(extraDelay);
    }
  
    // --- BUILD HACKY ZIP ---
    const fileData = [], centralDirectory = [];
    let offset = 0;
  
    for (const { name, content } of files) {
      const filename = strToArr(name);
      const data = strToArr(content);
      const date = new Date();
      const modTime = toDOSTime(date);
      const modDate = toDOSDate(date);
  
      const local = new Uint8Array(30 + filename.length);
      const view = new DataView(local.buffer);
      view.setUint32(0, 0x04034b50, true); // local file header
      view.setUint16(4, 20, true); // version needed
      view.setUint16(6, 0, true); // flags
      view.setUint16(8, 0, true); // no compression
      view.setUint16(10, modTime, true);
      view.setUint16(12, modDate, true);
      view.setUint32(14, 0, true); // fake CRC
      view.setUint32(18, data.length, true);
      view.setUint32(22, data.length, true);
      view.setUint16(26, filename.length, true);
      view.setUint16(28, 0, true);
      local.set(filename, 30);
      fileData.push(local, data);
  
      const central = new Uint8Array(46 + filename.length);
      const cd = new DataView(central.buffer);
      cd.setUint32(0, 0x02014b50, true);
      cd.setUint16(4, 20, true);
      cd.setUint16(6, 20, true);
      cd.setUint16(8, 0, true);
      cd.setUint16(10, 0, true);
      cd.setUint16(12, modTime, true);
      cd.setUint16(14, modDate, true);
      cd.setUint32(16, 0, true);
      cd.setUint32(20, data.length, true);
      cd.setUint32(24, data.length, true);
      cd.setUint16(28, filename.length, true);
      cd.setUint16(30, 0, true);
      cd.setUint16(32, 0, true);
      cd.setUint16(34, 0, true);
      cd.setUint16(36, 0, true);
      cd.setUint32(38, 0, true);
      cd.setUint32(42, offset, true);
      central.set(filename, 46);
      centralDirectory.push(central);
  
      offset += local.length + data.length;
    }
  
    const cdSize = centralDirectory.reduce((sum, c) => sum + c.length, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(4, 0, true);
    endView.setUint16(6, 0, true);
    endView.setUint16(8, files.length, true);
    endView.setUint16(10, files.length, true);
    endView.setUint32(12, cdSize, true);
    endView.setUint32(16, offset, true);
    endView.setUint16(20, 0, true);
  
    const blob = new Blob([...fileData, ...centralDirectory, end], { type: "application/zip" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `chatgpt-export-${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
  
    console.log("✅ All chats exported and downloaded.");
  })();