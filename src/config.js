import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CONFIG_NAME = 'conf.json';
const LOCAL_CONFIG = join(process.cwd(), CONFIG_NAME);
const GLOBAL_CONFIG = join(homedir(), '.ajelcode', CONFIG_NAME);

const DEFAULT_CONFIG = {
  prefix: true,
  model: 'groq/llama3-70b-8192',
  apiKey: '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',
  temperature: 0.3,
  maxTokens: 4096,
  colors: true
};

export function loadConfig() {
  let config = { ...DEFAULT_CONFIG };
  
  if (existsSync(LOCAL_CONFIG)) {
    try {
      const local = JSON.parse(readFileSync(LOCAL_CONFIG, 'utf-8'));
      config = { ...config, ...local };
    } catch (error) {
      console.error('Error reading local config:', error.message);
    }
  }
  
  if (existsSync(GLOBAL_CONFIG)) {
    try {
      const global = JSON.parse(readFileSync(GLOBAL_CONFIG, 'utf-8'));
      config = { ...config, ...global };
    } catch (error) {
      console.error('Error reading global config:', error.message);
    }
  }
  
  return config;
}

export function saveConfig(config, global = false) {
  const targetPath = global ? GLOBAL_CONFIG : LOCAL_CONFIG;
  const dir = global ? join(homedir(), '.ajelcode') : process.cwd();
  
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  writeFileSync(targetPath, JSON.stringify(config, null, 2));
}

export function getConfigValue(key) {
  const config = loadConfig();
  return config[key];
}

export function setConfigValue(key, value, global = false) {
  const config = loadConfig();
  config[key] = value;
  saveConfig(config, global);
}

export function initConfig() {
  if (!existsSync(LOCAL_CONFIG)) {
    saveConfig(DEFAULT_CONFIG, false);
    console.log('Created local conf.json');
  }
}
