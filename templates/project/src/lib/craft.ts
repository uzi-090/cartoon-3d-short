import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export const material=(color:string,roughness=.78,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
export function box(parent:THREE.Object3D,name:string,size:[number,number,number],pos:[number,number,number],mat:THREE.Material,bevel=0):THREE.Mesh{
 const geo=bevel>0?new RoundedBoxGeometry(...size,2,Math.min(bevel,...size.map(x=>x*.22))):new THREE.BoxGeometry(...size);
 const mesh=new THREE.Mesh(geo,mat);mesh.name=name;mesh.position.set(...pos);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
export function label(parent:THREE.Object3D,text:string,w:number,h:number,pos:[number,number,number],options:{background?:string;color?:string;fontSize?:number;border?:string;align?:CanvasTextAlign}={}):THREE.Mesh{
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=Math.max(128,Math.round(1024*h/w));const c=canvas.getContext('2d')!;
 if(options.background){c.fillStyle=options.background;c.fillRect(0,0,canvas.width,canvas.height);}
 if(options.border){c.strokeStyle=options.border;c.lineWidth=8;c.strokeRect(8,8,canvas.width-16,canvas.height-16);}
 c.fillStyle=options.color??'#f6e8c9';c.font=`700 ${options.fontSize??Math.min(canvas.height*.40,110)}px Arial`;c.textAlign=options.align??'center';c.textBaseline='middle';
 const lines=text.split('\n');for(let j=0;j<lines.length;j++)c.fillText(lines[j],canvas.width/2,canvas.height*(.5+(j-(lines.length-1)/2)*.9/Math.max(lines.length,1)),canvas.width*.92);
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,transparent:!options.background,depthWrite:!!options.background,polygonOffset:true,polygonOffsetFactor:-2}));mesh.position.set(...pos);mesh.name='label-'+text.replace(/\n/g,' ');mesh.layers.set(3);parent.add(mesh);return mesh;
}
export function tube(parent:THREE.Object3D,name:string,points:[number,number,number][],radius:number,mat:THREE.Material):THREE.Mesh{
 const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(8,points.length*4),radius,7,false),mat);mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
export function disposeTree(group:THREE.Object3D):void{
 const gs=new Set<THREE.BufferGeometry>(),ms=new Set<THREE.Material>(),ts=new Set<THREE.Texture>();group.traverse(o=>{const m=o as THREE.Mesh;if(m.geometry)gs.add(m.geometry);if(m.material)for(const mat of Array.isArray(m.material)?m.material:[m.material]){ms.add(mat);for(const v of Object.values(mat))if(v instanceof THREE.Texture)ts.add(v);}});for(const t of ts)t.dispose();for(const g of gs)g.dispose();for(const m of ms)m.dispose();
}
