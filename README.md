```markdown
<p align="center">
  <img src="https://files.catbox.moe/0m18ey.jpg" alt="AjelCode Banner" width="800">
</p>

<h1 align="center">⚡ AjelCode</h1>

<p align="center">
  <strong>AI-Powered CLI Coding Assistant</strong><br>
  Turn natural language into code files instantly with Groq
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
- [Configuration](#-configuration)
- [Usage Examples](#-usage-examples)
- [Advanced Usage](#-advanced-usage)
- [Project Structure](#-project-structure)
- [Performance](#-performance)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🗣️ **Natural Language to Code** | Describe what you want in plain English |
| 📁 **Multi-File Generation** | Create entire project structures with one prompt |
| 📂 **Auto-Folder Creation** | Generates folders and nested files automatically |
| ⚡ **Blazing Fast** | Powered by Groq's ultra-low latency inference |
| 🔧 **Zero Config Required** | Install and start coding immediately |
| 🌍 **Global CLI** | Use from any directory on your system |
| 🎨 **Customizable** | Configure models, temperature, and more |
| 🎯 **File-Based Prompts** | Load instructions from `.txt` files |

---

## 📦 Installation

### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | v18 or higher |
| **npm** | Latest |
| **Groq API Key** | Get from [Groq Console](https://console.groq.com) |

### Install Globally

```bash
npm install -g ajelcode
```

Install from Source

```bash
git clone https://github.com/tutucucucu/ajelcode.git
cd ajelcode
npm install
npm link
```

---

🚀 Quick Start

Basic Usage

```bash
# Generate a single file
ajelcode "create hello.js with console.log('Hello World')"

# Generate multiple files
ajelcode "build a REST API with Express, create server.js and routes.js"

# Create a full project
ajelcode "make a React component with Button.jsx and styles.css"

# Read prompt from file
ajelcode -f instructions.txt
```

First Time Setup

1. Get your Groq API Key from console.groq.com
2. Create conf.json in your project root:

```json
{
  "model": "llama-3.3-70b-versatile",
  "apiKey": "your-groq-api-key-here",
  "temperature": 0.1
}
```

3. Run your first command:

```bash
ajelcode "create index.html with a landing page"
```

---

⚙️ Configuration

Config File Options

Create conf.json in your project root or ~/.ajelcode/:

```json
{
  "prefix": true,
  "model": "llama-3.3-70b-versatile",
  "apiKey": "your-groq-api-key-here",
  "temperature": 0.1,
  "maxTokens": 4096,
  "colors": true
}
```

Configuration Reference

Option Type Description Default
model string Groq model to use llama-3.3-70b-versatile
apiKey string Your Groq API key Required
temperature number Randomness (0-1) 0.1
maxTokens number Max response length 4096
colors boolean Enable colored output true
prefix boolean Enable command prefix true

Available Models

Model Speed Quality Best For
llama-3.3-70b-versatile ⚡⚡⚡ ⭐⭐⭐⭐⭐ General purpose, high quality
llama-3.2-90b-vision-preview ⚡⚡ ⭐⭐⭐⭐⭐ Complex tasks, largest model
llama-3.2-11b-vision-preview ⚡⚡⚡⚡ ⭐⭐⭐⭐ Fast, good balance
mixtral-8x7b-32768 ⚡⚡⚡ ⭐⭐⭐⭐ Long context tasks
gemma2-9b-it ⚡⚡⚡⚡ ⭐⭐⭐ Google's model, stable

---

📚 Usage Examples

Example 1: Create a JavaScript Utility

```bash
ajelcode "create math.js with add, subtract, multiply, and divide functions"
```

Output:

```
### FILE: math.js
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }
module.exports = { add, subtract, multiply, divide };
```

Example 2: Build a Full Stack Application

```bash
ajelcode "create a MERN stack app with server.js, models/User.js, routes/api.js"
```

Output:

```
### FILE: server.js
const express = require('express');
const app = express();
// ... full server code

### FOLDER: models
### FILE: models/User.js
const mongoose = require('mongoose');
// ... User schema

