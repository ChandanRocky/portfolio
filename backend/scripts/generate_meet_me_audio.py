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
    Synthesize an UPLIFTING cyber-tech bed WITH DRUMS using ffmpeg.
    Key: C major. Tempo: 120 BPM (beat = 0.5s, 4 beats per 2s bar).
    
    Drums:
      - Kick:   4-on-the-floor, every 0.5s   (60 Hz sine, exp decay)
      - Snare:  beats 2 & 4 in each bar       (white noise band-passed @ 2 kHz)
      - Hi-hat: 8th notes, every 0.25s        (white noise high-passed @ 8 kHz)
    
    Music:
      - Sub bass C2 (65.4)
      - Triad pad C4 + E4 + G4 (C major)
      - High shimmer C6
      - Air noise wash
    """
    print("➤ Synthesizing UPLIFTING music + DRUMS with ffmpeg …")
    d = duration
    # Build a single-bar (2s) repeat to keep things clean
    cmd = [
        "ffmpeg", "-y",
        # --- Music sources ---
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=65.4:sample_rate=44100",      # 0 C2 bass
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=261.63:sample_rate=44100",    # 1 C4
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=329.63:sample_rate=44100",    # 2 E4
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=392.00:sample_rate=44100",    # 3 G4
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=1046.50:sample_rate=44100",   # 4 C6 shimmer
        "-f", "lavfi", "-t", str(d), "-i", "anoisesrc=color=white:amplitude=0.02:sample_rate=44100",  # 5 air
        # --- Drum sources ---
        "-f", "lavfi", "-t", str(d), "-i", "sine=frequency=60:sample_rate=44100",         # 6 kick tone
        "-f", "lavfi", "-t", str(d), "-i", "anoisesrc=color=white:amplitude=1:sample_rate=44100",  # 7 snare noise
        "-f", "lavfi", "-t", str(d), "-i", "anoisesrc=color=white:amplitude=1:sample_rate=44100",  # 8 hat noise
        "-filter_complex",
        # ---------- MUSIC ----------
        "[0:a]volume=0.40,tremolo=f=0.5:d=0.25[bass];"
        "[1:a]vibrato=f=0.3:d=0.4,volume=0.16[c4];"
        "[2:a]vibrato=f=0.3:d=0.4,volume=0.14[e4];"
        "[3:a]vibrato=f=0.3:d=0.4,volume=0.14[g4];"
        "[4:a]vibrato=f=0.5:d=0.6,flanger=delay=6:depth=2:speed=0.4,volume=0.05[shim];"
        "[5:a]highpass=f=2000,lowpass=f=8000,volume=0.5[air];"
        # ---------- DRUMS ----------
        # Kick: 4-on-the-floor at 120 BPM (every 0.5s). Tight exponential decay.
        # Add a sub thump by low-pass + boost. Light intro fade so it doesn't slam in.
        "[6:a]volume='1.6*exp(-14*mod(t\\,0.5))':eval=frame,"
        "lowpass=f=120,volume=0.95[kick];"
        # Snare: on beats 2 and 4 (so at 0.5s offset in each 1.0s window). Band-passed noise.
        "[7:a]volume='1.2*exp(-22*mod(t-0.5\\,1.0))':eval=frame,"
        "bandpass=f=2000:w=1500,volume=0.30[snare];"
        # Hi-hat: every 0.25s (8th notes). High-passed noise, very short envelope, slightly accented on off-beats.
        "[8:a]volume='0.6*exp(-80*mod(t\\,0.25))':eval=frame,"
        "highpass=f=7500,lowpass=f=12000,volume=0.18[hat];"
        # ---------- BUS ----------
        "[bass][c4][e4][g4][shim][air][kick][snare][hat]"
        "amix=inputs=9:normalize=0[mix1];"
        # Master treatment
        "[mix1]aecho=0.5:0.7:55|110:0.20|0.14,"
        "acompressor=threshold=-18dB:ratio=3:attack=8:release=100,"
        "lowpass=f=12000,"
        f"afade=t=in:st=0:d=2.0,afade=t=out:st={d-2.5}:d=2.5,"
        "loudnorm=I=-18:TP=-2:LRA=9[out]",
        "-map", "[out]",
        "-c:a", "pcm_s16le",
        str(BG_PATH),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(res.stderr[-2000:])
        raise RuntimeError("ffmpeg synth failed")
    print(f"   ✓ Synth (with drums) → {BG_PATH} ({BG_PATH.stat().st_size//1024} KB)")


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
