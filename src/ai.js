import axios from 'axios';
import { loadConfig } from './config.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SESSION_FILE = join(process.cwd(), '.ajelcode_session.json');

export async function askAI(prompt, options = {}) {
  const config = loadConfig();
  const apiKey = options.apiKey || config.apiKey || process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key not found. Set in conf.json or GROQ_API_KEY env');
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

  const model = options.model || config.model || 'llama-3.3-70b-versatile';

  let messages = [
    { role: 'system', content: systemPrompt }
  ];

  if (options.useSession !== false) {
    const session = getSession();
    if (session && session.length > 0) {
      messages = messages.concat(session);
    }
  }

  messages.push({ role: 'user', content: prompt });

  // Batasi history agar request tidak terlalu besar
  if (messages.length > 21) {
    messages = [messages[0], ...messages.slice(-20)];
  }

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Attempt ${attempt}...`);
      
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: model,
          messages: messages,
          temperature: Number(config.temperature ?? 0.1),
          max_tokens: Number(config.maxTokens ?? 4096)
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      const content = response.data.choices?.[0]?.message?.content ?? '';

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
    
    // Simpan maksimal 10 percakapan (20 pesan)
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
