import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/init-project.mjs <new-project-folder>');
const destination = path.resolve(input);
if (fs.existsSync(destination)) throw new Error(`Destination already exists: ${destination}`);
const template = path.join(root, 'templates', 'project');
fs.cpSync(template, destination, {recursive:true, errorOnExist:true,
  filter:p=>!path.relative(template,p).split(path.sep).some(part=>['node_modules','out','tmp','__pycache__'].includes(part))});
fs.copyFileSync(path.join(root,'LICENSE'), path.join(destination,'SKILL_LICENSE'));
fs.copyFileSync(path.join(root,'THIRD_PARTY_NOTICES.md'), path.join(destination,'THIRD_PARTY_NOTICES.md'));
console.log(`Created ${destination}\nNext: cd to that folder, npm ci, npm run check, npm run still -- 90.\nThe silent demo needs no voice. Supply narration manually before producing your film.`);
