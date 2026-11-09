---
name: cartoon-3d-short
description: Create original vertical cartoon story animations with outlined graphic characters in dimensional Three.js environments rendered with Remotion. Use for animated short stories, history, philosophy, romance, explainers, or this established cartoon style. Guides story questions, scripts, user-supplied voiceover, acting, camera, lighting, compact subtitles and reviewed video export.
---

# Cartoon 3D Short

Make an original, understandable story short with authored graphic characters, colorful dimensional sets and purposeful acting. This is a production skill for a coding agent with a terminal and a working browser/WebGL renderer. It does not grant tools, generate a finished film from instructions alone, or promise views or a reference match.

## Start at the user's current phase

Read the existing brief, script, audio and project state before asking questions. Do not make users repeat settled choices. Ask only consequential missing questions, preferably together: topic or help choosing one, fiction versus researched fact, genre/emotion, language, rough duration/platform, and important character/style preferences. Offer a sensible default when a preference is optional. If asked only for ideas, give short hook/middle/payoff descriptions and stop there. Do not make storyboard artwork unless requested.

Use these phases; continue work already authorized within the current phase:

1. **Story.** Read [story-development.md](references/story-development.md). Develop the chosen premise or offer a few varied ideas. Verify factual claims. Test the causal outline and ending, then write conversational narration. Separate spoken text from camera/SFX notes; add only useful expression tags. Present the script for the user's recording handoff.
2. **User supplies voiceover.** The user must provide the narration manually, as their own recording or an AI-generated audio file from a service they choose. Ask for MP3/WAV/M4A after script agreement and **wait for it before timed production**. Do not call a TTS service, invent access to a voice API, or substitute a synthetic narrator. If audio is already supplied, use it. See [voiceover-audio.md](references/voiceover-audio.md).
3. **Timed production plan.** Inspect and transcribe the recording, correct timings, then define shot frames, acting, reveals, camera and subtitle groups. Preserve its words and pace. Read [production.md](references/production.md); initialize a separate project with the bundled starter if useful.
4. **Establish the look and motion.** Read [art-direction.md](references/art-direction.md) and [animation-camera.md](references/animation-camera.md). Make the relevant character views, integrated set/light frame and short action proof through the real rendering path before a long render. Show any preview before referring to it in a question. Resolve weak design here. If the user requests a review checkpoint, honor it; otherwise continue authorized production without repeated confirmations.
5. **Build and finish.** Implement deterministic Three.js animation inside Remotion. Add compact subtitles using [captions.md](references/captions.md), then a voice-first mix. Render and review the encoded film using [review.md](references/review.md). Deliver the MP4 and requested source with honest verification coverage.

## Visual identity

Default to the established family: broad, authored bean-shaped heads; small rounded torsos; thin flowing stick arms and legs; tiny dot palms; flat feet; dark variable-weight ink; original faces, hair and costumes. Use coherent front/three-quarter/back art, not a front face pasted through a turn. Keep this family while improving acting, materials, lighting and environment depth. A user's explicit new art direction can change it.

The dimensional world has deliberate color areas, readable construction, material-specific shading, support/contact shadows and selected contours. Motivated local light must affect both characters and world. Bloom, blur, extra geometry and global saturation cannot repair weak silhouettes or staging. The included actor library and test room are engineering examples, not a required cast or final film design.

Default delivery is 9:16, 30 fps, 1440×2560 H.264/yuv420p with AAC audio; confirm or adapt when the user requests something else. English is a starter default, not a restriction on other languages. Duration follows the story and supplied audio rather than a forced minute.

## Working rules

- Use original story, characters and production assets. For supplied references, read [reference-study.md](references/reference-study.md); keep videos, frames, audio and transcripts private. Do not infer their hidden tools/rigs as facts.
- Keep voice recordings byte-for-byte as source assets. No time stretch, pitch shift, silent rewrite or narration replacement without the user's request. Intentional mixing changes must be documented.
- Keep decisions, sources, shot timing, checks and unresolved issues in project files. Completed films stay closed unless the user requests changes.
- Prefer useful independent review when available and authorized by the host. There is no required agent count or model. Assign file ownership and serialize GPU rendering if parallel work is used. Never claim a check another agent did not perform.
- Use a roomy project-specific temp directory; honor `REMOTION_TMP`, `TEMP` and `TMP`. Do not sweep shared temp folders or publish private inputs. No upload to a video platform or paid service is implied by creating a film.
- Technical integrity and visual/story quality are separate. A valid export, legacy numeric score or contact sheet alone does not prove a polished film. Report limits plainly.

## Bundled resources

- `templates/project/`: runnable React/Three.js/Remotion starter with original graphic actors, a textured room, real lights, ink/lens effects, deterministic animation and subtitle component. The silent `StyleDemo` is a technical example, not a new user's approved story.
- `scripts/init-project.mjs`: copy the starter into a new project without overwriting an existing folder.
- `scripts/package-skill.mjs`: make an installable ZIP containing the portable skill and resources; excludes generated output and private production inputs.
- `scripts/validate-package.mjs`: check local resource links and packaging boundaries.
- [evals/scenarios.md](evals/scenarios.md): realistic behavior checks for future maintenance.

Install and usage instructions are in [README.md](README.md). Use only capabilities actually available in the current Codex or Claude Code environment. Refer to current official documentation for changed dependencies instead of guessing API behavior.
