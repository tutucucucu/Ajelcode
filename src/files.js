import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import chalk from 'chalk';

export async function handleFileOperation(aiResponse) {
  const lines = aiResponse.split('\n');
  let currentFile = null;
  let currentContent = [];

  for (const line of lines) {
    const fileMatch = line.match(/### FILE:\s*(.+)/);
    if (fileMatch) {
      if (currentFile) {
        saveFile(currentFile, currentContent.join('\n'));
      }
      currentFile = fileMatch[1].trim();
      currentContent = [];
      console.log(chalk.blue('Creating: ' + currentFile));
      continue;
    }

    const folderMatch = line.match(/### FOLDER:\s*(.+)/);
    if (folderMatch) {
      const folder = folderMatch[1].trim();
      mkdirSync(folder, { recursive: true });
      console.log(chalk.yellow('Creating folder: ' + folder));
      continue;
    }

    if (currentFile) {
      currentContent.push(line);
    }
  }

  if (currentFile && currentContent.length > 0) {
    saveFile(currentFile, currentContent.join('\n'));
  }
}

function saveFile(path, content) {
  const dir = dirname(path);
  if (dir !== '.') {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(path, content.trim());
  console.log(chalk.green('Saved: ' + path));
}
