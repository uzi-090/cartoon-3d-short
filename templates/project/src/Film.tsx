import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useFrame, useThree} from '@react-three/fiber';
import {EffectComposer, RenderPass, EffectPass, BloomEffect, ToneMappingEffect, ToneMappingMode} from 'postprocessing';
import {createCharacter} from './lib/characters';
import {box, label, material, disposeTree} from './lib/craft';
import {InkPass} from './lib/ink';
import {LensBlur} from './lib/lensblur';
import {Captions} from './Captions';
import {captions, project} from './project';

export type FilmProps = {demo?: boolean; subtitles?: boolean; dpr?: number; noPost?: boolean};
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {const x = clamp(v); return x*x*(3-2*x);};

function wood() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
  const c = canvas.getContext('2d')!;
  c.fillStyle = '#b77650'; c.fillRect(0, 0, 512, 512);
  for (let j = 0; j < 8; j++) {
    c.fillStyle = j % 2 ? '#bd8058' : '#aa6b4b'; c.fillRect(j*64, 0, 62, 512);
    c.strokeStyle = '#754c42'; c.lineWidth = 3; c.beginPath(); c.moveTo(j*64+1, 0); c.lineTo(j*64+1, 512); c.stroke();
    for (let k = 0; k < 6; k++) {
      const x = j*64+8+k*8; c.strokeStyle = k % 2 ? '#9b6249' : '#c48b61'; c.lineWidth = 1.4;
      c.beginPath(); c.moveTo(x,0); c.bezierCurveTo(x+7,170,x-5,310,x+3,512); c.stroke();
    }
  }
  const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.set(2, 2);
  return new THREE.MeshStandardMaterial({map, roughness: .9});
}

function makeSet() {
  const group = new THREE.Group(); const teal = material('#245a61', .88);
  const dark = material('#27374b', .9), cream = material('#e1bb83', .85), brass = material('#b99560', .38, .55);
  box(group, 'floor', [10, .18, 10], [0, -.1, 0], wood());
  box(group, 'back-wall', [10, 6.5, .2], [0, 3.1, -1.8], teal, .04);
  for (let x = -4.5; x < 5; x += .6) box(group, 'wall-batten', [.035, 6, .04], [x, 3, -1.68], dark);
  box(group, 'wainscot', [10, .8, .1], [0, .4, -1.64], dark, .025);
  box(group, 'rail', [10, .065, .12], [0, .85, -1.57], brass, .01);
  box(group, 'sign-frame', [1.9, .72, .12], [-.55, 3.7, -1.5], brass, .04);
  label(group, 'YOUR STORY', 1.76, .57, [-.55, 3.7, -1.425], {background: '#172b3a', color: '#e7c993', fontSize: 100});
  for (const z of [-1.2, -.45]) for (const x of [1.12, 2.05]) box(group, 'desk-leg', [.08, 1.25, .08], [x, .625, z], dark, .025);
  box(group, 'desk-top', [1.4, .12, 1.05], [1.6, 1.3, -.82], wood(), .035);
  box(group, 'lamp-base', [.38, .07, .27], [1.55, 1.4, -.85], brass, .025);
  box(group, 'lamp-stem', [.035, .85, .035], [1.55, 1.84, -.85], brass, .01);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(.31, .38, 24, 1, true), new THREE.MeshStandardMaterial({color: '#efc07b', side: THREE.DoubleSide, roughness: .65}));
  shade.position.set(1.55, 2.3, -.85); shade.castShadow = true; group.add(shade);
  const bulbMaterial = new THREE.MeshStandardMaterial({color: '#ffcf8c', emissive: '#ffad48', emissiveIntensity: 2});
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(.08, 16, 8), bulbMaterial); bulb.position.set(1.55, 2.18, -.85); group.add(bulb);
  // Three foreground books give scale/depth without covering the actor or captions.
  for (let j=0;j<3;j++) box(group, 'book', [.48,.08,.37], [1.63,1.4+j*.085,-.42], material(['#84556b','#d4af6b','#638e8c'][j],.93),.01);
  box(group, 'left-column', [.3,5,.4], [-2.2,2.5,-.3], dark,.03);
  return {group, bulbMaterial};
}

