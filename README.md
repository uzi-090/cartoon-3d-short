# Cartoon 3D Short

**A complete story-to-animation skill for Codex and Claude Code.**

Use this skill to make original vertical cartoon videos: outlined graphic characters, colorful 3D environments, expressive acting, purposeful camera movement, simple animated subtitles and reviewed video exports. It supports romance, philosophy, history, suspense, comedy, explainers and other story genres.

**You provide the voiceover manually.** Record it yourself or generate it with an AI voice service such as ElevenLabs, then give the audio file to your agent. The skill helps develop the story and script first, waits for your recording, and builds the animation around its actual timing. No voice API key is required by this skill, and it does not generate narration automatically.

## How it works

1. Tell the agent your topic, or ask it to suggest ideas. It asks only the questions needed to establish the story and your preferences.
2. Choose the idea and review the script. Expression tags are separate from visual production notes.
3. Supply your own or AI-generated voiceover as an audio file.
4. The agent plans shots against the recording and establishes the character, environment, lighting and motion.
5. It creates the animation, adds compact subtitles and sound, reviews the encoded output and delivers an MP4.

If you already have a script or audio, start there. You can request a preview checkpoint. Storyboards are optional and created only when requested. Generating a video still takes coding, rendering time and visual judgment; this is a reusable workflow with starter code, not a hosted one-click video service.

## Install

The same `SKILL.md` works in Codex and Claude Code. Clone the repository into the appropriate skill directory, or download the ZIP and extract it so the directory named `cartoon-3d-short` contains `SKILL.md`, `references/`, `scripts/` and `templates/`.

### Codex

Ask Codex:

> Install the skill from https://github.com/uzi-090/cartoon-3d-short

For manual personal installation:

```sh
git clone https://github.com/uzi-090/cartoon-3d-short.git ~/.agents/skills/cartoon-3d-short
```

For a project, use `.agents/skills/cartoon-3d-short/`. Some older Codex installations use `~/.codex/skills/`; use the directory supported by your installation and avoid duplicate copies with the same name. See the [official Codex skill documentation](https://learn.chatgpt.com/docs/build-skills).

Invoke it with:

> Use $cartoon-3d-short to help me make a romantic cartoon short. Ask me about the story first. I will provide the voiceover after we agree on the script.

### Claude Code

```sh
git clone https://github.com/uzi-090/cartoon-3d-short.git ~/.claude/skills/cartoon-3d-short
```

For a project, use `.claude/skills/cartoon-3d-short/`. Invoke `/cartoon-3d-short` or ask Claude to use the skill by name. See the [official Claude Code skill documentation](https://code.claude.com/docs/en/skills).

This production setup targets coding agents with filesystem, terminal, dependency installation and browser rendering access. A chat-only environment may help with a script but cannot run this full rendering pipeline without those capabilities.

## Example requests

> Use cartoon-3d-short. Suggest five easy-to-understand story ideas across romance, history and philosophy. Give a hook, short progression and ending for each. No storyboards yet.

> Use cartoon-3d-short. Here is my approved script and voiceover. Make a colorful nighttime animation with the established graphic body style, subtle subtitles and expressive acting. Show an integrated test frame and motion clip before the full render.

> Continue this cartoon-3d-short project from its production state. Preserve the supplied voiceover's pace and fix the remaining lighting and prop-contact problems.

## Runnable starter

You need Node.js 22 or later with npm, and a browser capable of WebGL2. FFmpeg/ffprobe are used for recording inspection and delivery QA. Transcription can use a local tool; `faster-whisper` is optional and is not bundled. Allow adequate disk space for dependencies, renders and bundle copies.

From the cloned skill directory:

```sh
node scripts/init-project.mjs /path/to/my-short
cd /path/to/my-short
npm ci
npm run check
npm run still -- 90
npm run demo
```

On Windows use a normal absolute path, for example `D:/Videos/my-short`. Optionally set `BROWSER_EXECUTABLE` to your Chrome/Chromium executable. Otherwise the Remotion renderer manages its browser. Set `REMOTION_TMP` to a roomy project-specific temp directory if needed.

The six-second **silent StyleDemo** demonstrates the rendering path; it is not a complete story or a promise of the final art quality. The agent should author the cast, sets and acting for your story. The starter refuses the final-film render command until a supplied narration file has been configured. Read [the production guide](references/production.md) for the recording handoff and export commands.

## What is included

| Resource | Purpose |
| --- | --- |
| `SKILL.md` | Portable instructions and staged conversation workflow |
| `references/` | Story, reference study, art, camera/acting, audio, captions, production and review guidance |
| `templates/project/` | Working Three.js + Remotion starter and original graphic actor library |
| `scripts/` | Safe project initialization, resource validation and skill ZIP packaging |
| `evals/scenarios.md` | Behavioral maintenance checks |

The package includes no private inspiration videos, extracted reference frames, transcripts, personal voice recordings, secret keys or paid assets. It does not depend on the creator's local drives or previous film projects.

For the performed checks and their limits, see [validation notes](docs/validation.md).

## Quality and limitations

Expect deliberate iteration on silhouettes, light, material separation, contact, readable evidence and motion. Native details, short action sequences and the actual encoded film must be inspected. Valid codecs and attractive thumbnails alone do not establish a good animation. No skill can guarantee identical output across agents, GPUs or stories, or guarantee retention, views or virality.

The instructions and original additions are MIT licensed. Some ink/lens engineering is adapted from [mromidev/claude-animated-shorts](https://github.com/mromidev/claude-animated-shorts); its MIT notice is retained in [LICENSE](LICENSE). No reference media from that repository is redistributed. Dependencies keep their own terms; in particular, check [Remotion's current license](https://www.remotion.dev/license) for your use case.
