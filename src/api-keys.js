import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

const API_BASE = 'https://api.catpuffcake.workers.dev';
const SECRET = 'Ajajelimups';

// Cooldown tracking
let lastGenerateTime = 0;
const COOLDOWN_SECONDS = 30;

export async function manageAPIKeys() {
  console.clear();
  console.log(chalk.cyan('=== API Key Management ===\n'));

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan('What would you like to do?'),
      choices: [
        { name: 'Get Browser Token', value: 'browser' },
        { name: 'Generate API Key (30s cooldown)', value: 'generate' },
        { name: 'Check API Key', value: 'check' },
        { name: 'Delete API Key', value: 'delete' },
        { name: 'Back', value: 'back' }
      ]
    }
  ]);

  switch (action) {
    case 'browser':
      await getBrowserToken();
      break;
    case 'generate':
      await generateAPIKey();
      break;
    case 'check':
      await checkAPIKey();
      break;
    case 'delete':
      await deleteAPIKey();
      break;
    case 'back':
      return;
  }

  const { again } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'again',
      message: chalk.green('Back to API menu?'),
      default: true
    }
  ]);

  if (again) {
    await manageAPIKeys();
  }
}

async function generateAPIKey() {
  // Check cooldown
  const now = Date.now();
  const elapsed = (now - lastGenerateTime) / 1000;
  
  if (elapsed < COOLDOWN_SECONDS) {
    const remaining = Math.ceil(COOLDOWN_SECONDS - elapsed);
    console.log(chalk.yellow(`\n⏳ Please wait ${remaining} seconds before generating another key.\n`));
    return;
  }

  // Get browser token first
  let browserToken = await getBrowserTokenFromConfig();
  
  if (!browserToken) {
    console.log(chalk.yellow('\nNo browser token found. Getting one...\n'));
    const result = await getBrowserToken();
    if (!result) {
      console.log(chalk.red('Failed to get browser token.'));
      return;
    }
    browserToken = result;
  }

  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: chalk.green('Enter API key name:'),
      default: 'AjelCode Key'
    }
  ]);

  const spinner = ora('Generating API key...').start();
  try {
    const response = await fetch(`${API_BASE}/api/apikeys/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SECRET': SECRET,
        'Cookie': `browser_token=${browserToken}`
      },
      body: JSON.stringify({ name })
    });

    const data = await response.json();
    
    if (data.success) {
      spinner.succeed('API Key Generated!');
      console.log(chalk.green('\nYour API Key:'));
      console.log(chalk.cyan.bold(data.apiKey));
      console.log(chalk.gray('\nSave this key securely. It will not be shown again.'));
      
      // Update cooldown
      lastGenerateTime = Date.now();
      console.log(chalk.yellow(`\n⏳ Next generation available in ${COOLDOWN_SECONDS} seconds.`));

      const { save } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'save',
          message: chalk.green('Save this API key to config?'),
          default: true
        }
      ]);

      if (save) {
        const { loadConfig, saveConfig } = await import('./config.js');
        const config = loadConfig();
        config.apiKey = data.apiKey;
        config.browserToken = browserToken;
        saveConfig(config);
        console.log(chalk.green('API key saved to conf.json'));
      }
    } else {
      spinner.fail('Failed: ' + (data.message || 'Unknown error'));
    }

  } catch (error) {
    spinner.fail('Error: ' + error.message);
  }
}

async function getBrowserTokenFromConfig() {
  try {
    const { loadConfig } = await import('./config.js');
    const config = loadConfig();
    return config.browserToken || null;
  } catch {
    return null;
  }
}

async function getBrowserToken() {
  const spinner = ora('Getting browser token...').start();
  try {
    const response = await fetch(`${API_BASE}/api/browser`);
    const data = await response.json();
    
    if (data.success) {
      spinner.succeed('Browser Token Retrieved!');
      console.log(chalk.green('\nYour Browser Token:'));
      console.log(chalk.cyan.bold(data.browserToken));
      console.log(chalk.gray('\nThis token is required for API key validation.'));
      
      // Save to config
      const { loadConfig, saveConfig } = await import('./config.js');
      const config = loadConfig();
      config.browserToken = data.browserToken;
      saveConfig(config);
      console.log(chalk.green('Browser token saved to conf.json'));
      
      return data.browserToken;
    } else {
      spinner.fail('Failed to get browser token');
      return null;
    }

  } catch (error) {
    spinner.fail('Error: ' + error.message);
    return null;
  }
}

async function checkAPIKey() {
  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: chalk.green('Enter API key:'),
      mask: '*'
    }
  ]);

  // Get browser token
  let browserToken = await getBrowserTokenFromConfig();
  if (!browserToken) {
    console.log(chalk.yellow('\nNo browser token found. Getting one...\n'));
    browserToken = await getBrowserToken();
    if (!browserToken) {
      console.log(chalk.red('Failed to get browser token.'));
      return;
    }
  }

  const spinner = ora('Checking API key...').start();
  try {
    const response = await fetch(`${API_BASE}/api/apikeys/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        apiKey, 
        browserToken 
      })
    });

    const data = await response.json();
    
    if (data.success && data.valid) {
      spinner.succeed('API Key Valid!');
      console.log(chalk.green('\nKey Details:'));
      console.log(chalk.white(`Name: ${data.name || 'N/A'}`));
      console.log(chalk.white(`Created: ${data.createdAt || 'N/A'}`));
    } else {
      spinner.fail('API Key Invalid!');
      console.log(chalk.red('The API key is not valid or has expired.'));
    }

  } catch (error) {
    spinner.fail('Error: ' + error.message);
  }
}

async function deleteAPIKey() {
  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: chalk.green('Enter API key to delete:'),
      mask: '*'
    }
  ]);

  // Get browser token
  let browserToken = await getBrowserTokenFromConfig();
  if (!browserToken) {
    console.log(chalk.yellow('\nNo browser token found. Getting one...\n'));
    browserToken = await getBrowserToken();
    if (!browserToken) {
      console.log(chalk.red('Failed to get browser token.'));
      return;
    }
  }

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.red('Are you sure you want to delete this API key?'),
      default: false
    }
  ]);

  if (!confirm) {
    console.log(chalk.yellow('Cancelled.'));
    return;
  }

  const spinner = ora('Deleting API key...').start();
  try {
    const response = await fetch(`${API_BASE}/api/apikeys/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SECRET': SECRET
      },
      body: JSON.stringify({ 
        apiKey, 
        browserToken 
      })
    });

    const data = await response.json();
    
    if (data.success) {
      spinner.succeed('API Key Deleted!');
      // Remove from config if exists
      const { loadConfig, saveConfig } = await import('./config.js');
      const config = loadConfig();
      if (config.apiKey === apiKey) {
        config.apiKey = null;
        saveConfig(config);
        console.log(chalk.green('API key removed from config.'));
      }
    } else {
      spinner.fail('Failed to delete API key: ' + (data.message || 'Unknown error'));
    }

  } catch (error) {
    spinner.fail('Error: ' + error.message);
  }
  }
