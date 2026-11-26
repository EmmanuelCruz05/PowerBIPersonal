#!/usr/bin/env python3
"""Genera música sintetizada (reemplazable) y efectos de sonido -> assets/. Uso: python3 tools/make_audio.py"""
import numpy as np, wave, os
SR=44100; D=25.0
rng=np.random.default_rng(7)
def save(path,x):
    x=np.clip(x,-1,1); w=wave.open(path,'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x*32767).astype('<i2').tobytes()); w.close()
def t(n): return np.arange(int(n*SR))/SR
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x); s=0
    # vectorised-ish one-pole via loop in chunks
    for i in range(len(x)): s=(1-a)*x[i]+a*s; y[i]=s
    return y
def env(n,a,r):
    e=np.ones(n); na=int(a*SR); nr=int(r*SR)
    if na>0: e[:na]=np.linspace(0,1,na)
    if nr>0: e[-nr:]*=np.linspace(1,0,nr)
    return e
# ---- música: 100 BPM, Am F C G ----
bpm=100; beat=60/bpm; N=int(D*SR); m=np.zeros(N)
chords=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]
f=lambda n:440*2**((n-69)/12)
bar=4*beat
for i in range(int(D/bar)+1):
    ch=chords[i%4]; s=int(i*bar*SR); L=int(bar*SR)
    if s>=N: break
    tt=np.arange(L)/SR; pad=np.zeros(L)
    for n in ch:
        for det in (0.997,1.003): pad+=np.sign(np.sin(2*np.pi*f(n)*det*tt))*0.5+np.sin(2*np.pi*f(n)*det*tt)
    pad=lp(pad,900)*env(L,0.4,0.5)*0.05
    bass=np.sin(2*np.pi*f(ch[0]-24)*tt)*env(L,0.02,0.3)*0.28
    seg=pad+bass; e=min(L,N-s); m[s:s+e]+=seg[:e]
# arpegio pluck en corcheas
for k in range(int(D/(beat/2))):
    s=int(k*beat/2*SR); ch=chords[(k//8)%4]; n=ch[k%3]+12
    L=int(0.35*SR); tt=np.arange(L)/SR
    p=np.sin(2*np.pi*f(n)*tt)*np.exp(-tt*9)*0.06
    e=min(L,N-s)
    if e>0: m[s:s+e]+=p[:e]
# bombo suave + hat
for k in range(int(D/beat)):
    s=int(k*beat*SR); L=int(0.25*SR); tt=np.arange(L)/SR
    kick=np.sin(2*np.pi*(55+90*np.exp(-tt*30))*tt)*np.exp(-tt*14)*0.35
    e=min(L,N-s); 
    if e>0 and k>=2: m[s:s+e]+=kick[:e]
    s2=s+int(beat/2*SR); H=int(0.05*SR)
    if s2+H<N: m[s2:s2+H]+=rng.normal(0,1,H)*np.exp(-np.arange(H)/SR*90)*0.025
m*=np.minimum(1,np.minimum(t(D)/1.0,(D-t(D))/2.0)) if False else 1
fade=np.ones(N); fade[-int(2*SR):]=np.linspace(1,0,int(2*SR)); fade[:int(0.3*SR)]=np.linspace(0,1,int(0.3*SR)); m*=fade
m/=np.max(np.abs(m))*1.15
save('assets/music.wav',m)
# ---- sfx ----
def whoosh(d=0.6):
    n=rng.normal(0,1,int(d*SR)); tt=t(d); y=np.zeros_like(n)
    a=lp(n,300); b=lp(n,3000)-lp(n,300)
    sweep=np.sin(np.pi*tt/d)**2
    return (a*(1-sweep)+b*sweep*1.5)*sweep*0.9
def click():
    tt=t(0.06); return np.sin(2*np.pi*1800*tt)*np.exp(-tt*120)*0.6+rng.normal(0,1,len(tt))*np.exp(-tt*200)*0.2
def pop():
    tt=t(0.18); return np.sin(2*np.pi*(300+500*np.exp(-tt*40))*tt)*np.exp(-tt*22)*0.7
def impact():
    tt=t(1.2); return (np.sin(2*np.pi*(45+60*np.exp(-tt*8))*tt)*np.exp(-tt*4)*0.8+lp(rng.normal(0,1,len(tt)),800)*np.exp(-tt*9)*0.5)
for n,x in dict(whoosh=whoosh(),click=click(),pop=pop(),impact=impact()).items():
    save(f'assets/sfx/{n}.wav',x/np.max(np.abs(x))*0.9)
print('ok')
