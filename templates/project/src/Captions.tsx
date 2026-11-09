import React from 'react';
import {CaptionGroup} from './project';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const Captions: React.FC<{time: number; groups: CaptionGroup[]}> = ({time, groups}) => {
  const g = groups.find(v => time >= v.start && time < v.end);
  if (!g) return null;
  const enter = clamp((time - g.start) / .1);
  const exit = clamp((g.end - time) / .07);
  const ease = enter * enter * (3 - 2 * enter);
  return <div style={{position: 'absolute', top: `${g.top ?? 83}%`, left: 90, right: 90,
    textAlign: 'center', pointerEvents: 'none'}}>
    <span style={{display: 'inline-block', maxWidth: '100%', fontFamily: 'Arial, sans-serif',
      fontSize: 42, fontWeight: 800, lineHeight: 1.15, color: g.emphasis ? '#fbd48a' : '#fff7e8',
      textShadow: '0 2px 0 #211a30,2px 0 0 #211a30,-2px 0 0 #211a30,0 -2px 0 #211a30,0 4px 7px #171126a0',
      opacity: Math.min(enter, exit), transform: `translateY(${(1 - ease) * 6}px)`}}>{g.text}</span>
  </div>;
};
