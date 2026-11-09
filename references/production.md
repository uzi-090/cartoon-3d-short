# Production and starter operation

## Set up a new project

The root is a portable skill, not an npm application. Copy its starter into a separate destination:

```sh
node /path/to/cartoon-3d-short/scripts/init-project.mjs /path/to/my-short
cd /path/to/my-short
npm ci
npm run check
npm run still -- 90
npm run demo
```

The initializer refuses existing destinations. Node 22+ with npm is the supported baseline. The included lockfile records a tested dependency set; keep all Remotion packages on the same version. Check official APIs before upgrades. Renderer browser download needs network access unless `BROWSER_EXECUTABLE` points to a compatible local Chrome/Chromium. On Linux, Chromium may also need system libraries; use [Remotion's setup documentation](https://www.remotion.dev/docs/renderer) for the actual environment.

`REMOTION_TMP` overrides the default `tmp/` inside the new project. The renderer also sets `TEMP` and `TMP` before importing the bundler so copies do not unexpectedly fill the system drive. Keep `public/` small: each bundle can duplicate it. Do not sweep shared temp folders or recursively remove a computed path. Cleanup is separate from delivery and must follow the host's permission and path-safety rules.

## Project records

Create concise project-specific records as they become useful:

- `BRIEF.md`: premise, fiction/fact, genre, language, output, preferences and phase.
- `SCRIPT.md`: spoken script, separate expression/visual notes, factual sources and uncertainties.
- `PRODUCTION.md`: shot/frame table, action phases, camera targets, lights, contact and cue ownership.
- `STATE.md`: completed work, pending user input, remaining issues and next concrete action.
- `REVIEW.md`: rendered artifacts, inspected ranges, fixes, technical results and limits.

Keep local paths, source identities and one-film facts here rather than adding them as universal skill requirements. These documents are authored for the current production; the template does not pretend to contain a ready-made new story.

## Render-path example

`src/Film.tsx` builds a six-second silent technical demo with an original graphic actor, layered textured set, an animated practical light, a deliberately eased gesture and compact sample captions. `characters.ts` handles authored views and grip anchors. `ink.ts` and `lensblur.ts` provide optional contours and focus. `project.ts` defines duration, fps, captions and supplied audio paths.

Time-dependent state comes from `useCurrentFrame()`. Any render callback draws that state; it must not advance the animation. Construct/dispose resources deliberately. Recreating a composer or camera must not dispose an actor's textures. Re-upload persistent CanvasTextures when necessary; a held pose must still render after a renderer interruption.

The example composer order is scene → world ink → lens pre/main → restrained bloom → neutral tone map. Exclude self-inked actors/labels from world ink using layer 3. Scale pixel effects with actual render size. Compare post on/off and inspect the final shader's local light response. Do not treat example strengths as acceptance values.

## Recording to final film

After the user supplies narration, preserve a source copy under private `voice/` and copy the delivery asset under `public/`. Inspect and align it as described in [voiceover-audio.md](voiceover-audio.md). Configure `narrationFile`, optional `mixFile` and `durationInFrames` in `src/project.ts`; replace the demonstration scene/timing with the actual authored story. Configure captions against corrected word timing.

Render selected look frames, a short motion proof and the final only after the relevant proofs are sound:

```sh
npm run still -- 90
npm run demo
npm run render
```

`still` produces a 720×1280 preview. `demo` exports only the silent technical composition at 720×1280. `render` exports `Movie` at 1440×2560, with H.264/yuv420p, BT.709 and AAC; it refuses when the supplied narration path is missing. It does not magically replace the demonstration content: the agent must implement the story before delivery. `BROWSER_EXECUTABLE`, optional `REMOTION_GL`, and `REMOTION_TMP` are environment overrides. Concurrency is 1 by default for modest GPUs.

## Review and deliver

Use [review.md](review.md). FFmpeg and ffprobe can be installed separately or provided via `FFMPEG`/`FFPROBE` paths to the helper. The QA helper writes metadata, candidate freeze/black intervals, a full decode result, audio metrics and chronological sheets; it does not assess the story or certify aesthetics.

```sh
python scripts/review-video.py out/movie.mp4 --out out/review
```

The helper requires Python 3.10+, FFmpeg/ffprobe and Pillow. It is optional if equivalent review tooling exists. Inspect flags and actual encoded frames; intentional silence, black fades and holds may be correct. Delivery includes the final MP4, a concise report of checks/limitations and requested editable source. The public skill does not include the user's recordings, and a source handoff should follow their requested scope.
