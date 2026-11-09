import * as THREE from 'three';
export type Role='hero'|'devil'|'clerk'|'skeleton'|'presenter'|'crowd';
export type Acting={time:number;walk?:number;phase?:number;emotion?:'neutral'|'curious'|'worried'|'panic'|'relief'|'deadpan'|'smile';gesture?:'idle'|'press'|'ask'|'point'|'phone'|'glasses'|'ticket'|'present'|'sit'|'backaway';gestureAmount?:number;talk?:number;lookX?:number;lookY?:number;seated?:boolean};
type Point={x:number;y:number};
type Facing='front'|'threequarter'|'back';
type DrawState=Acting&{facing:Facing;flip:boolean};
const W=768,H=1280,SOLE=1235.2,INK='#281f31',FLAT='#8080ff',TAU=Math.PI*2;
const clamp=(x:number,a=0,b=1)=>Math.max(a,Math.min(b,x));
const path=(s:string)=>new Path2D(s);
const canvas=(w:number,h:number)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
const ctx=(c:HTMLCanvasElement)=>{const g=c.getContext('2d');if(!g)throw new Error('Character art requires Canvas2D');return g;};
function normalField(cloth=false){
 const c=canvas(256,256),g=ctx(c),p=g.createImageData(256,256);
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){
  const nx=(x-127.5)/127.5*(cloth?.49:.61),ny=(127.5-y)/127.5*(cloth?.12:.53),nz=Math.sqrt(Math.max(.16,1-nx*nx-ny*ny)),d=Math.hypot(nx,ny,nz),j=(y*256+x)*4;
  p.data[j]=Math.round((nx/d*.5+.5)*255);p.data[j+1]=Math.round((ny/d*.5+.5)*255);p.data[j+2]=Math.round((nz/d*.5+.5)*255);p.data[j+3]=255;
 }g.putImageData(p,0,0);return c;
}
/** Original compact graphic cast: broad heads, rounded torsos and uninterrupted stick limbs. */
function createArt(role:Role,variant:number){
 const cc=canvas(W,H),nc=canvas(W,H),ic=canvas(W,H),rc=canvas(W,H),c=ctx(cc),n=ctx(nc),i=ctx(ic),r=ctx(rc),all=[c,n,i,r];
 const color=new THREE.CanvasTexture(cc),normal=new THREE.CanvasTexture(nc),ink=new THREE.CanvasTexture(ic),roughness=new THREE.CanvasTexture(rc);
 color.colorSpace=THREE.SRGBColorSpace;normal.colorSpace=ink.colorSpace=roughness.colorSpace=THREE.NoColorSpace;
 for(const map of [color,normal,ink,roughness]){map.minFilter=map.magFilter=THREE.LinearFilter;map.generateMipmaps=false;map.premultiplyAlpha=false;}
 color.name=`cartoon-${role}-albedo`;normal.name=`cartoon-${role}-form`;ink.name=`cartoon-${role}-ink`;roughness.name=`cartoon-${role}-roughness`;
 const fields={round:normalField(),cloth:normalField(true)};
 const anchors={head:{x:384,y:310},left:{x:245,y:790},right:{x:525,y:790},feet:[{x:330,y:SOLE},{x:445,y:SOLE}] as [Point,Point],contact:[1,1]};
 const devil=role==='devil',skeleton=role==='skeleton',hero=role==='hero',seed=Math.abs(variant)%5;
 const palette=devil?{face:'#d84d4e',coat:'#61304d',accent:'#d4ae62',hair:'#302033'}:
  skeleton?{face:'#d8d5b9',coat:'#557381',accent:'#98acac',hair:'#424054'}:
  role==='clerk'?{face:'#dec29d',coat:'#82926e',accent:'#c7b784',hair:'#88828a'}:
  role==='presenter'?{face:'#e5bf96',coat:'#576c9c',accent:'#cf9768',hair:'#433146'}:
  {face:seed%2?'#dfb48b':'#eed0a4',coat:hero?'#d4653d':['#7d9c9b','#a97182','#809267','#c0935f','#657fb0'][seed],accent:hero?'#e5bc75':'#b4b6b0',hair:seed%3===1?'#655044':'#3c304c'};
 function gradient(x0:number,y0:number,x1:number,y1:number,stops:[number,string][]){const g=c.createLinearGradient(x0,y0,x1,y1);for(const [p,col]of stops)g.addColorStop(p,col);return g;}
 function shape(p:Path2D,fill:string|CanvasGradient,stroke=8,form?:{kind:'round'|'cloth';x:number;y:number;w:number;h:number},rough=.94){
  c.fillStyle=fill;c.fill(p);i.fillStyle=fill===INK?'#fff':'#000';i.fill(p);n.fillStyle=FLAT;n.fill(p);r.fillStyle=`rgb(${Math.round(rough*255)},${Math.round(rough*255)},${Math.round(rough*255)})`;r.fill(p);
  if(form){n.save();n.clip(p);n.drawImage(fields[form.kind],form.x,form.y,form.w,form.h);n.restore();}
  if(stroke>0){c.strokeStyle=INK;c.lineWidth=stroke;c.stroke(p);i.strokeStyle='#fff';i.lineWidth=stroke;i.stroke(p);n.strokeStyle=FLAT;n.lineWidth=stroke;n.stroke(p);r.strokeStyle='#ededed';r.lineWidth=stroke;r.stroke(p);}
 }
 function line(s:string|Path2D,weight=7,col=INK,inked=true){const p=typeof s==='string'?path(s):s;c.strokeStyle=col;c.lineWidth=weight;c.stroke(p);i.strokeStyle=inked?'#fff':'#000';i.lineWidth=weight;i.stroke(p);n.strokeStyle=FLAT;n.lineWidth=weight;n.stroke(p);r.strokeStyle='#ededed';r.lineWidth=weight;r.stroke(p);}
 function ellipse(x:number,y:number,rx:number,ry:number,fill:string,stroke=0){const p=new Path2D();p.ellipse(x,y,rx,ry,0,0,TAU);shape(p,fill,stroke);}
 function glaze(p:Path2D,x:number,y:number,w:number,h:number){c.save();c.clip(p);c.globalCompositeOperation='multiply';c.fillStyle=gradient(x,y,x+w,y+h*.5,[[0,'#fbf8ed'],[.30,'#ffffff'],[.69,'#e6dfe7'],[1,'#b0a3bd']]);c.fillRect(x-8,y-8,w+16,h+16);c.restore();}
 function hand(x:number,y:number){ellipse(x,y,12.5,14,INK,2);ellipse(x-2,y-3,5,6,'#514252');}
 function foot(x:number,y:number,side:number){line(`M${x} ${y-13} Q${x+side*8} ${y-2} ${x+side*33} ${y-3}`,15);line(`M${x+side*6} ${y-7} L${x+side*27} ${y-6}`,3,'#635665',false);}
 function drawFace(s:DrawState,expression:Acting['emotion'],quarter:number,down:number,smile:boolean){
  const center=384+quarter*34,ey=309+down,gap=quarter?44:52,left=center-gap,right=center+gap,far=quarter?.83:1,panic=expression==='panic',worried=expression==='worried',blink=((s.time+variant*.27)%4.4)>4.29;
  if(skeleton){
   ellipse(left,ey,24*far,29,'#333345');ellipse(right,ey,25,30,'#333345');shape(path(`M${center-7} ${ey+38} L${center+7} ${ey+38} ${center+12} ${ey+57} ${center-11} ${ey+57}Z`),'#4b4b58',0);
   line(`M${center-46} ${ey+91} Q${center} ${ey+101} ${center+47} ${ey+89}`,7,'#4c5360',false);for(let j=0;j<5;j++)line(`M${center-33+j*17} ${ey+82} L${center-33+j*17} ${ey+104}`,4,'#59616a',false);return;
  }
  if(panic&&!blink){
   ellipse(left,ey,20*far,24,'#fff0d2',6);ellipse(right,ey,20,25,'#fff0d2',6);ellipse(left+2,ey+3,7,10,INK);ellipse(right+2,ey+3,7,10,INK);line(`M${left-21} ${ey-43} Q${left} ${ey-61} ${left+20} ${ey-47} M${right-20} ${ey-47} Q${right} ${ey-64} ${right+22} ${ey-45}`,8);
  }else if(blink||smile&&!devil){line(`M${left-13} ${ey+5} Q${left} ${ey-4} ${left+13} ${ey+5} M${right-13} ${ey+5} Q${right} ${ey-4} ${right+14} ${ey+5}`,8);}
  else{
   ellipse(left,ey+(devil?7:3),10*far,devil?13:15,INK);ellipse(right,ey+(devil?7:3),10.5,devil?13:15,INK);
   if(devil||expression==='deadpan')line(`M${left-18} ${ey-3} L${left+18} ${ey-4} M${right-18} ${ey-4} L${right+18} ${ey-1}`,8);
   if(worried)line(`M${left-21} ${ey-31} Q${left-3} ${ey-48} ${left+18} ${ey-36} M${right-20} ${ey-34} L${right+20} ${ey-20}`,9);
   else line(`M${left-20} ${ey-31} Q${left} ${ey-(devil?21:39)} ${left+18} ${ey-33} M${right-18} ${ey-31} Q${right} ${ey-(devil?41:37)} ${right+21} ${ey-27}`,devil?10:7.5);
  }
  const talk=clamp(s.talk??0),my=ey+(devil?83:80);
  if(panic||talk>.05){ellipse(center,my,panic?15:devil?21:14,panic?22:8+talk*12,INK);if(devil&&talk>.05)shape(path(`M${center-14} ${my-6} L${center+15} ${my-6} ${center+12} ${my+1} ${center-12} ${my+1}Z`),'#e5d7bd',0);}
  else if(smile||devil)line(`M${center-22} ${my-2} Q${center+1} ${my+14} ${center+28} ${my-8}`,7);
  else if(worried)line(`M${center-18} ${my+7} Q${center-5} ${my-5} ${center+18} ${my+2}`,7);
  else line(`M${center-13} ${my} L${center+15} ${my+2}`,6.5);
  if(devil||role==='clerk'||role==='presenter'){
   const gy=ey+(devil?28:9)+(s.gesture==='glasses'?-9*clamp(s.gestureAmount??1):0),metal=devil?'#ccab70':'#403444';for(const ex of [left,right]){const p=new Path2D();p.ellipse(ex,gy,29,22,0,0,TAU);line(p,devil?5:4.5,metal,false);}
   line(`M${left+28} ${gy-4} Q${center} ${gy-13} ${right-28} ${gy-4}`,4.5,metal,false);line(`M${left-28} ${gy-5} L${left-54} ${gy-16} M${right+28} ${gy-5} L${right+48} ${gy-18}`,4,metal,false);
  }
 }
 function repaint(s:DrawState){
  const seated=!!s.seated||s.gesture==='sit',seat=seated?100:0,walk=seated?0:clamp(s.walk??0),phase=s.phase??s.time*6.8,expr=s.emotion??(devil?'deadpan':'neutral'),gesture=s.gesture??'idle',back=s.facing==='back',quarter=s.facing==='threequarter'?1:0,panic=expr==='panic',smile=expr==='smile'||expr==='relief';
  const amount=clamp(s.gestureAmount??1),bob=-Math.abs(Math.sin(phase))*9*walk,lean=gesture==='backaway'?-.065*amount:panic?-.055:gesture==='ask'?.025*amount:0,bottom=devil?858:806,tw=devil?143:hero?126:133,down=devil?35:0,headTop=devil?151:126;
  const pose=(x:number,y:number):Point=>{const dx=x-384,dy=y-bottom;return{x:384+Math.cos(lean)*dx-Math.sin(lean)*dy,y:bottom+seat+bob+Math.sin(lean)*dx+Math.cos(lean)*dy};};
  const mirrored=(p:Point):Point=>s.flip?{x:W-p.x,y:p.y}:p;
  for(const g of all){g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,W,H);g.lineJoin='round';g.lineCap='round';if(s.flip){g.translate(W,0);g.scale(-1,1);}}
  const gait=(off:number)=>{const u=((phase/TAU+off)%1+1)%1;if(u<.6)return{x:(65-216*u)*walk,lift:0,contact:1};const t=(u-.6)/.4;return{x:(-65+130*t*t*(3-2*t))*walk,lift:Math.sin(Math.PI*t)*45*walk,contact:0};};
  const ga=gait(0),gb=gait(.5),footL=seated?306:330+ga.x,footR=seated?470:440+gb.x,hipL=pose(333,bottom-12),hipR=pose(434,bottom-12);
  const legL=seated?`M${hipL.x} ${hipL.y} Q278 1052 307 1080 L${footL} ${SOLE-13}`:`M${hipL.x} ${hipL.y} Q${320-ga.x*.3} ${1020-ga.lift*.5} ${footL} ${SOLE-13-ga.lift}`;
  const legR=seated?`M${hipR.x} ${hipR.y} Q495 1050 470 1082 L${footR} ${SOLE-13}`:`M${hipR.x} ${hipR.y} Q${451-gb.x*.3} ${1020-gb.lift*.5} ${footR} ${SOLE-13-gb.lift}`;
  line(legL,18);line(legL,5.5,skeleton?'#a5b2b2':'#55455c',false);line(legR,18);line(legR,5.5,skeleton?'#a5b2b2':'#55455c',false);foot(footL,SOLE-ga.lift,-1);foot(footR,SOLE-gb.lift,1);
  all.forEach(g=>{g.save();g.translate(384,bottom+seat+bob);g.rotate(lean);g.translate(-384,-bottom);});
  const blend=(a:Point,b:Point,t=amount):Point=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
  let idleLeft={x:241-Math.sin(phase)*30*walk,y:778},idleRight={x:526+Math.sin(phase)*30*walk,y:778};
  if(seated){idleLeft={x:270,y:599};idleRight={x:520,y:599};}if(panic){idleLeft={x:215,y:712};idleRight={x:557,y:710};}
  let targetLeft={...idleLeft},targetRight={...idleRight};
  if(gesture==='ask'){targetLeft={x:184,y:650};targetRight={x:601,y:625};}if(gesture==='press')targetRight={x:640,y:583};if(gesture==='point')targetRight={x:650,y:607};if(gesture==='phone')targetRight={x:566,y:350+down};if(gesture==='glasses')targetRight={x:458,y:344+down};if(gesture==='ticket')targetRight={x:619,y:710};if(gesture==='present')targetLeft={x:136,y:527};
  const left=blend(idleLeft,targetLeft),right=blend(idleRight,targetRight),sy=devil?533:498;
  const leftStart={x:384-tw+5,y:sy},rightStart={x:384+tw-5,y:sy};
  const leftIdleC1={x:leftStart.x-18,y:sy+105},leftIdleC2={x:idleLeft.x-9,y:idleLeft.y-82},rightIdleC1={x:rightStart.x+18,y:sy+105},rightIdleC2={x:idleRight.x+9,y:idleRight.y-82};
  let leftTargetC1={...leftIdleC1},leftTargetC2={...leftIdleC2},rightTargetC1={...rightIdleC1},rightTargetC2={...rightIdleC2};
  if(gesture==='ask'||gesture==='present'){leftTargetC1={x:leftStart.x-34,y:sy+99};leftTargetC2={x:targetLeft.x-21,y:targetLeft.y+54};}
  if(['ask','press','point','ticket'].includes(gesture)){rightTargetC1={x:rightStart.x+35,y:sy+96};rightTargetC2={x:targetRight.x+22,y:targetRight.y+56};}
  if(gesture==='phone'||gesture==='glasses'){rightTargetC1={x:638,y:630};rightTargetC2={x:628,y:415};}
  const lc1=blend(leftIdleC1,leftTargetC1),lc2=blend(leftIdleC2,leftTargetC2),rc1=blend(rightIdleC1,rightTargetC1),rc2=blend(rightIdleC2,rightTargetC2);
  const leftArm=`M${leftStart.x} ${leftStart.y} C${lc1.x} ${lc1.y} ${lc2.x} ${lc2.y} ${left.x} ${left.y}`;
  line(leftArm,18);line(leftArm,5,'#66536b',false);hand(left.x,left.y);
  if(devil){line('M483 799 Q594 906 590 777 Q580 711 620 738',16,'#6f2f48',false);shape(path('M603 725 L635 729 623 759Z'),'#be4456',5);}
  const torso=path(`M${384-tw+17} ${devil?502:463} Q${384-tw+27} ${devil?475:441} 342 ${devil?479:446} Q420 ${devil?473:439} ${384+tw-22} ${devil?505:467} Q${384+tw+2} 556 ${384+tw} 657 L${384+tw-1} ${bottom-49} Q${384+tw-4} ${bottom+1} 446 ${bottom+4} L326 ${bottom+4} Q${384-tw-11} ${bottom} ${384-tw-8} ${bottom-52} L${384-tw-3} 563 Q${384-tw-7} 498 ${384-tw+17} ${devil?502:463}Z`);
  shape(torso,palette.coat,9,{kind:'cloth',x:384-tw-8,y:devil?480:442,w:tw*2+16,h:bottom-(devil?475:437)});
  if(back){line(`M384 ${devil?530:480} Q377 645 384 ${bottom-12}`,3.5,'#403347',false);if(hero)line('M290 722 Q384 739 481 721',4,'#9f493e',false);}
  else if(devil||role==='clerk'||role==='presenter'){
   const top=devil?505:466;shape(path(`M341 ${top} L384 ${top+39} 426 ${top} L414 ${top+92} 384 ${top+130} 355 ${top+92}Z`),'#e5d6b8',3.5);shape(path(`M376 ${top+39} L393 ${top+39} 399 ${top+94} 384 ${top+112} 374 ${top+94}Z`),palette.accent,3);
   line(`M294 ${top+39} L334 ${top+98} 318 ${top+117} 370 ${top+167} M474 ${top+39} L434 ${top+98} 450 ${top+117} 400 ${top+167}`,4.8,'#35283f',false);line(`M384 ${top+167} L384 ${bottom-15}`,3.5,'#35283f',false);line(`M294 ${bottom-83} L337 ${bottom-80} M435 ${bottom-80} L477 ${bottom-84}`,4.5,'#35283f',false);
   if(devil){shape(path('M440 595 L442 570 454 582 466 572 467 595Z'),'#e7d2a8',2.5);ellipse(398,746,4.2,4.2,palette.accent);ellipse(398,786,4.2,4.2,palette.accent);}
  }else if(hero){line('M384 480 L384 786',3.2,'#9f493e',false);shape(path('M343 462 L383 484 424 461 412 488 384 501 355 488Z'),'#dca365',3);line('M291 684 L337 688 M431 687 L478 682',4,'#9d463e',false);ellipse(392,591,2.8,2.8,'#e6ba75');}
  if(skeleton&&!back){shape(path('M335 483 Q383 510 431 484 L423 741 Q386 767 345 740Z'),'#bdc9c0',3);for(let j=0;j<4;j++)line(`M348 ${545+j*43} Q383 ${566+j*43} 420 ${545+j*43}`,7,'#677e89',false);line('M384 516 L384 741',8,'#7d9194',false);}
  glaze(torso,384-tw-4,devil?480:442,tw*2+8,bottom-(devil?475:437));line(`M${384+tw} 609 L${384+tw-1} ${bottom-49} Q${384+tw-2} ${bottom+1} 446 ${bottom+4} L330 ${bottom+4}`,12.5);
  const rightArm=`M${rightStart.x} ${rightStart.y} C${rc1.x} ${rc1.y} ${rc2.x} ${rc2.y} ${right.x} ${right.y}`;
  line(rightArm,18);line(rightArm,5.5,'#786074',false);hand(right.x,right.y);
  const headShape=quarter?path(`M217 ${276+down} Q213 ${197+down} 271 ${154+down} Q332 ${119+down} 413 ${137+down} Q511 ${139+down} 557 ${211+down} Q578 ${252+down} 572 ${312+down} Q575 ${377+down} 517 ${428+down} Q454 ${481+down} 362 ${459+down} Q273 ${447+down} 237 ${380+down} Q214 ${336+down} 217 ${276+down}Z`):path(`M207 ${279+down} Q207 ${201+down} 260 ${157+down} Q313 ${117+down} 384 ${122+down} Q476 ${116+down} 536 ${179+down} Q580 ${224+down} 577 ${290+down} Q581 ${360+down} 529 ${415+down} Q477 ${467+down} 393 ${467+down} Q307 ${469+down} 254 ${416+down} Q206 ${365+down} 207 ${279+down}Z`);
  if(devil)for(const side of [-1,1]){all.forEach(g=>{g.save();g.translate(384,0);g.scale(side,1);g.translate(-384,0);});const horn=path('M243 219 Q174 203 169 125 Q168 67 199 39 Q178 121 224 152 Q252 171 268 181Z');shape(horn,gradient(171,91,263,202,[[0,'#e2ca8e'],[.55,'#c4a368'],[1,'#796547']]),7,{kind:'round',x:166,y:40,w:105,h:182},.62);line('M180 130 Q195 142 210 142 M191 166 Q209 177 231 170',3.5,'#99815b',false);all.forEach(g=>g.restore());}
  shape(headShape,back?palette.hair:palette.face,9,{kind:'round',x:207,y:headTop,w:373,h:354},.94);
  if(!back){glaze(headShape,207,headTop,373,355);line(quarter?`M573 ${293+down} Q581 ${361+down} 526 ${419+down} Q479 ${462+down} 414 ${464+down}`:`M577 ${290+down} Q581 ${360+down} 529 ${416+down} Q475 ${470+down} 393 ${468+down} Q308 ${470+down} 256 ${421+down}`,13);drawFace(s,expr,quarter,down,smile);}
  if(skeleton){if(!back){line(`M262 ${185+down} Q384 ${143+down} 512 ${188+down}`,4,'#b1bcb2',false);line(`M271 ${402+down} Q384 ${448+down} 502 ${401+down}`,4,'#9aaeb0',false);}}
  else if(devil){
   const hair=path('M210 280 Q195 201 254 155 Q315 110 386 135 Q467 112 529 170 Q562 202 569 258 L534 258 Q520 211 476 208 Q444 225 414 202 L383 233 347 205 Q294 220 269 254 L245 294Z');shape(hair,gradient(225,146,547,274,[[0,'#493148'],[.50,'#322439'],[1,'#251e30']]),9,{kind:'round',x:205,y:126,w:370,h:176});line('M254 197 Q302 159 355 175 M428 169 Q484 157 525 207',4.5,'#685063',false);if(!back)shape(path('M353 458 Q384 474 415 456 L385 487Z'),'#352037',4);
  }else{const hair=path(`M205 ${271+down} Q194 ${189+down} 258 ${141+down} Q310 ${105+down} 373 ${119+down} Q461 ${100+down} 526 ${153+down} Q563 ${184+down} 571 ${252+down} L540 ${261+down} Q518 ${214+down} 469 ${201+down} Q425 ${224+down} 392 ${204+down} Q345 ${236+down} 299 ${217+down} Q261 ${236+down} 248 ${286+down}Z`);shape(hair,gradient(221,138+down,551,269+down,[[0,palette.hair],[.45,role==='clerk'?'#9d949a':'#493854'],[1,role==='clerk'?'#625f70':'#2a243c']]),9,{kind:'round',x:206,y:115+down,w:369,h:175});line(`M249 ${183+down} Q303 ${146+down} 365 ${158+down} M423 ${153+down} Q478 ${148+down} 523 ${188+down}`,4,role==='clerk'?'#b6a9aa':'#675373',false);}
  // Near hand owns the glasses/receiver contact and must remain in front of the cheek.
  if(!back&&(gesture==='phone'||gesture==='glasses')){
   // Exact second half of the already drawn cubic, so the foreground portion also blends.
   const a=blend(rightStart,rc1,.5),b=blend(rc1,rc2,.5),c=blend(rc2,right,.5),d=blend(a,b,.5),e=blend(b,c,.5),f=blend(d,e,.5);
   const near=`M${f.x} ${f.y} C${e.x} ${e.y} ${c.x} ${c.y} ${right.x} ${right.y}`;
   line(near,18);line(near,5.5,'#786074',false);hand(right.x,right.y);
  }
  all.forEach(g=>g.restore());
  anchors.head=mirrored(pose(384+quarter*27,310+down));anchors.left=mirrored(pose(left.x,left.y));anchors.right=mirrored(pose(right.x,right.y));anchors.feet=[mirrored({x:footL,y:SOLE-ga.lift}),mirrored({x:footR,y:SOLE-gb.lift})];anchors.contact=[ga.contact,gb.contact];
  for(const g of [n,i,r]){g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='destination-in';g.drawImage(cc,0,0);g.globalCompositeOperation='source-over';}for(const map of [color,normal,ink,roughness])map.needsUpdate=true;
 }
 repaint({time:0,facing:'front',flip:false});
 return{color,normal,ink,roughness,anchors,repaint,dispose(){for(const map of [color,normal,ink,roughness])map.dispose();for(const c of [cc,nc,ic,rc,fields.round,fields.cloth])c.width=c.height=1;}};
}
function contactMap(){const c=canvas(96,96),g=ctx(c),p=g.createRadialGradient(48,48,2,48,48,46);p.addColorStop(0,'rgba(8,7,17,.62)');p.addColorStop(.45,'rgba(8,7,17,.28)');p.addColorStop(1,'rgba(8,7,17,0)');g.fillStyle=p;g.fillRect(0,0,96,96);return new THREE.CanvasTexture(c);}
/** Lit authored cards preserve the chosen graphic anatomy and share real scene emitters. */
export function createCharacter(role:Role,variant=0){
 const group=new THREE.Group();group.name=`character-${role}-${variant}`;const art=createArt(role,variant),height=role==='devil'?3.68:2.95,width=height*.6;
 const material=new THREE.MeshStandardMaterial({map:art.color,normalMap:art.normal,normalScale:new THREE.Vector2(.77,.77),roughnessMap:art.roughness,roughness:1,metalness:0,alphaTest:.12,side:THREE.DoubleSide});
 material.onBeforeCompile=shader=>{shader.uniforms.actorInk={value:art.ink};shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D actorInk;');shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`float inkCoverage=smoothstep(.35,.95,texture2D(actorInk,vMapUv).r);\noutgoingLight=mix(outgoingLight,diffuseColor.rgb*.70,inkCoverage);\n#include <opaque_fragment>`);};material.customProgramCacheKey=()=> 'cartoon-graphic-pbr-ink-v1';
 const billboard=new THREE.Group();billboard.name='graphic-facing-frame';group.add(billboard);const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,height),material);mesh.position.y=height*(SOLE/H-.5)+.012;mesh.castShadow=mesh.receiveShadow=true;mesh.layers.set(3);billboard.add(mesh);mesh.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:art.color,alphaTest:.12,side:THREE.DoubleSide});
 const head=new THREE.Group(),leftHand=new THREE.Group(),rightHand=new THREE.Group();head.name='head-anchor';leftHand.name='left-grip-anchor';rightHand.name='right-grip-anchor';billboard.add(head,leftHand,rightHand);
 const shadowTexture=contactMap(),contacts:THREE.Mesh[]=[];for(let j=0;j<2;j++){const m=new THREE.Mesh(new THREE.PlaneGeometry(.24,.16),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,opacity:.65,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.y=.015+j*.001;m.layers.set(3);group.add(m);contacts.push(m);}
 let camera:THREE.Camera|undefined,lastSignature='';function setCamera(c:THREE.Camera){camera=c;}
 function point(p:Point,target:THREE.Object3D,z=.035){target.position.set((p.x/W-.5)*width,(SOLE-p.y)/H*height+.012,z);}
 function update(a:Acting){
  const world=group.getWorldPosition(new THREE.Vector3()),cameraWorld=camera?.getWorldPosition(new THREE.Vector3())??new THREE.Vector3(world.x,world.y+2,world.z+10),q=group.getWorldQuaternion(new THREE.Quaternion()),f=new THREE.Vector3(0,0,1).applyQuaternion(q),groupYaw=Math.atan2(f.x,f.z),yaw=Math.atan2(cameraWorld.x-world.x,cameraWorld.z-world.z),delta=Math.atan2(Math.sin(yaw-groupYaw),Math.cos(yaw-groupYaw));
  const facing:Facing=Math.abs(delta)>Math.PI*.67?'back':Math.abs(delta)>Math.PI*.14?'threequarter':'front',flip=facing==='threequarter'&&delta>0,state={...a,facing,flip},signature=JSON.stringify(state);if(signature!==lastSignature){art.repaint(state);lastSignature=signature;}
  material.normalScale.set(flip?-.77:.77,.77);billboard.rotation.y=yaw-groupYaw;for(const map of [art.color,art.normal,art.ink,art.roughness])map.needsUpdate=true;
  point(art.anchors.head,head);point(art.anchors.left,leftHand,.055);point(art.anchors.right,rightHand,.055);
  for(let j=0;j<2;j++){const p=art.anchors.feet[j],offset=new THREE.Vector3((p.x/W-.5)*width,0,0).applyAxisAngle(new THREE.Vector3(0,1,0),billboard.rotation.y);contacts[j].position.set(offset.x,.015+j*.001,offset.z);(contacts[j].material as THREE.MeshBasicMaterial).opacity=.12+.46*art.anchors.contact[j];contacts[j].scale.setScalar(.72+.28*art.anchors.contact[j]);}
  group.userData.facing=facing;group.userData.flip=flip;group.userData.cardYaw=yaw;group.userData.anchors={head:{...art.anchors.head},left:{...art.anchors.left},right:{...art.anchors.right},sole:SOLE,canvas:[W,H]};group.updateMatrixWorld(true);
 }
 group.userData={role,variant,height:role==='devil'?3.5:2.65,style:'authored compact graphic cards',grip:'exact painted dot palm; receiver spine attach x~+.08 in graphic-facing frame'};update({time:0});
 return{group,head,leftHand,rightHand,setCamera,update,dispose(){art.dispose();mesh.geometry.dispose();material.dispose();mesh.customDepthMaterial?.dispose();for(const m of contacts){m.geometry.dispose();(m.material as THREE.Material).dispose();}shadowTexture.dispose();}};
}
