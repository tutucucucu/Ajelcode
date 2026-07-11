import Groq from 'groq-sdk';
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

  const client = new Groq({
    apiKey: apiKey
  });

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

  try {
    // Load session history if available
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

    const response = await client.chat.completions.create({
      model: model,
      messages: messages,
      temperature: parseFloat(config.temperature) || 0.1,
      max_tokens: parseInt(config.maxTokens) || 4096,
    });

    const content = response.choices[0].message.content;

    // Save to session
    if (options.useSession !== false) {
      saveToSession(prompt, content);
    }

    return content;
  } catch (error) {
    throw new Error('AI Error: ' + error.message);
  }
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
    
    // Keep last 50 messages to avoid overflow
    if (session.messages.length > 50) {
      session.messages = session.messages.slice(-50);
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
