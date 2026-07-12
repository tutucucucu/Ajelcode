import axios from 'axios';
import { loadConfig } from './config.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SESSION_FILE = join(process.cwd(), '.ajelcode_session.json');

export async function askAI(prompt, options = {}) {
  const config = loadConfig();
  const apiKey = options.apiKey || config.apiKey || process.env.AJEL_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key not found. Generate with: ajelcode api');
  }

  // Get browser token from config
  const browserToken = config.browserToken || process.env.AJEL_BROWSER_TOKEN;
  
  if (!browserToken) {
    throw new Error('Browser token not found. Run: ajelcode api -> Get Browser Token');
  }

  const systemPrompt = `You are AjelCode, an AI coding assistant. Your ONLY job is to generate code files.

CRITICAL OUTPUT FORMAT - YOU MUST FOLLOW EXACTLY:
For each file you create, use this EXACT format:
### FILE: path/filename.ext
[the complete code content here]

For folders:
### FOLDER: path/folder_name

RULES:
- Start EVERY response with ### FILE:
- Include the FULL path for every file
- Put the COMPLETE code between ### FILE: and the next marker
- If multiple files, repeat the ### FILE: format
- NO explanations, NO markdown, NO backticks, NO extra text
- Just the ### FILE: markers and code

EXAMPLE OUTPUT:
### FILE: hello.js
console.log('Hello Ajel');

### FILE: index.html
<!DOCTYPE html>
<html>...</html>

### FOLDER: src/utils

Now generate code for the user's request.`;

  // Build messages with session
  let messages = [];

  if (options.useSession !== false) {
    const session = getSession();
    if (session && session.length > 0) {
      // Add system prompt as first message if session exists
      messages = [
        { role: 'system', content: systemPrompt },
        ...session
      ];
    } else {
      messages = [
        { role: 'system', content: systemPrompt }
      ];
    }
  } else {
    messages = [
      { role: 'system', content: systemPrompt }
    ];
  }

  messages.push({ role: 'user', content: prompt });

  // Batasi history
  if (messages.length > 21) {
    messages = [messages[0], ...messages.slice(-20)];
  }

  // Custom prompt untuk API
  const customPrompt = `You are an AI language model named AjelCode, designed to generate code files. Always respond with code only using the ### FILE: format. Never use markdown backticks or explanations.`;

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Attempt ${attempt}...`);
      
      const response = await axios.post(
        'https://api.catpuffcake.workers.dev/chat',
        {
          message: prompt,
          prompt: customPrompt,
          messages: messages // Kirim history juga
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API': apiKey,
            'X-BROWSER': browserToken
          },
          timeout: 60000
        }
      );

      // Ambil response dari data
      let content = '';
      
      if (response.data.success && response.data.data) {
        // Response dari ChatEverywhere via worker
        const data = response.data.data;
        if (data.choices && data.choices[0] && data.choices[0].message) {
          content = data.choices[0].message.content;
        } else if (data.response) {
          content = data.response;
        } else if (typeof data === 'string') {
          content = data;
        } else {
          content = JSON.stringify(data);
        }
      } else if (response.data.response) {
        content = response.data.response;
      } else if (response.data.message) {
        content = response.data.message;
      } else {
        content = JSON.stringify(response.data);
      }

      if (options.useSession !== false && content) {
        saveToSession(prompt, content);
      }

      return content;
    } catch (err) {
      lastError = err;
      console.log(`Attempt ${attempt} failed:`, err.message);
      
      if (err.response) {
        console.log('Status:', err.response.status);
        console.log('Data:', JSON.stringify(err.response.data, null, 2));
      }
      
      if (attempt < 3) {
        console.log(`Retrying in ${attempt * 2} seconds...`);
        await new Promise(r => setTimeout(r, 2000 * attempt));
      }
    }
  }

  throw lastError || new Error('All attempts failed');
}

export function getSession() {
  try {
    if (existsSync(SESSION_FILE)) {
      const data = JSON.parse(readFileSync(SESSION_FILE, 'utf-8'));
      return data.messages || [];
    }
  } catch (error) {
    console.error('Error reading session:', error.message);
  }
  return [];
}

export function saveToSession(prompt, response) {
  try {
    let session = { messages: [] };
    if (existsSync(SESSION_FILE)) {
      session = JSON.parse(readFileSync(SESSION_FILE, 'utf-8'));
    }
    
    session.messages.push(
      { role: 'user', content: prompt },
      { role: 'assistant', content: response }
    );
    
    if (session.messages.length > 20) {
      session.messages = session.messages.slice(-20);
    }
    
    session.timestamp = new Date().toISOString();
    writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
  } catch (error) {
    console.error('Error saving session:', error.message);
  }
}

export function clearSession() {
  try {
    if (existsSync(SESSION_FILE)) {
      writeFileSync(SESSION_FILE, JSON.stringify({ messages: [], timestamp: new Date().toISOString() }, null, 2));
    }
  } catch (error) {
    console.error('Error clearing session:', error.message);
  }
}

export function setSession(messages) {
  try {
    writeFileSync(SESSION_FILE, JSON.stringify({ messages, timestamp: new Date().toISOString() }, null, 2));
  } catch (error) {
    console.error('Error setting session:', error.message);
  }
}
