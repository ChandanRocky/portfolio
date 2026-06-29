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
    Synthesize a cyberpunk / dark-ambient bed using ffmpeg oscillators.
    Layered:
      - Deep sine bass (55 Hz w/ slow LFO)
      - Mid synth pad (220 Hz + 277 Hz fifth, slow vibrato)
      - High shimmer (880 Hz, very low volume + flanger)
      - Pulse beat (kick-like) every 0.6s
    Plus reverb-ish delay & lowpass for that "lo-fi tech" feel.
    """
    print("➤ Synthesizing background music with ffmpeg …")
    d = duration
    cmd = [
        "ffmpeg", "-y",
        # Sources
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=55:sample_rate=44100",
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=220:sample_rate=44100",
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=277.18:sample_rate=44100",
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=880:sample_rate=44100",
        "-f", "lavfi", "-t", str(d), "-i", "anoisesrc=color=brown:amplitude=0.04:sample_rate=44100",
        "-filter_complex",
        # Bass with slow tremolo
        "[0:a]volume=0.55,tremolo=f=0.25:d=0.4[bass];"
        # Pad: fifth, slow vibrato
        "[1:a]vibrato=f=0.6:d=0.5,volume=0.22[pad1];"
        "[2:a]vibrato=f=0.5:d=0.5,volume=0.18[pad2];"
        # Shimmer with flanger
        "[3:a]flanger=delay=10:depth=2:speed=0.3,volume=0.05[shim];"
        # Subtle noise wash for grit
        "[4:a]highpass=f=400,lowpass=f=3000,volume=0.5[grit];"
        # Mix all
        "[bass][pad1][pad2][shim][grit]amix=inputs=5:normalize=0[mix1];"
        # Add stereo width via aecho
        "[mix1]aecho=0.6:0.8:60|120:0.25|0.18,lowpass=f=6500,"
        f"afade=t=in:st=0:d=2.0,afade=t=out:st={d-2.5}:d=2.5,"
        "loudnorm=I=-20:TP=-3:LRA=8[out]",
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
    await generate_voice()
    mix()
    print(f"\n✅ Done: {FINAL_PATH}")


if __name__ == "__main__":
    asyncio.run(main())
