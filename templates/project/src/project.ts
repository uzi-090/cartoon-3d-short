export const project = {
  fps: 30,
  durationInFrames: 180,
  // Relative to public/. Configure only after the user supplies the recording.
  narrationFile: null as string | null,
  mixFile: null as string | null,
};

export type CaptionGroup = {
  text: string;
  start: number;
  end: number;
  emphasis?: boolean;
  top?: number;
};

// Technical demo text, not a transcript or an approved story.
export const captions: CaptionGroup[] = [
  {text: 'A graphic character.', start: 0.3, end: 1.85, top: 88},
  {text: 'A dimensional world.', start: 2.05, end: 3.65, top: 88},
  {text: 'Your story goes here.', start: 4.1, end: 5.65, emphasis: true, top: 88},
];
