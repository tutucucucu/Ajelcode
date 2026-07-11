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
  } catch (error) {
    spinner.fail('Error: ' + error.message);
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
      mask: '*'
    }
  ]);

  const spinner = ora('Checking API key...').start();
  try {
    const response = await fetch(`${API_BASE}/api/apikeys/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apiKey, browserToken })
    });

    const data = await response.json();
    spinner.succeed('API Key Valid!');
    console.log(chalk.green('\nKey Details:'));
    console.log(chalk.white(`Name: ${data.name}`));
    console.log(chalk.white(`Created: ${data.createdAt}`));
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

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.red('Are you sure you want to delete this API key?')
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
    spinner.succeed('API Key Deleted!');
  } catch (error) {
    spinner.fail('Error: ' + error.message);
  }
}

async function getBrowserToken() {
  const spinner = ora('Getting browser token...').start();
  try {
    const response = await fetch(`${API_BASE}/api/browser`);
    const data = await response.json();
    spinner.succeed('Browser Token Retrieved!');
    console.log(chalk.green('\nYour Browser Token:'));
    console.log(chalk.cyan.bold(data.browserToken));
  } catch (error) {
    spinner.fail('Error: ' + error.message);
  }
      }
