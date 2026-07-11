#!/usr/bin/env node
import chalk from 'chalk';
import figlet from 'figlet';
import { program } from 'commander';
import { askAI, setSession, getSession, clearSession } from './ai.js';
import { handleFileOperation } from './files.js';
import { loadConfig, initConfig, saveConfig } from './config.js';
import { manageAPIKeys } from './api-keys.js';
import inquirer from 'inquirer';
import ora from 'ora';

initConfig();
const config = loadConfig();

// ASCII Banner
console.log(chalk.cyan(figlet.textSync('AjelCode', { font: 'Standard' })));

// Whale Song Animation
const whaleSong = `
  ~♪~  ♪~♪  ~♪~  ♪~♪
   \\\\  /  \\\\  /  \\\\  /
    \\\\/    \\\\/    \\\\/
`;

console.log(chalk.blue(whaleSong));
console.log(chalk.magenta('🐋 "Sing with the whale, code with the AI!"'));

program
  .name('ajelcode')
  .description('AI Coding Assistant with Session Management')
  .version('1.0.0');

// Main Interactive Menu
program
  .command('start')
  .description('Start interactive session')
  .action(async () => {
    await interactiveMenu();
  });

// Chat Command
program
  .command('chat [prompt]')
  .description('Chat with AI')
  .option('-m, --model <model>', 'Set AI model')
  .option('--no-session', 'Don\'t use session')
  .action(async (prompt, options) => {
    if (!prompt) {
      console.log(chalk.yellow('Usage: ajelcode chat "your prompt"'));
      return;
    }

    const spinner = ora('Processing...').start();
    try {
      const response = await askAI(prompt, {
        model: options.model || config.model,
        useSession: !options.noSession
      });

      spinner.succeed('Done!');
      
      await handleFileOperation(response);
      
      console.log(chalk.green('\nDone.\n'));
    } catch (error) {
      spinner.fail('Error: ' + error.message);
      if (error.stack) {
        console.error(chalk.gray(error.stack));
      }
    }
  });

// Session Management
program
  .command('session')
  .description('Manage chat sessions')
  .option('-l, --list', 'List all sessions')
  .option('-c, --clear', 'Clear current session')
  .option('-s, --show', 'Show current session')
  .action(async (options) => {
    if (options.clear) {
      clearSession();
      console.log(chalk.green('Session cleared'));
      return;
    }

    if (options.list) {
      const sessions = getSession();
      console.log(chalk.cyan('\nSessions:\n'));
      if (sessions && sessions.length > 0) {
        sessions.forEach((s, i) => {
          console.log(chalk.white(`${i + 1}. ${s.timestamp || 'No timestamp'}`));
          console.log(chalk.gray(`   ${s.prompt ? s.prompt.substring(0, 50) : 'No prompt'}...`));
        });
      } else {
        console.log(chalk.yellow('No sessions found'));
      }
      return;
    }

    const session = getSession();
    if (session && session.length > 0) {
      console.log(chalk.cyan('\nCurrent Session:\n'));
      session.forEach((s, i) => {
        const role = s.role === 'user' ? chalk.green('User:') : chalk.blue('AI:');
        console.log(`${role} ${chalk.gray(s.content ? s.content.substring(0, 150) + '...' : 'Empty')}`);
      });
    } else {
      console.log(chalk.yellow('No active session'));
    }
  });

// Config Management
program
  .command('config')
  .description('Manage configuration')
  .option('-s, --set <key> <value>', 'Set config value')
  .option('-g, --get <key>', 'Get config value')
  .option('-l, --list', 'List all config')
  .action(async (options) => {
    if (options.set) {
      const [key, ...valueParts] = options.set.split(' ');
      const value = valueParts.join(' ');
      config[key] = value;
      saveConfig(config);
      console.log(chalk.green(`Config ${key} set to: ${value}`));
      return;
    }

    if (options.get) {
      console.log(chalk.cyan(`${options.get}:`), config[options.get] || 'Not set');
      return;
    }

    if (options.list) {
      console.log(chalk.cyan('\nConfiguration:\n'));
      Object.entries(config).forEach(([key, value]) => {
        const displayValue = key === 'apiKey' ? '********' : (value || 'Not set');
        console.log(chalk.white(`${key}:`), chalk.gray(displayValue));
      });
      return;
    }
  });

// API Key Management
program
  .command('api')
  .description('Manage API keys')
  .action(async () => {
    await manageAPIKeys();
  });

