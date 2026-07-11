import Groq from 'groq-sdk';
import { loadConfig } from './config.js';

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

  const model = options.model || config.model || 'llama-3.1-70b-versatile';

  try {
    const response = await client.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 4096,
    });

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error('AI Error: ' + error.message);
  }
}