### FILE: routes/api.js
const router = require('express').Router();
// ... API routes
```

Example 3: Generate HTML + CSS

```bash
ajelcode "create a landing page with index.html and styles.css"
```

Example 4: Python Data Script

```bash
ajelcode "make data_analyzer.py that reads CSV and plots graphs"
```

Example 5: Multi-File React Component

```bash
ajelcode "create React component Button.jsx with Button.css and index.js"
```

---

🎯 Advanced Usage

Custom Models

```bash
# Use a specific model
ajelcode -m mixtral-8x7b-32768 "create a sorting algorithm"

# Override via command line
ajelcode -m llama-3.2-11b-vision-preview "build a weather app"
```

Prompt from File

```bash
# Write instructions in a file
echo "Create a full-stack MERN application" > instructions.txt
ajelcode -f instructions.txt
```

Global vs Local Config

AjelCode loads config in this order:

Priority Location Description
1️⃣ ./conf.json Project-specific configuration
2️⃣ ~/.ajelcode/conf.json Global configuration
3️⃣ Default settings Built-in fallback values

Command Line Options

Option Description Example
-f, --file <path> Read prompt from file ajelcode -f prompt.txt
-m, --model <model> Set AI model ajelcode -m gemma2-9b-it "test"
--no-color Disable colored output ajelcode --no-color "test"
-h, --help Show help ajelcode -h
-V, --version Show version ajelcode -V

---

📁 Project Structure

```
ajelcode/
├── 📁 bin/
│   └── 📄 ajelcode.js        # Entry point
├── 📁 src/
│   ├── 📄 cli.js             # CLI handler
│   ├── 📄 ai.js              # Groq integration
│   ├── 📄 files.js           # File operations
│   └── 📄 config.js          # Config loader
├── 📄 conf.json              # Configuration
├── 📄 package.json
├── 📄 README.md
└── 📄 LICENSE
```

---

📊 Performance Comparison

Model Speed Quality Latency Use Case
llama-3.3-70b ⚡⚡⚡ ⭐⭐⭐⭐⭐ ~500ms Production code
llama-3.2-11b ⚡⚡⚡⚡ ⭐⭐⭐⭐ ~200ms Fast prototyping
mixtral-8x7b ⚡⚡⚡ ⭐⭐⭐⭐ ~400ms Long documents
gemma2-9b ⚡⚡⚡⚡ ⭐⭐⭐ ~150ms Simple tasks

---

🐛 Troubleshooting

Common Issues

Issue Solution
"Invalid API Key" Regenerate your key at Groq Console and update conf.json
"Model decommissioned" Check available models and update conf.json
"Command not found" Reinstall globally: npm uninstall -g ajelcode && npm install -g ajelcode
"Permission denied" Fix permissions: chmod +x bin/ajelcode.js && npm link
"No such file" Ensure you're in the correct directory with conf.json

Debug Mode

```bash
# Run with verbose output
node bin/ajelcode.js "test" --debug

# Check config loading
node -e "import('./src/config.js').then(m => console.log(m.loadConfig()))"
```

---

🤝 Contributing

Step Action
1️⃣ Fork the repository
2️⃣ Create your feature branch: git checkout -b feature/AmazingFeature
3️⃣ Commit your changes: git commit -m 'Add some AmazingFeature'
4️⃣ Push to the branch: git push origin feature/AmazingFeature
5️⃣ Open a Pull Request

Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/ajelcode.git
cd ajelcode

# Install dependencies
npm install

# Link globally for testing
npm link

# Run tests
ajelcode "test"
```

---

📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

```
MIT License

Copyright (c) 2026 Ajel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

🙏 Acknowledgments

Tool/Library Purpose
Groq Incredibly fast inference
OpenAI SDK API client
Commander.js CLI parsing
Chalk Terminal colors

---

📞 Support & Community

· 🐛 Report issues: GitHub Issues
· ⭐ Star the repo: Show your support
· 🔔 Follow for updates: Stay tuned for new features

---

<div align="center">

Made with ❤️ for developers who want to code faster

```bash
ajelcode "make something amazing"
```

Happy Coding! 🚀

</div>
```