// Default command (quick generate)
program
  .argument('[prompt]', 'Your coding request')
  .option('-f, --file <path>', 'Read prompt from file')
  .option('-m, --model <model>', 'Set AI model')
  .option('--no-session', 'Don\'t use session')
  .action(async (prompt, options) => {
    if (!prompt) {
      console.log(chalk.yellow('\nAvailable Commands:'));
      console.log(chalk.white('  ajelcode start          ') + chalk.gray('Start interactive session'));
      console.log(chalk.white('  ajelcode chat "prompt"  ') + chalk.gray('Chat with AI'));
      console.log(chalk.white('  ajelcode session        ') + chalk.gray('Manage sessions'));
      console.log(chalk.white('  ajelcode config         ') + chalk.gray('Manage configuration'));
      console.log(chalk.white('  ajelcode api            ') + chalk.gray('Manage API keys'));
      console.log(chalk.white('  ajelcode "prompt"       ') + chalk.gray('Quick generate'));
      console.log(chalk.gray('\nTry: ajelcode start\n'));
      return;
    }

    const spinner = ora('Processing...').start();
    try {
      const response = await askAI(prompt, {
        model: options.model || config.model,
        useSession: !options.noSession
      });
      spinner.succeed('Done!');
      
      await handleFileOperation(response);
      console.log(chalk.green('\nDone.\n'));
    } catch (error) {
      spinner.fail('Error: ' + error.message);
      if (error.stack) {
        console.error(chalk.gray(error.stack));
      }
    }
  });

// Interactive Menu Function
async function interactiveMenu() {
  console.clear();
  console.log(chalk.cyan(figlet.textSync('AjelCode', { font: 'Standard' })));
  console.log(chalk.magenta('\n🐋 "The whale sings, the code flows..."\n'));

  let running = true;

  while (running) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: chalk.cyan('What would you like to do?'),
        choices: [
          { name: 'Chat with AI', value: 'chat' },
          { name: 'Generate Code', value: 'generate' },
          { name: 'View Session', value: 'session' },
          { name: 'Clear Session', value: 'clear' },
          { name: 'Settings', value: 'settings' },
          { name: 'Manage API Keys', value: 'api' },
          { name: 'Exit', value: 'exit' }
        ],
        prefix: '🐋'
      }
    ]);

    switch (action) {
      case 'chat': {
        const { prompt } = await inquirer.prompt([
          {
            type: 'input',
            name: 'prompt',
            message: chalk.green('Your message:'),
            prefix: '💬'
          }
        ]);

        if (prompt.toLowerCase() === 'exit') break;

        const spinner = ora('Thinking...').start();
        try {
          const response = await askAI(prompt, {
            model: config.model,
            useSession: true
          });
          spinner.succeed('Response:');
          console.log(chalk.white(response));
        } catch (error) {
          spinner.fail('Error: ' + error.message);
          if (error.stack) {
            console.error(chalk.gray(error.stack));
          }
        }
        break;
      }

      case 'generate': {
        const { prompt } = await inquirer.prompt([
          {
            type: 'input',
            name: 'prompt',
            message: chalk.green('Describe what you want to generate:'),
            prefix: '📁'
          }
        ]);

        const spinner = ora('Generating files...').start();
        try {
          const response = await askAI(prompt, {
            model: config.model,
            useSession: false
          });
          await handleFileOperation(response);
          spinner.succeed('Files created successfully!');
        } catch (error) {
          spinner.fail('Error: ' + error.message);
          if (error.stack) {
            console.error(chalk.gray(error.stack));
          }
        }
        break;
      }

      case 'session': {
        const sessionData = getSession();
        if (sessionData && sessionData.length > 0) {
          console.log(chalk.cyan('\nSession History:\n'));
          sessionData.forEach((s, i) => {
            const role = s.role === 'user' ? chalk.green('User:') : chalk.blue('AI:');
            const content = s.content ? s.content.substring(0, 150) : 'Empty';
            console.log(`${role} ${chalk.gray(content + (s.content && s.content.length > 150 ? '...' : ''))}`);
          });
        } else {
          console.log(chalk.yellow('No session data'));
        }
        break;
      }

      case 'clear': {
        clearSession();
        console.log(chalk.green('Session cleared'));
        break;
      }

      case 'settings': {
        const { setting } = await inquirer.prompt([
          {
            type: 'list',
            name: 'setting',
            message: chalk.cyan('Settings:'),
            choices: [
              { name: `Model (${config.model})`, value: 'model' },
              { name: `Temperature (${config.temperature})`, value: 'temperature' },
              { name: `Max Tokens (${config.maxTokens})`, value: 'maxTokens' },
              { name: 'Back', value: 'back' }
            ]
          }
        ]);

        if (setting === 'back') break;

        const { value } = await inquirer.prompt([
          {
            type: 'input',
            name: 'value',
            message: chalk.green(`Enter new value for ${setting}:`),
            default: config[setting]
          }
        ]);

        config[setting] = value;
        saveConfig(config);
        console.log(chalk.green(`Updated ${setting} to: ${value}`));
        break;
      }

      case 'api': {
        await manageAPIKeys();
        break;
      }

      case 'exit': {
        running = false;
        console.log(chalk.magenta('\n🐋 "The whale sings you goodbye..."\n'));
        break;
      }
    }
  }
}

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(chalk.red('Uncaught Exception:'), error.message);
  if (error.stack) {
    console.error(chalk.gray(error.stack));
  }
});

program.parse();