const Scene: React.FC<{time: number; noPost?: boolean}> = ({time, noPost}) => {
  const {gl, scene, camera} = useThree(); const cam = camera as THREE.PerspectiveCamera;
  const set = useMemo(makeSet, []); const actor = useMemo(() => createCharacter('hero', 0), []);
  const fx = useMemo(() => {
    const composer = new EffectComposer(gl, {multisampling: 4, frameBufferType: THREE.HalfFloatType});
    const ink = new InkPass(scene, cam, {color: '#20192b', widthNear: 2.4, widthFar: 1.3, strength: .8, creaseScale: .35});
    const lens = new LensBlur({maxCoC: 8, nearScale: .2, focusBand: .8});
    const bloom = new BloomEffect({intensity: .12, luminanceThreshold: 1.3, mipmapBlur: true});
    const tone = new ToneMappingEffect({mode: ToneMappingMode.NEUTRAL});
    composer.addPass(new RenderPass(scene, cam)); composer.addPass(ink);
    composer.addPass(new EffectPass(cam, lens.pre)); composer.addPass(new EffectPass(cam, lens.main));
    composer.addPass(new EffectPass(cam, bloom, tone));
    return {composer, lens, size: new THREE.Vector2(), last: new THREE.Vector2()};
  }, [gl, scene, cam]);

  // Seeking depends only on time. useFrame below renders this already-authored state.
  cam.layers.enable(3); cam.position.set(1.25 + .25*smooth(time/6), 2.65, 8.5);
  cam.lookAt(.35, 1.75, -.3); cam.fov = 41; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  actor.group.position.set(-.35, 0, .12); actor.setCamera(cam);
  const gesture = smooth((time-2.1)/.38) * (1-smooth((time-4.7)/.4));
  actor.update({time, emotion: time < 2.1 ? 'curious' : time < 4.7 ? 'smile' : 'neutral', gesture: 'ask', gestureAmount: gesture});
  const lightOn = .2 + .8*smooth((time-1.6)/.3);
  set.bulbMaterial.emissiveIntensity = lightOn * 2;
  fx.lens.focus = cam.position.distanceTo(new THREE.Vector3(-.35, 2.1, .12)); fx.lens.cInf = 5;
  gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFShadowMap;
  useFrame(() => {
    gl.getSize(fx.size);
    if (!fx.size.equals(fx.last)) {fx.composer.setSize(fx.size.x, fx.size.y); fx.last.copy(fx.size);}
    if (noPost) {gl.autoClear = true; gl.setRenderTarget(null); gl.render(scene, cam);}
    else {gl.autoClear = false; fx.composer.render(1/30);}
    gl.getContext().finish();
  }, 1);
  useEffect(() => () => {fx.composer.dispose();}, [fx]);
  useEffect(() => () => {actor.dispose(); disposeTree(set.group);}, [actor, set]);
  return <>
    <color attach="background" args={['#182637']} />
    <fog attach="fog" args={['#273d51', 18, 45]} />
    <hemisphereLight args={['#91a9d3', '#504047', 1.5]} />
    <directionalLight position={[-3, 5, 4]} intensity={2.5} color="#ffe0ac" castShadow
      shadow-mapSize={[1024,1024]} shadow-camera-left={-5} shadow-camera-right={5}
      shadow-camera-top={6} shadow-camera-bottom={-2} shadow-normalBias={.025} />
    <pointLight position={[1.55,2.15,-.8]} intensity={18*lightOn} color="#ffc078" distance={7} decay={2} castShadow shadow-mapSize={[512,512]} shadow-normalBias={.025} />
    <primitive object={set.group} /><primitive object={actor.group} />
  </>;
};

export const Film: React.FC<FilmProps> = ({demo=true, subtitles=true, dpr=1, noPost=false}) => {
  const frame = useCurrentFrame(); const {fps, durationInFrames} = useVideoConfig();
  const t = frame/fps; const ending = clamp((durationInFrames-1-frame)/8);
  const audio = project.mixFile ?? project.narrationFile;
  return <AbsoluteFill style={{background: '#171f30'}}>
    <ThreeCanvas width={1080} height={1920} dpr={dpr} shadows camera={{fov:37, near:.08, far:80}}
      gl={{antialias:false, stencil:false, toneMapping:THREE.NoToneMapping, outputColorSpace:THREE.SRGBColorSpace}}>
      <Scene time={t} noPost={noPost} />
    </ThreeCanvas>
    {subtitles && <Captions time={t} groups={captions} />}
    {!demo && audio && <Audio src={staticFile(audio)} />}
    {ending < 1 && <AbsoluteFill style={{background:'#000', opacity:1-ending}} />}
  </AbsoluteFill>;
};
