import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {project} from './project';

export const Root: React.FC = () => <>
  <Composition id="StyleDemo" component={Film} width={1080} height={1920}
    fps={30} durationInFrames={180} defaultProps={{demo: true, subtitles: true, dpr: 1}} />
  <Composition id="Movie" component={Film} width={1080} height={1920}
    fps={project.fps} durationInFrames={project.durationInFrames}
    defaultProps={{demo: false, subtitles: true, dpr: 1}} />
</>;
