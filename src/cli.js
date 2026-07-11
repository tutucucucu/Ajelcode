#!/usr/bin/env node
import chalk from 'chalk';
import figlet from 'figlet';
import { program } from 'commander';
import { readFileSync, existsSync } from 'fs';
import { askAI } from './ai.js';
import { handleFileOperation } from './files.js';
import { loadConfig, initConfig } from './config.js';

initConfig();

const config = loadConfig();

console.log(chalk.cyan(figlet.textSync('AjelCode', { font: 'Standard' })));

program
  .name('ajelcode')
  .description('AI Coding Assistant')
  .version('1.0.0');

program
  .argument('[prompt]', 'Your coding request')
  .option('-f, --file <path>', 'Read prompt from file')
  .option('-m, --model <model>', 'Set AI model')
  .option('--no-color', 'Disable colored output')
  .action(async (prompt, options) => {
    const input = options.file 
      ? readFileSync(options.file, 'utf-8')
      : prompt;

    if (!input) {
      console.log(chalk.yellow('\nUsage: ajelcode "create sorting function"'));
      console.log(chalk.gray('   or: ajelcode -f instructions.txt\n'));
      console.log(chalk.gray('Config: edit conf.json in current directory\n'));
      return;
    }

    if (options.noColor) {
      chalk.level = 0;
    }

    console.log(chalk.green('\nProcessing...\n'));

    try {
      const response = await askAI(input, {
        model: options.model || config.model
      });

      await handleFileOperation(response);
      
      console.log(chalk.green('\nDone.\n'));
    } catch (error) {
      console.error(chalk.red('\nError:'), error.message);
    }
  });

program.parse();
