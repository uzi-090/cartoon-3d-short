import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignored = new Set(['.git', 'node_modules', 'out', 'tmp', 'dist', '__pycache__']);
export function files(directory=root) {
  return fs.readdirSync(directory, {withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(e=>{
    if (ignored.has(e.name)) return [];
    const absolute = path.join(directory,e.name);
    if (e.isSymbolicLink()) throw new Error(`Symlink not permitted in public skill: ${absolute}`);
    return e.isDirectory() ? files(absolute) : [absolute];
  });
}

export function validate() {
  const all = files(); const errors = [];
  for (const absolute of all) {
    const relative = path.relative(root,absolute).replaceAll(path.sep,'/');
    if (/\.(mp[34]|m4a|wav|flac|mov|webm|jpe?g|png|zip|env)$/iu.test(relative)) errors.push(`Unexpected media/private input: ${relative}`);
    const body = fs.readFileSync(absolute,'utf8');
    if (/[A-Z]:[\\/](?:Users|AnimatedShorts)[\\/]/u.test(body)) errors.push(`Creator-specific absolute path: ${relative}`);
    if (/gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/u.test(body)) errors.push(`Possible credential: ${relative}`);
    if (!relative.endsWith('.md')) continue;
    for (const m of body.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)/gu)) {
      const link=m[1].split('#')[0];
      if (!link || /^[a-z]+:/iu.test(link)) continue;
      const target=path.resolve(path.dirname(absolute),decodeURIComponent(link));
      const rel=path.relative(root,target);
      if (rel.startsWith('..') || path.isAbsolute(rel) || !fs.existsSync(target)) errors.push(`Broken/outside link in ${relative}: ${link}`);
    }
  }
  const skill=fs.readFileSync(path.join(root,'SKILL.md'),'utf8');
  if (!skill.startsWith('---\nname: cartoon-3d-short\ndescription: ')) errors.push('Missing portable skill frontmatter.');
  const pkg=JSON.parse(fs.readFileSync(path.join(root,'templates/project/package.json'),'utf8'));
  const versions=Object.entries(pkg.dependencies).filter(([k])=>k==='remotion'||k.startsWith('@remotion/')).map(([,v])=>v);
  if (new Set(versions).size!==1) errors.push('Remotion package versions must match.');
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`Validated ${all.length} public text/source files and local links. No bundled media, creator paths or detected credentials.`);
  return all;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) validate();
