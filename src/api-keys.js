import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

const API_BASE = 'https://api-keys.catpuffcake.workers.dev';
const SECRET = 'Ajajelimups';

export async function manageAPIKeys() {
  console.clear();
  console.log(chalk.cyan('=== API Key Management ===\n'));

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan('What would you like to do?'),
      choices: [
        { name: 'Generate New API Key', value: 'generate' },
        { name: 'Check API Key', value: 'check' },
        { name: 'Delete API Key', value: 'delete' },
        { name: 'Get Browser Token', value: 'browser' },
        { name: 'Back', value: 'back' }
      ]
    }
  ]);

  switch (action) {
    case 'generate':
      await generateAPIKey();
      break;
    case 'check':
      await checkAPIKey();
      break;
    case 'delete':
      await deleteAPIKey();
      break;
    case 'browser':
      await getBrowserToken();
      break;
    case 'back':
      return;
  }

  // Kembali ke menu setelah aksi selesai
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
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: chalk.green('Enter API key name:'),
      default: 'My API Key'
    }
  ]);

  const spinner = ora('Generating API key...').start();
  try {
    const response = await fetch(`${API_BASE}/api/apikeys/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SECRET': SECRET
      },
      body: JSON.stringify({ name })
    });

    const data = await response.json();
    spinner.succeed('API Key Generated!');
    console.log(chalk.green('\nYour API Key:'));
    console.log(chalk.cyan.bold(data.apiKey));
    console.log(chalk.gray('\nSave this key securely. It will not be shown again.'));

    // Tanya apakah mau simpan ke config
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
      saveConfig(config);
      console.log(chalk.green('API key saved to conf.json'));
    }

  } catch (error) {
    spinner.fail('Error: ' + error.message);
    console.log(chalk.red('Make sure the API server is accessible.'));
  }
}

async function checkAPIKey() {
  const { apiKey, browserToken } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: chalk.green('Enter API key:'),
      mask: '*'
    },
    {
      type: 'password',
      name: 'browserToken',
      message: chalk.green('Enter browser token (optional):'),
      mask: '*',
      default: ''
    }
  ]);

  const spinner = ora('Checking API key...').start();
  try {
    const payload = { apiKey };
    if (browserToken) {
      payload.browserToken = browserToken;
    }

    const response = await fetch(`${API_BASE}/api/apikeys/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
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
    console.log(chalk.red('Could not connect to API server.'));
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
      body: JSON.stringify({ apiKey })
    });

    const data = await response.json();
    
    if (data.success) {
      spinner.succeed('API Key Deleted!');
    } else {
      spinner.fail('Failed to delete API key');
    }

  } catch (error) {
    spinner.fail('Error: ' + error.message);
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
    } else {
      spinner.fail('Failed to get browser token');
    }

  } catch (error) {
    spinner.fail('Error: ' + error.message);
    console.log(chalk.red('Could not connect to API server.'));
  }
}
