<p align="center">
  <img src="https://files.catbox.moe/0m18ey.jpg" alt="AjelCode Banner" width="800">
</p>

<h1 align="center">⚡ AjelCode</h1>

<p align="center">
  <strong>AI-Powered CLI Coding Assistant</strong><br>
  Turn natural language into code files instantly with Groq — now with sessions, API key management, and an interactive menu
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge" alt="Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg?style=for-the-badge" alt="Node.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/powered%20by-Groq-orange.svg?style=for-the-badge" alt="Groq"></a>
</p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Commands](#-commands)
- [Configuration](#-configuration)
- [API Key Management](#-api-key-management)
- [Available Models](#-available-models)
- [Usage Examples](#-usage-examples)
- [Project Structure](#-project-structure)
- [Session Management](#-session-management)
- [Troubleshooting](#-troubleshooting)
- [Publishing](#-publishing)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖥️ **Interactive Menu** | Full TUI with arrow-key navigation |
| 💬 **Session Management** | Chat history saved automatically |
| 🔑 **API Key Manager** | Generate, check, and delete API keys |
| 🗣️ **Natural Language to Code** | Describe what you want in plain English |
| 📁 **Multi-File Generation** | Create entire project structures with one prompt |
| ⚡ **Blazing Fast** | Powered by Groq's ultra-low latency inference |
| 🌍 **Global CLI** | Use from any directory on your system |
| 🎨 **Customizable** | Configure models, temperature, and more |

---

## 📦 Installation

```bash
npm install -g ajelcode
```

### Install from Source

```bash
git clone https://github.com/tutucucucu/ajelcode.git
cd ajelcode
npm install
npm link
```

---

## 🚀 Quick Start

```bash
# Start interactive session (recommended)
ajelcode start

# Generate code from prompt
ajelcode "create hello.js with console.log('Hello World')"

# Chat with AI
ajelcode chat "how to sort array in javascript"

# Generate from file
ajelcode -f instructions.txt
```

---

## 🎛️ Commands

| Command | Description |
|---------|--------------|
| `ajelcode start` | Start interactive session with menu |
| `ajelcode chat "prompt"` | Chat with AI (session saved) |
| `ajelcode "prompt"` | Generate code directly |
| `ajelcode -f file.txt` | Read prompt from file |
| `ajelcode session -l` | List all sessions |
| `ajelcode session -c` | Clear current session |
| `ajelcode session -s` | Show current session |
| `ajelcode config -l` | Show configuration |
| `ajelcode config -s key value` | Set config value |
| `ajelcode api` | Manage API keys |

---

## ⚙️ Configuration

Create `conf.json` in your project root or `~/.ajelcode/`:

```json
{
  "model": "llama-3.3-70b-versatile",
  "apiKey": "your-groq-api-key",
  "temperature": 0.1,
  "maxTokens": 4096,
  "colors": true
}
```

### Config Priority

| Priority | Location | Description |
|----------|----------|--------------|
| 1️⃣ | `./conf.json` | Project-specific configuration |
| 2️⃣ | `~/.ajelcode/conf.json` | Global configuration |
| 3️⃣ | Default settings | Built-in fallback values |

---

## 🔑 API Key Management

```bash
ajelcode api
```

Menu options:

- Generate New API Key
- Check API Key
- Delete API Key
- Get Browser Token

### Manual API Key Generation

```bash
curl -X POST https://api-keys.catpuffcake.workers.dev/api/apikeys/new \
  -H "Content-Type: application/json" \
  -H "X-SECRET: Ajajelimups" \
  -d '{"name":"My API Key"}'
```

Response:

```json
{
  "success": true,
  "apiKey": "ajel_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

---

## 🧠 Available Models

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| `llama-3.3-70b-versatile` | Medium | Best | Production code |
| `llama-3.2-90b-vision-preview` | Slow | Best | Complex tasks |
| `llama-3.2-11b-vision-preview` | Fast | Good | Prototyping |
| `mixtral-8x7b-32768` | Medium | Good | Long context |
| `gemma2-9b-it` | Fast | Medium | Simple tasks |

---

## 📚 Usage Examples

### Generate a JavaScript Module

```bash
ajelcode "create math.js with add, subtract, multiply, divide functions"
```

### Build a Full Stack App

```bash
ajelcode "create Express API with server.js, routes/api.js, models/User.js"
```

### Create a React Component

```bash
ajelcode "make Button.jsx with Button.css and index.js"
```

### Generate a Python Script

```bash
ajelcode "create data_analyzer.py that reads CSV and plots graphs"
```

---

## 📁 Project Structure

```
ajelcode/
├── bin/
│   └── ajelcode.js        # Entry point
├── src/
│   ├── cli.js             # CLI handler with menu
│   ├── ai.js              # Groq integration + session
│   ├── files.js           # File operations
│   ├── config.js          # Config loader
│   └── api-keys.js        # API key management
├── conf.json              # Configuration
├── package.json
└── README.md
```

---

## 💾 Session Management

Sessions are stored in `.ajelcode_session.json` in the current directory.

- Chat history preserved across commands
- Last 50 messages kept
- Sessions persist until cleared

### Session Commands

```bash
# View current session
ajelcode session -s

# List all sessions
ajelcode session -l

# Clear session
ajelcode session -c
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Invalid API Key | Run `ajelcode api` to generate/check key |
| Model not found | Update config with an available model |
| Command not found | Reinstall: `npm install -g ajelcode` |
| Session not saving | Check write permissions in current directory |

---

## 🚢 Publishing

```bash
# Login pake username npm lo
npm login
# Username: azazelmahgituu
# Password: password npm lo
# Email: email terdaftar

# Publish
npm publish --access=public
```

Setelah publish, package bisa diinstall:

```bash
npm install -g ajelcode
```

---

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**azazelmahgituu**

- GitHub: [github.com/tutucucucu](https://github.com/tutucucucu)
- npm: [ajelcode](https://www.npmjs.com/package/ajelcode)

---

<div align="center">

Made with ❤️ for developers who want to code faster

```bash
ajelcode "make something amazing"
```

Happy Coding! 🚀

</div>
