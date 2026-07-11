```markdown
# 🚀 AjelCode - AI-Powered Coding Assistant

**AjelCode** is a CLI tool that generates code files from natural language prompts using Groq's high-speed AI models. Just describe what you want, and AjelCode creates the files for you.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/ajelcode)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Groq](https://img.shields.io/badge/powered%20by-Groq-orange.svg)](https://groq.com)

---

## ✨ Features

- **Natural Language to Code** - Describe what you want in plain English
- **Multi-File Generation** - Create entire project structures with one prompt
- **Auto-Folder Creation** - Generates folders and nested files automatically
- **Lightning Fast** - Powered by Groq's ultra-low latency inference
- **Zero Config Required** - Just install and start coding
- **Global CLI** - Use from any directory
- **Customizable** - Configure models, temperature, and more

---

## 📦 Installation

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Install Globally

```bash
npm install -g ajelcode
```

Install from Source

```bash
git clone https://github.com/yourusername/ajelcode.git
cd ajelcode
npm install
npm link
```

Get Your API Key

1. Sign up at Groq Console
2. Generate an API key
3. Create conf.json (see configuration below)

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

Examples

```bash
# Create an HTML page
ajelcode "create index.html with a beautiful landing page"

# Build a Node.js module
ajelcode "create math.js with add, subtract, multiply, and divide functions"

# Generate a Python script
ajelcode "make data_analyzer.py that reads CSV and plots graphs"

# Create multiple files at once
ajelcode "create server.js, routes.js, and models.js for an Express API"
```

---

⚙️ Configuration

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

Config Options

Option Description Default
model Groq model to use llama-3.3-70b-versatile
apiKey Your Groq API key Required
temperature Randomness (0-1) 0.1
maxTokens Max response length 4096
colors Enable colored output true
prefix Enable command prefix true

Available Models

Model Best For
llama-3.3-70b-versatile General purpose, high quality
llama-3.2-90b-vision-preview Complex tasks, largest model
llama-3.2-11b-vision-preview Fast, good balance
mixtral-8x7b-32768 Long context tasks
gemma2-9b-it Google's model, stable

---

📁 Project Structure

```
ajelcode/
├── bin/
│   └── ajelcode.js        # Entry point
├── src/
│   ├── cli.js             # CLI handler
│   ├── ai.js              # Groq integration
│   ├── files.js           # File operations
│   └── config.js          # Config loader
├── conf.json              # Configuration
├── package.json
└── README.md
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

1. ./conf.json (project-specific)
2. ~/.ajelcode/conf.json (global)
3. Default settings

---

🛠️ Development

Run in Development Mode

```bash
# Without global install
node bin/ajelcode.js "your prompt"

# With auto-reload (using nodemon)
nodemon bin/ajelcode.js "your prompt"
```

Build and Test

```bash
# Install dependencies
npm install

# Link globally
npm link

# Test
ajelcode "test"

# Unlink
npm unlink -g ajelcode
```

---

📊 Performance

Model Speed Quality Use Case
llama-3.3-70b ⚡⚡⚡ ⭐⭐⭐⭐⭐ Production code
llama-3.2-11b ⚡⚡⚡⚡ ⭐⭐⭐⭐ Fast prototyping
mixtral-8x7b ⚡⚡⚡ ⭐⭐⭐⭐ Long documents
gemma2-9b ⚡⚡⚡⚡ ⭐⭐⭐ Simple tasks

---

🐛 Troubleshooting

"Invalid API Key"

```bash
# Regenerate your key at Groq Console
# Update conf.json or ~/.ajelcode/conf.json
```

"Model decommissioned"

```bash
# Check available models: https://console.groq.com/docs/models
# Update the model field in conf.json
```

Command not found

```bash
# Reinstall globally
npm uninstall -g ajelcode
npm install -g ajelcode

# Or check PATH
echo $PATH
```

Permission denied

```bash
# Fix permissions
chmod +x bin/ajelcode.js
npm link
```

---

🤝 Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

---

📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

🙏 Acknowledgments

· Groq for their incredibly fast inference
· OpenAI SDK for the client
· Commander.js for CLI parsing
· Chalk for beautiful terminal colors

---

📞 Support

· Create an Issue
· Star ⭐ the repository
· Follow for updates

---

Made with ❤️ for developers who want to code faster

```bash
ajelcode "make something amazing"
```

```

---

## Udah siap upload ke GitHub. Jangan lupa:

### 1. Bikin repo di GitHub
```bash
git init
git add .
git commit -m "Initial commit: AjelCode v1.0.0"
git remote add origin https://github.com/username/ajelcode.git
git push -u origin main
```

2. Tambahin LICENSE

```bash
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2026 Ajel

Permission is hereby granted, free of charge, to any person obtaining a copy...
EOF
```

3. .gitignore

```bash
cat > .gitignore << 'EOF'
node_modules/
*.log
.env
.DS_Store
dist/
*.tmp
EOF
```
