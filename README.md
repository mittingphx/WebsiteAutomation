# WebsiteAutomation

Browser console scripts to automate repetitive web tasks.

## 🚀 Quick Start

1. Right-click on the target webpage
2. Select "Inspect" to open DevTools
3. Click the "Console" tab
4. Copy and paste the desired script
5. Watch the console for progress updates

## 📁 Folder Structure

Scripts are organized in the `scripts/` folder by domain. Each domain folder contains scripts specific to that website. Subdomains are only specified when a script is designed to work exclusively with that subdomain (e.g., `chat.openai.com` vs `openai.com`).

## 📚 Available Scripts

### 🛍️ Amazon.com: E-commerce platform
| Script | Purpose |
|--------|---------|
| [AmazonClearSavedForLater.js](./scripts/amazon.com/AmazonClearSavedForLater.js) | Bulk delete "Saved for Later" items |

### 🤖 chatgpt.com: Large Language Model platform by OpenAI
| Script | Purpose |
|--------|---------|
| [ChatGPT-ExportAllChats.js](./scripts/chatgpt.com/ChatGPT-ExportAllChats.js) | Export all chats as ZIP archive |
| [ChatGPT-ExportSingleChat.js](./scripts/chatgpt.com/ChatGPT-ExportSingleChat.js) | Export current chat as HTML |

### 🎥 youtube.com: Video sharing platform
| Script | Purpose |
|--------|---------|
| [YouTubeGetTranscripts.js](./scripts/youtube.com/YouTubeGetTranscripts.js) | Extract video transcript |

## ⚙️ Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Access to browser developer tools

## 🔒 Security Guidelines

- Only run scripts from trusted sources
- Review code before execution
- Scripts have full webpage access
- Website ToS may prohibit automation
- Actions may be irreversible
- Website updates may break scripts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

[MIT License](LICENSE) - Feel free to use and modify the code

## ⚠️ Disclaimer

These scripts are provided "as is" without warranty. Use at your own risk.
