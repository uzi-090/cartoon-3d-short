import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const mode = process.argv[2] ?? 'still';
if (!['still', 'demo', 'final'].includes(mode)) throw new Error('Use still, demo or final.');
const temp = path.resolve(process.env.REMOTION_TMP ?? path.join(root, 'tmp'));
fs.mkdirSync(temp, {recursive:true}); fs.mkdirSync('out', {recursive:true});
for (const key of ['TEMP','TMP','REMOTION_TMP']) process.env[key] = temp;

// Refuse a final film before its user-supplied narration is configured.
// Configuration contains source literals; imported browser modules are not evaluated here.
if (mode === 'final') {
  const source = fs.readFileSync('src/project.ts', 'utf8');
  const narration = source.match(/narrationFile\s*:\s*['"]([^'"]+)['"]/u)?.[1];
  if (!narration) throw new Error('Supply narration manually and set narrationFile in src/project.ts before rendering Movie.');
  const absolute = path.resolve('public', narration);
  const relative = path.relative(path.resolve('public'), absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative) || !fs.statSync(absolute, {throwIfNoEntry:false})?.isFile()) {
    throw new Error('narrationFile must name an existing supplied audio file inside public/.');
  }
}

const {bundle} = await import('@remotion/bundler');
const {selectComposition, renderStill, renderMedia} = await import('@remotion/renderer');
const final = mode === 'final', scale = final ? 4/3 : 2/3;
const inputProps = {demo:!final, subtitles:true, dpr:Math.max(1,scale)};
const browserExecutable = process.env.BROWSER_EXECUTABLE || undefined;
const chromiumOptions = process.env.REMOTION_GL ? {gl:process.env.REMOTION_GL} : {};
const serveUrl = await bundle({entryPoint:path.resolve('src/index.ts'), publicDir:path.resolve('public'), rootDir:root});
const composition = await selectComposition({serveUrl, id:final?'Movie':'StyleDemo', inputProps, browserExecutable, chromiumOptions, timeoutInMilliseconds:120000});
const common = {serveUrl, composition, inputProps, browserExecutable, chromiumOptions, timeoutInMilliseconds:120000};
if (mode === 'still') {
  const frame = Number(process.argv[3] ?? 90);
  if (!Number.isInteger(frame) || frame < 0 || frame >= composition.durationInFrames) throw new Error('Frame outside the demo timeline.');
  const output = path.resolve(`out/style-${frame}.png`);
  await renderStill({...common, frame, output, scale, imageFormat:'png'});
  console.log(output);
} else {
  const outputLocation = path.resolve(final?'out/movie.mp4':'out/style-demo.mp4');
  let previous = -1;
  await renderMedia({...common, outputLocation, scale, codec:'h264', pixelFormat:'yuv420p', colorSpace:'bt709', audioCodec:'aac',
    crf:final?17:20, x264Preset:'fast', concurrency:1, imageFormat:'png',
    onProgress:p=>{const percent=Math.floor(p.progress*100);if(percent!==previous){console.log(`${percent}%`);previous=percent;}}});
  console.log(outputLocation);
}
