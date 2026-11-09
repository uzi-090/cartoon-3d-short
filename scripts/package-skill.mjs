import fs from 'node:fs';
import path from 'node:path';
import {deflateRawSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {root, validate} from './validate-package.mjs';

// Small dependency-free ZIP writer: deflated UTF-8 files, fixed DOS date, CRC32.
const table=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
const crc32=data=>{let c=0xffffffff;for(const b of data)c=table[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;};
const local=[],central=[];let offset=0;
const all=validate();
for(const absolute of all){
  const relative=path.relative(root,absolute).replaceAll(path.sep,'/');
  if(relative.startsWith('.github/')) continue;
  const name=Buffer.from(`cartoon-3d-short/${relative}`),data=fs.readFileSync(absolute),compressed=deflateRawSync(data,{level:9}),crc=crc32(data);
  const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50,0);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);h.writeUInt16LE(8,8);h.writeUInt16LE(0x21,12);
  h.writeUInt32LE(crc,14);h.writeUInt32LE(compressed.length,18);h.writeUInt32LE(data.length,22);h.writeUInt16LE(name.length,26);
  local.push(h,name,compressed);
  const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50,0);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt16LE(8,10);c.writeUInt16LE(0x21,14);
  c.writeUInt32LE(crc,16);c.writeUInt32LE(compressed.length,20);c.writeUInt32LE(data.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE(offset,42);central.push(c,name);
  offset+=h.length+name.length+compressed.length;
}
const count=central.length/2,cd=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(count,8);end.writeUInt16LE(count,10);end.writeUInt32LE(cd.length,12);end.writeUInt32LE(offset,16);
const output=path.resolve(process.argv[2]??path.join(root,'dist/cartoon-3d-short.zip'));
if (fs.existsSync(output)) throw new Error(`Archive already exists: ${output}`);
fs.mkdirSync(path.dirname(output),{recursive:true});
const zip=Buffer.concat([...local,cd,end]);fs.writeFileSync(output,zip,{flag:'wx'});
console.log(JSON.stringify({output,files:count,bytes:zip.length,sha256:createHash('sha256').update(zip).digest('hex')},null,2));
