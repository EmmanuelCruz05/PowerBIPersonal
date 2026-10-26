"""Synthesises the Reel's soundtrack locally (no samples, no downloads, no licensing issues).

Upbeat corporate bed at 120 BPM (scene cuts land on the beat) plus discreet sound design
synced to src/anim.js: list-line ticks, the "send" whoosh, card swishes, step hits and a
clean closing chord. Deterministic: the same file every run.

Usage: python tools/synth_audio.py assets/sumibox-mucho-mas-musica.wav
"""
import sys

import numpy as np
import soundfile as sf

SR = 48000
DUR = 21.5
BEAT = 0.5  # 120 BPM
N = int(SR * DUR)
rng = np.random.default_rng(21)
out = np.zeros((N, 2))


def t_arr(dur):
    return np.arange(int(SR * dur)) / SR


def place(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    out[i : i + len(sig), 0] += sig * np.cos((pan + 1) * np.pi / 4)
    out[i : i + len(sig), 1] += sig * np.sin((pan + 1) * np.pi / 4)


def env(n, attack, decay):
    a = max(1, int(attack * SR))
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a)
    e[a:] = np.exp(-np.linspace(0, decay, n - a))
    return e


def lowpass(x, cutoff):
    c = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    alpha = 1 - np.exp(-2 * np.pi * c / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += alpha[i] * (x[i] - acc)
        y[i] = acc
    return y


def kick(dur=0.4):
    t = t_arr(dur)
    return np.sin(2 * np.pi * np.cumsum(48 + 120 * np.exp(-t * 30)) / SR) * env(len(t), 0.002, 10)


def clap(dur=0.18):
    n = rng.standard_normal(int(SR * dur))
    return (n - lowpass(n, 1200)) * env(len(n), 0.001, 14)


def hat(dur=0.05):
    n = rng.standard_normal(int(SR * dur))
    return (n - lowpass(n, 8000)) * env(len(n), 0.001, 8)


def pluck(freq, dur=0.3):
    t = t_arr(dur)
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t)
    return x * env(len(t), 0.003, 9)


def pad(freqs, dur, cutoff=1500):
    t = t_arr(dur)
    saw = sum((2 * ((f * t + 0.3 * k) % 1) - 1) for k, f in enumerate(freqs)) / len(freqs)
    det = sum((2 * ((f * 1.005 * t) % 1) - 1) for f in freqs) / len(freqs)
    fade = np.minimum(1, np.minimum(t / 0.3, (dur - t) / 0.3))
    return lowpass(0.5 * (saw + det), cutoff) * fade


def whoosh(dur=0.5, up=True):
    n = int(SR * dur)
    x = rng.standard_normal(n)
    sweep = np.linspace(500, 6000, n) if up else np.linspace(6000, 500, n)
    return (lowpass(x, sweep) - lowpass(x, sweep * 0.25)) * np.sin(np.linspace(0, np.pi, n)) ** 2


def tick(freq=1800, dur=0.08):
    t = t_arr(dur)
    return np.sin(2 * np.pi * freq * t) * env(len(t), 0.001, 25)


def chime(dur=1.4):
    t = t_arr(dur)
    s = sum(np.sin(2 * np.pi * f * t + i) for i, f in enumerate([1046.5, 1318.5, 1568.0]))
    return s / 3 * env(len(t), 0.02, 4)


# Major, optimistic progression: C - G - Am - F (2 bars each)
CHORDS = [
    (130.81, [261.63, 329.63, 392.0]),
    (98.0, [196.0, 246.94, 293.66]),
    (110.0, [220.0, 261.63, 329.63]),
    (87.31, [174.61, 220.0, 261.63]),
]
BAR = 4 * BEAT
t0, k = 0.0, 0
while t0 < DUR:
    root, ch = CHORDS[k % 4]
    length = min(2 * BAR, DUR - t0)
    place(pad(ch, length), t0, 0.06)
    t0 += 2 * BAR
    k += 1

b = 0.0
while b < 19.5 - 1e-6:
    root = CHORDS[int((b // (2 * BAR)) % 4)][0]
    strong = 3.4 <= b < 18.0  # fuller groove during the tour
    place(kick(), b, 0.5 if strong else 0.35)
    place(hat(), b + BEAT / 2, 0.1, pan=0.3)
    if strong and int(round(b / BEAT)) % 2 == 1:
        place(clap(), b, 0.16)
    place(pluck(root * 2, 0.22), b, 0.07)
    place(pluck(root * 2, 0.22), b + BEAT / 2, 0.05)
    b += BEAT

# ---- sound design synced to src/anim.js ----
place(whoosh(0.5), 0.0, 0.2)
place(tick(1500), 0.6, 0.14)  # underline under "proveedor"
place(whoosh(0.45), 2.15, 0.18, pan=0.4)  # to the speech bubble
place(whoosh(0.6, up=False), 3.35, 0.25)  # pull back to the full design
for i, at in enumerate((4.4, 6.0, 7.6, 9.2, 10.8)):  # five categories
    place(whoosh(0.35), at - 0.05, 0.16, pan=-0.4 + 0.2 * i)
    place(pluck(523.25 * (1.12 ** i), 0.4), at + 0.45, 0.18)
place(chime(1.4), 12.5, 0.15)  # logo ring
place(whoosh(0.4), 14.15, 0.18)
place(pluck(659.25, 0.5), 14.6, 0.18)
place(whoosh(0.45), 15.75, 0.18)
place(whoosh(0.6, up=False), 17.95, 0.24)
place(pluck(783.99, 0.6), 18.6, 0.2)  # call to action
place(pad([261.63, 329.63, 392.0, 493.88], 3.0, 2400), 18.5, 0.09)  # closing chord

out = np.tanh(out * 1.2)
fi, fo = int(0.01 * SR), int(0.8 * SR)
out[:fi] *= np.linspace(0, 1, fi)[:, None]
out[-fo:] *= np.linspace(1, 0, fo)[:, None]
out *= 10 ** (-1 / 20) / np.max(np.abs(out))
sf.write(sys.argv[1], out.astype(np.float32), SR, subtype="PCM_16")
print(f"wrote {sys.argv[1]}: {DUR}s, {SR} Hz stereo")
