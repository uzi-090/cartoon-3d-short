# Validation notes

Checked on 9 November 2026 before initial publication.

- Portable skill frontmatter passed the Codex skill validator.
- Local Markdown resource links and matching Remotion package versions passed the package validator.
- Public source boundaries were checked: no bundled reference media, personal recordings, detected credential patterns, symlinks or creator-specific absolute paths.
- A separate project was initialized from the starter and installed with `npm ci --ignore-scripts` from its lockfile, independent of earlier film projects. Both the template and fresh project passed TypeScript checks.
- The initializer rejected an existing destination without overwriting it.
- The final-film render command rejected missing manually supplied narration before bundling.
- A still and the complete silent `StyleDemo` rendered using the fresh project, Chrome/WebGL and Node 24 on Windows. The encoded output was 720×1280, H.264/yuv420p, 30 fps, 180 frames, 6.000 seconds, with no audio as intended.
- FFmpeg decoded every frame without errors. The review helper generated all 180 chronological sheet tiles. Selected sheets covering the opening, gesture transition, held pose and opaque ending fade, plus the rendered still, were visually inspected. Candidate freeze intervals were consistent with the deliberately quiet parts of this technical example.
- ZIP file integrity and required resource coverage are checked separately when packaging the release.

This is a render-path and packaging smoke test, not a claim of exhaustive native playback, subjective audio listening, a final story's quality, a measured reference match or audience retention. The complete workflow has not been independently forward-tested across every model, GPU, operating system or Claude Code environment. Claude Code compatibility is based on the portable skill format and documented installation layout; the actual starter render described above ran locally under Codex.

The GitHub workflow validates public resources and type-checks the installed starter. Browser/GPU rendering remains an environment-dependent check; it is not silently claimed by a passing type check.
