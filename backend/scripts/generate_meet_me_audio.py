"""
One-shot script: generate the Meet-Me intro audio.
Steps:
  1. OpenAI TTS (onyx voice) → /tmp/voice.mp3
  2. Download a royalty-free cyberpunk/lo-fi loop → /tmp/bg.mp3
  3. ffmpeg mix (voice on top, music ducked) → /app/frontend/public/audio/meet-me.mp3

Run:  python /app/backend/scripts/generate_meet_me_audio.py
"""
import asyncio
import os
import subprocess
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.openai import OpenAITextToSpeech

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

SCRIPT = (
    "Hey, I'm Chandan Gowda. I'm a Gen-A-I Data Engineer with three years "
    "of experience building real production systems. I design AI agents in "
    "Microsoft Copilot Studio and Google AI Studio. I architect R-A-G "
    "pipelines with local L-L-Ms and Groq. And I build the data pipelines "
    "that feed them. From healthcare AI agents to a full internal video "
    "platform with a R-A-G chatbot — I take ideas from prompt to "
    "production. I'm certified across AWS, Databricks, Google Cloud and "
    "Oracle Cloud. If you're building something intelligent, let's talk."
)

OUT_DIR = Path("/app/frontend/public/audio")
OUT_DIR.mkdir(parents=True, exist_ok=True)
VOICE_PATH = Path("/tmp/voice.mp3")
BG_PATH = Path("/tmp/bg.wav")
FINAL_PATH = OUT_DIR / "meet-me.mp3"


async def generate_voice():
    print("➤ Generating TTS …")
    api_key = os.environ["EMERGENT_LLM_KEY"]
    tts = OpenAITextToSpeech(api_key=api_key)
    audio = await tts.generate_speech(
        text=SCRIPT,
        model="tts-1-hd",
        voice="onyx",
        speed=1.0,
        response_format="mp3",
    )
    VOICE_PATH.write_bytes(audio)
    print(f"   ✓ Voice saved → {VOICE_PATH} ({VOICE_PATH.stat().st_size//1024} KB)")


def synthesize_bg(duration: float):
    """
    Synthesize an UPLIFTING, bright cyber-tech bed using ffmpeg oscillators.
    Key: C major. Layered:
      - Sub bass: C2 (65.4 Hz)
      - Triad pad: C4 (261.6) + E4 (329.6) + G4 (392.0) — C major triad
      - High shimmer: C6 (1046.5) with slow vibrato + flanger
      - 4-on-the-floor rhythmic pulse via amplitude modulation @ ~2 Hz (120 BPM feel)
      - Light airy noise wash for "tech" texture
    Treated with stereo echo, lowpass, fades, gentle compression and loudnorm.
    """
    print("➤ Synthesizing UPLIFTING background music with ffmpeg …")
    d = duration
    cmd = [
        "ffmpeg", "-y",
        # Sources — C-major triad + sub bass + high shimmer + air noise
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=65.4:sample_rate=44100",      # C2 bass
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=261.63:sample_rate=44100",    # C4
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=329.63:sample_rate=44100",    # E4
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=392.00:sample_rate=44100",    # G4
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=1046.50:sample_rate=44100",   # C6 shimmer
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=523.25:sample_rate=44100",    # C5 melodic
        "-f", "lavfi", "-t", str(d), "-i", "anoisesrc=color=white:amplitude=0.02:sample_rate=44100",
        "-filter_complex",
        # Bass — steady warm low end with very slow tremolo
        "[0:a]volume=0.45,tremolo=f=0.5:d=0.25[bass];"
        # Pad triad — each note with subtle vibrato + gentle 2 Hz pulse (4-on-the-floor at 120 BPM)
        "[1:a]vibrato=f=0.3:d=0.4,tremolo=f=2:d=0.35,volume=0.18[c4];"
        "[2:a]vibrato=f=0.3:d=0.4,tremolo=f=2:d=0.35,volume=0.16[e4];"
        "[3:a]vibrato=f=0.3:d=0.4,tremolo=f=2:d=0.35,volume=0.16[g4];"
        # Melodic C5 — rhythmic arpeggio feel via tremolo at 1 Hz
        "[5:a]vibrato=f=0.6:d=0.5,tremolo=f=1:d=0.7,volume=0.10[mel];"
        # High shimmer — slow vibrato + flanger, very quiet, brings sparkle
        "[4:a]vibrato=f=0.5:d=0.6,flanger=delay=6:depth=2:speed=0.4,volume=0.06[shim];"
        # Air noise — high-pass for breath/air feel
        "[6:a]highpass=f=2000,lowpass=f=8000,volume=0.6[air];"
        # Mix
        "[bass][c4][e4][g4][mel][shim][air]amix=inputs=7:normalize=0[mix1];"
        # Stereo widening + soft compression + cap brightness + fades + loudnorm
        "[mix1]aecho=0.5:0.7:55|110:0.22|0.16,"
        "acompressor=threshold=-20dB:ratio=2.5:attack=10:release=120,"
        "lowpass=f=7500,"
        f"afade=t=in:st=0:d=2.5,afade=t=out:st={d-2.5}:d=2.5,"
        "loudnorm=I=-19:TP=-2.5:LRA=8[out]",
        "-map", "[out]",
        "-c:a", "pcm_s16le",
        str(BG_PATH),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(res.stderr[-2000:])
        raise RuntimeError("ffmpeg synth failed")
    print(f"   ✓ Synth saved → {BG_PATH} ({BG_PATH.stat().st_size//1024} KB)")


def mix():
    print("➤ Mixing voice + music with ffmpeg …")
    # Get voice duration
    dur_cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration",
               "-of", "default=noprint_wrappers=1:nokey=1", str(VOICE_PATH)]
    voice_dur = float(subprocess.check_output(dur_cmd).strip())
    final_dur = voice_dur + 2.0  # short tail after voice ends
    print(f"   voice={voice_dur:.1f}s → final={final_dur:.1f}s")

    # 1) Synthesize background tuned to final_dur
    synthesize_bg(final_dur)

    cmd = [
        "ffmpeg", "-y",
        "-i", str(VOICE_PATH),
        "-i", str(BG_PATH),
        "-filter_complex",
        # Voice: clarity EQ + light compression + slight reverb tail
        "[0:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,"
        "highpass=f=80,lowpass=f=12000,"
        "acompressor=threshold=-18dB:ratio=3:attack=5:release=80,"
        "volume=1.15[v];"
        # Music: gentle duck under voice
        f"[1:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,"
        f"volume=0.28[m];"
        # Mix
        "[v][m]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0[mix];"
        "[mix]loudnorm=I=-16:TP=-1.5:LRA=11[out]",
        "-map", "[out]",
        "-t", str(final_dur),
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(FINAL_PATH),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(res.stderr[-2000:])
        raise RuntimeError("ffmpeg mix failed")
    print(f"   ✓ Final → {FINAL_PATH} ({FINAL_PATH.stat().st_size//1024} KB)")


async def main():
    if VOICE_PATH.exists() and os.environ.get("SKIP_TTS") == "1":
        print(f"➤ Skipping TTS (using cached {VOICE_PATH})")
    else:
        await generate_voice()
    mix()
    print(f"\n✅ Done: {FINAL_PATH}")


if __name__ == "__main__":
    asyncio.run(main())
