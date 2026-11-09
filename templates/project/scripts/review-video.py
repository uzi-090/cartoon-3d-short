"""Inspect the encoded output. Candidate detectors and sheets are not aesthetic approval."""
import argparse
import json
import math
import os
from pathlib import Path
import subprocess
import sys


def run(args):
    return subprocess.run(args, text=True, capture_output=True, encoding="utf-8", errors="replace")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("video", type=Path)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--every", type=int, default=15, help="Sheet frame stride; use 1 for every frame")
    args = parser.parse_args()
    if not args.video.is_file() or args.every < 1:
        parser.error("Provide an existing video and a positive frame stride.")
    if args.out.exists() and any(args.out.iterdir()):
        parser.error("Use a fresh output folder to avoid stale review artifacts.")
    args.out.mkdir(parents=True, exist_ok=True)
    from PIL import Image, ImageDraw
    ffmpeg, ffprobe = os.getenv("FFMPEG", "ffmpeg"), os.getenv("FFPROBE", "ffprobe")
    probe = run([ffprobe, "-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", str(args.video)])
    if probe.returncode:
        raise RuntimeError(probe.stderr)
    metadata = json.loads(probe.stdout)
    video = next(s for s in metadata["streams"] if s["codec_type"] == "video")
    has_audio = any(s["codec_type"] == "audio" for s in metadata["streams"])
    decode = run([ffmpeg, "-hide_banner", "-v", "error", "-xerror", "-i", str(args.video), "-map", "0:v:0", "-map", "0:a?", "-f", "null", "-"])
    flags = run([ffmpeg, "-hide_banner", "-i", str(args.video), "-vf", "blackdetect=d=0.1:pix_th=0.02,freezedetect=n=-50dB:d=0.6", "-an", "-f", "null", "-"])
    (args.out / "candidates.txt").write_text(flags.stderr, encoding="utf-8")
    if has_audio:
        levels = run([ffmpeg, "-hide_banner", "-i", str(args.video), "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"])
        (args.out / "audio-metrics.txt").write_text(levels.stderr, encoding="utf-8")
    thumbs = args.out / "thumbs"
    thumbs.mkdir()
    selection = f"select=not(mod(n\\,{args.every})),scale=180:-2"
    extracted = run([ffmpeg, "-hide_banner", "-v", "error", "-i", str(args.video), "-vf", selection, "-fps_mode", "vfr", str(thumbs / "frame-%06d.png")])
    if extracted.returncode:
        raise RuntimeError(extracted.stderr)
    images = sorted(thumbs.glob("frame-*.png"))
    for page in range(math.ceil(len(images)/16)):
        batch = images[page*16:(page+1)*16]
        with Image.open(batch[0]) as first:
            w, h = first.size
        sheet = Image.new("RGB", (w*4, (h+24)*4), "#181d2a")
        draw = ImageDraw.Draw(sheet)
        for j, filename in enumerate(batch):
            x, y = (j%4)*w, (j//4)*(h+24)
            with Image.open(filename) as frame:
                sheet.paste(frame.convert("RGB"), (x,y+24))
            source_frame = (page*16+j)*args.every
            draw.text((x+5,y+5), f"frame {source_frame}", fill="white")
        sheet.save(args.out/f"sheet-{page+1:03d}.jpg", quality=90)
    result = {"video": str(args.video.resolve()), "metadata": metadata,
              "decode_ok": decode.returncode == 0, "decode_errors": decode.stderr,
              "candidate_scan_ok": flags.returncode == 0,
              "sheet_stride_frames": args.every, "sheet_tiles": len(images),
              "reported_frame_count": video.get("nb_read_frames"),
              "coverage_note": "Chronological sheet tiles at the stated stride; not native playback or subjective audio review.",
              "audio_present": has_audio}
    (args.out/"report.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps({k:v for k,v in result.items() if k!="metadata"}, indent=2))
    return 0 if decode.returncode == 0 and flags.returncode == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
