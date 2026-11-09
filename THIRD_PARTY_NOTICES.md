# Attribution and dependencies

This skill was developed by Uzair (`uzi-090`) from an iterative original cartoon production workflow. Its starting point was the MIT-licensed [mromidev/claude-animated-shorts](https://github.com/mromidev/claude-animated-shorts). The world ink and lens-effect engineering in `templates/project/src/lib/ink.ts` and `lensblur.ts` are adapted from that code. The upstream copyright and MIT terms are retained in `LICENSE` and copied into initialized projects as `SKILL_LICENSE`.

The starter's graphic actor artwork, room, procedural textures, example animation and new workflow guidance are original additions. No upstream/private inspiration frames, video clips, scripts, transcripts or audio recordings are included. The starter uses system fonts and programmatically created geometry and textures, with no downloaded model pack.

Dependencies are installed separately through npm and retain their own licenses. Three.js, React, React Three Fiber, postprocessing and TypeScript are third-party projects; inspect the dependency license files if redistributing their software. Remotion has its own [license terms](https://www.remotion.dev/license), which are not replaced by this repository's MIT license. The Three.js `RoundedBoxGeometry` import remains part of Three.js. FFmpeg/ffprobe, Python, Pillow and optional transcription tools are external tools with their own terms.

User recordings and generated films belong to their respective rights holders. The skill's license does not grant rights to a reference video, music, a voice identity, trademarks, third-party characters or user inputs.
