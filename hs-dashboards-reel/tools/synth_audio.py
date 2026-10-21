"""Synthesises the Reel's soundtrack locally (no samples, no downloads).

Corporate-electronic bed at 120 BPM plus sound design synced to the cuts in src/anim.js:
impact on the hook, whooshes on transitions, soft hits on VISUALIZA / ANALIZA / DECIDE,
a riser into the transformation and a clean closing chord.

Usage: python tools/synth_audio.py assets/hs-reel-audio.wav
"""
import sys

import numpy as np
import soundfile as sf

SR = 48000
DUR = 23.0
BPM = 120
BEAT = 60 / BPM
N = int(SR * DUR)
rng = np.random.default_rng(7)  # fixed seed: the same file every run

out = np.zeros((N, 2))


def t_arr(dur):
    return np.arange(int(SR * dur)) / SR


def place(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    out[i : i + len(sig), 0] += sig * left
    out[i : i + len(sig), 1] += sig * right


def env(n, attack, release_curve):
    a = max(1, int(attack * SR))
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a)
    e[a:] = np.exp(-np.linspace(0, release_curve, n - a))
    return e


def lowpass(x, cutoff):
    # one-pole low-pass, cutoff in Hz (scalar or per-sample array)
    c = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    alpha = 1 - np.exp(-2 * np.pi * c / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += alpha[i] * (x[i] - acc)
        y[i] = acc
    return y


def kick(dur=0.45):
    t = t_arr(dur)
    f = 45 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 9)


def hat(dur=0.06):
    n = rng.standard_normal(int(SR * dur))
    return (n - lowpass(n, 7000)) * env(len(n), 0.001, 7)


def impact(dur=1.6):
    t = t_arr(dur)
    sub = np.sin(2 * np.pi * np.cumsum(38 + 70 * np.exp(-t * 6)) / SR) * env(len(t), 0.003, 4)
    noise = lowpass(rng.standard_normal(len(t)), 1800) * env(len(t), 0.001, 12)
    return sub + 0.6 * noise


def whoosh(dur=0.6, up=True):
    n = int(SR * dur)
    x = rng.standard_normal(n)
    sweep = np.linspace(400, 5000, n) if up else np.linspace(5000, 400, n)
    shape = np.sin(np.linspace(0, np.pi, n)) ** 2
    return (lowpass(x, sweep) - lowpass(x, sweep * 0.25)) * shape


def riser(dur=0.8):
    n = int(SR * dur)
    x = rng.standard_normal(n)
    sweep = np.geomspace(300, 9000, n)
    return (lowpass(x, sweep) - lowpass(x, sweep * 0.3)) * np.linspace(0, 1, n) ** 2


def hit(dur=0.5, freq=880):
    t = t_arr(dur)
    tone = np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * freq * 2.01 * t)
    return 0.5 * tone * env(len(t), 0.002, 10) + 0.5 * kick(dur)[: len(t)]


def shimmer(dur=1.2):
    t = t_arr(dur)
    s = sum(np.sin(2 * np.pi * f * t + i) for i, f in enumerate([1318.5, 1760, 2637]))
    return s / 3 * env(len(t), 0.05, 4)


def pad(freqs, dur, cutoff=1400):
    t = t_arr(dur)
    saw = sum((2 * ((f * t + 0.5 * k) % 1) - 1) for k, f in enumerate(freqs)) / len(freqs)
    detune = sum((2 * ((f * 1.004 * t) % 1) - 1) for f in freqs) / len(freqs)
    x = lowpass(0.5 * (saw + detune), cutoff)
    fade = np.minimum(1, np.minimum(t / 0.4, (dur - t) / 0.4))
    return x * fade


def bass_note(freq, dur):
    t = t_arr(dur)
    x = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * freq * 2 * t)
    return x * env(len(t), 0.004, 3)


# ---- harmony: Am - F - C - G (2 bars each), MIDI-ish frequencies ----
CHORDS = [
    (110.0, [220.0, 261.63, 329.63]),  # A minor
    (87.31, [174.61, 220.0, 261.63]),  # F
    (130.81, [261.63, 329.63, 392.0]),  # C
    (98.0, [196.0, 246.94, 293.66]),  # G
]
BAR = 4 * BEAT

# pad through the whole piece (thin during the hook, fuller later)
t0, k = 0.0, 0
while t0 < DUR:
    root, ch = CHORDS[k % 4]
    length = min(2 * BAR, DUR - t0)
    gain = 0.05 if t0 < 3 else (0.08 if t0 < 17 else 0.07)
    place(pad(ch, length, 1100 if t0 < 3 else 1600), t0, gain)
    t0 += 2 * BAR
    k += 1

# groove 3–17 s: kick, off-beat hats, eighth-note bass
b = 3.0
while b < 17.0 - 1e-6:
    place(kick(), b, 0.55)
    place(hat(), b + BEAT / 2, 0.12, pan=0.3)
    chord_index = int((b // (2 * BAR)) % 4)
    root = CHORDS[chord_index][0]
    place(bass_note(root, BEAT / 2 * 0.9), b, 0.16)
    place(bass_note(root, BEAT / 2 * 0.9), b + BEAT / 2, 0.11)
    b += BEAT
# softer pulse under the end card
b = 17.0
while b < 21.0:
    place(kick(), b, 0.3)
    b += BEAT

# ---- sound design synced to the picture ----
place(impact(), 0.03, 0.9)
place(whoosh(0.5), 0.75, 0.25, pan=-0.4)
place(shimmer(), 1.0, 0.12, pan=0.4)  # cyan sweep
place(whoosh(0.6, up=False), 2.7, 0.3)
for i, at in enumerate([3.05, 3.12, 3.19, 3.26, 3.33, 3.4, 3.47, 3.54]):
    place(whoosh(0.18), at, 0.08, pan=-0.6 if i % 2 else 0.6)  # cards flying in
for at in (3.3, 4.1, 4.9):
    place(hit(0.35, 660), at, 0.18)
place(whoosh(0.7), 6.2, 0.2)
place(riser(0.8), 6.2, 0.22)
place(impact(1.2), 7.0, 0.55)
place(shimmer(1.4), 9.5, 0.14, pan=-0.3)
place(whoosh(0.6), 11.85, 0.25)
for at, f in ((12.15, 784), (13.75, 880), (15.35, 988)):
    place(hit(0.5, f), at, 0.3)
place(whoosh(0.5, up=False), 15.15, 0.2)
place(whoosh(1.0, up=False), 16.9, 0.18)
place(shimmer(1.6), 17.6, 0.16)
place(hit(0.6, 659), 20.5, 0.18)
# closing chord: A minor add9, ringing out to the end
place(pad([220.0, 261.63, 329.63, 493.88], 2.4, 2200), 20.6, 0.1)

# ---- master: gentle saturation, fades, normalise to -1 dBFS peak ----
out = np.tanh(out * 1.2)
fade_in = int(0.01 * SR)
fade_out = int(0.6 * SR)
out[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
out[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None]
out *= 10 ** (-1 / 20) / np.max(np.abs(out))
sf.write(sys.argv[1], out.astype(np.float32), SR, subtype="PCM_16")
print(f"wrote {sys.argv[1]}: {DUR}s, {SR} Hz stereo")
