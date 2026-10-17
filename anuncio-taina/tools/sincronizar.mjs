#!/usr/bin/env node
// Sincroniza la línea de tiempo del anuncio con la voz.
//
//   node tools/sincronizar.mjs --guia
//       Genera una VOZ GUÍA PROVISIONAL (TTS local, voz ef_dora, NO dominicana)
//       a partir de tools/guion.json y la guarda en assets/audio/voz.wav.
//
//   node tools/sincronizar.mjs --aplicar
//       Vuelve a aplicar tools/timing.json (tras editar data-sync en el HTML).
//
//   node tools/sincronizar.mjs --voz assets/audio/voz.wav [--transcript transcript.json]
//       Usa TU grabación real: la transcribe con `hyperframes transcribe`
//       (o usa el transcript que le pases) y alinea cada palabra con el guion.
//
// En ambos casos reescribe el bloque TIMING de compositions/anuncio.html y la
// duración de las tres composiciones, para que escenas y subtítulos sigan a la voz.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const GUION = JSON.parse(readFileSync(join(ROOT, "tools/guion.json"), "utf8"));
const VOZ_OUT = join(ROOT, "assets/audio/voz.wav");
const HOLD_FINAL = 3.2; // segundos que el cierre comercial queda en pantalla tras la última palabra
const LEAD_IN = 0.15; // silencio antes de la primera palabra

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const sh = (cmd, a, opts = {}) => execFileSync(cmd, a, { stdio: ["ignore", "pipe", "pipe"], ...opts }).toString();
const duracion = (f) =>
  parseFloat(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]));

const norm = (w) =>
  w
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zñ0-9]/g, "");

const palabras = (texto) => texto.split(/\s+/).filter(Boolean);

// ---------- Modo 1: voz guía provisional ----------
function vozGuia() {
  const tmp = join(ROOT, ".voz-guia-tmp");
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const partes = [];
  const lines = [];
  let t = LEAD_IN;
  partes.push(silencio(tmp, "lead", LEAD_IN));
  for (const l of GUION) {
    const out = join(tmp, `${l.id}.wav`);
    process.stdout.write(`TTS ${l.id}… `);
    sh("npx", ["--yes", "hyperframes@0.8.169", "tts", l.text, "-v", "ef_dora", "-s", "1.1", "-o", out], { cwd: ROOT });
    const d = duracion(out);
    console.log(d.toFixed(2) + "s");
    // Reparto aproximado de tiempos por palabra según su longitud (solo para la guía).
    const ws = palabras(l.text);
    const pesos = ws.map((w) => norm(w).length + 2);
    const total = pesos.reduce((a, b) => a + b, 0);
    let c = t;
    const words = ws.map((w, i) => {
      const s = c;
      c += (pesos[i] / total) * d;
      return { w, s: +s.toFixed(3), e: +c.toFixed(3) };
    });
    lines.push({ id: l.id, beat: l.beat, start: +t.toFixed(3), end: +(t + d).toFixed(3), words });
    partes.push(out);
    t += d;
    if (l.pause > 0) {
      partes.push(silencio(tmp, `p-${l.id}`, l.pause));
      t += l.pause;
    }
  }
  const lista = join(tmp, "lista.txt");
  writeFileSync(lista, partes.map((p) => `file '${p}'`).join("\n"));
  mkdirSync(dirname(VOZ_OUT), { recursive: true });
  sh("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lista, "-ar", "48000", "-ac", "1", VOZ_OUT]);
  rmSync(tmp, { recursive: true, force: true });
  return lines;
}

function silencio(dir, nombre, seg) {
  const f = join(dir, `${nombre}.wav`);
  sh("ffmpeg", ["-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", String(seg), f]);
  return f;
}

// ---------- Modo 2: voz real + transcripción ----------
function vozReal(voz, transcriptPath) {
  if (!transcriptPath) {
    sh("npx", ["--yes", "hyperframes@0.8.169", "transcribe", voz, "--language", "es", "--model", "small", "-d", ROOT], {
      cwd: ROOT,
      stdio: "inherit",
    });
    transcriptPath = join(ROOT, "transcript.json");
  }
  const tr = JSON.parse(readFileSync(transcriptPath, "utf8"));
  const tw = (Array.isArray(tr) ? tr : tr.words || [])
    .map((w) => ({ n: norm(w.text ?? w.word ?? ""), s: w.start, e: w.end }))
    .filter((w) => w.n);
  let k = 0;
  const lines = GUION.map((l) => {
    const words = palabras(l.text).map((w) => {
      const n = norm(w);
      for (let j = k; j < Math.min(k + 5, tw.length); j++) {
        if (tw[j].n === n || (n.length > 3 && tw[j].n.startsWith(n.slice(0, 4)))) {
          k = j + 1;
          return { w, s: tw[j].s, e: tw[j].e };
        }
      }
      return { w, s: null, e: null };
    });
    return { id: l.id, beat: l.beat, words };
  });
  // Interpola palabras no reconocidas entre sus vecinas.
  const todas = lines.flatMap((l) => l.words);
  todas.forEach((w, i) => {
    if (w.s !== null) return;
    const prev = todas.slice(0, i).reverse().find((x) => x.s !== null);
    const next = todas.slice(i + 1).find((x) => x.s !== null);
    w.s = prev ? prev.e : next ? Math.max(0, next.s - 0.3) : 0;
    w.e = next ? Math.min(next.s, w.s + 0.35) : w.s + 0.35;
  });
  const sinCoincidir = todas.filter((w) => w.e - w.s <= 0).length;
  if (sinCoincidir) console.warn(`Aviso: ${sinCoincidir} palabras quedaron sin duración; revisa el guion vs. la grabación.`);
  return lines.map((l) => ({
    ...l,
    start: l.words[0].s,
    end: l.words[l.words.length - 1].e,
  }));
}

// ---------- Escritura ----------
function escribir(lines, vozDur) {
  const ultima = lines[lines.length - 1].end;
  const total = +(Math.max(ultima, vozDur) + HOLD_FINAL).toFixed(2);
  const beats = {};
  for (const l of lines) if (!(l.beat in beats)) beats[l.beat] = l.start;
  const timing = { total, vozDur: +vozDur.toFixed(3), beats, lines };

  writeFileSync(join(ROOT, "tools/timing.json"), JSON.stringify(timing, null, 1));
  aplicar(timing);
  console.log(`\nDuración total: ${total}s (voz ${vozDur.toFixed(2)}s + cierre ${HOLD_FINAL}s)`);
  console.log("Inicio de cada momento:");
  for (const [b, t] of Object.entries(beats)) console.log(`  ${b.padEnd(10)} ${t.toFixed(2)}s`);
}

// Escribe TIMING en la composición y recalcula los clips marcados con data-sync.
function aplicar(timing) {
  const comp = join(ROOT, "compositions/anuncio.html");
  let html = readFileSync(comp, "utf8");
  html = html.replace(
    /\/\* TIMING:BEGIN \*\/[\s\S]*?\/\* TIMING:END \*\//,
    () => `/* TIMING:BEGIN */ const TIMING = ${JSON.stringify(timing)}; /* TIMING:END */`,
  );
  writeFileSync(comp, sincronizarClips(html, timing));
  for (const f of ["index.html", "compositions/feed-4x5.html"]) {
    const p = join(ROOT, f);
    if (existsSync(p)) writeFileSync(p, sincronizarClips(readFileSync(p, "utf8"), timing));
  }
}

// Cada clip con data-sync="INICIO..FIN" recibe data-start / data-duration calculados.
// Referencias: 0 | total | voz (fin del audio de voz) | L07 (inicio de la línea) | L07:end (final) | con +/- segundos.
// data-sync-media="inicio" copia además el inicio en data-media-start (la música sigue corriendo).
function sincronizarClips(html, timing) {
  const porId = Object.fromEntries(timing.lines.map((l) => [l.id, l]));
  const ref = (r) => {
    const m = r.trim().match(/^(0|total|voz|L\d+(?::end|@[^+\-\s]+)?)([+-]\d*\.?\d+)?$/);
    if (!m) throw new Error(`data-sync inválido: ${r}`);
    let t;
    if (m[1] === "0") t = 0;
    else if (m[1] === "total") t = timing.total;
    else if (m[1] === "voz") t = timing.vozDur;
    else {
      const [, id, sufijo] = m[1].match(/^(L\d+)(.*)$/);
      const l = porId[id];
      if (!l) throw new Error(`Línea desconocida en data-sync: ${id}`);
      if (sufijo === ":end") t = l.end;
      else if (sufijo.startsWith("@")) {
        const w = l.words.find((x) => norm(x.w) === norm(sufijo.slice(1)));
        if (!w) throw new Error(`La palabra "${sufijo.slice(1)}" no está en ${id}`);
        t = w.s;
      } else t = l.start;
    }
    return Math.max(0, t + (m[2] ? parseFloat(m[2]) : 0));
  };
  const fmt = (n) => String(+n.toFixed(3));
  return html.replace(/<[^>]*\sdata-sync="[^"]*"[^>]*>/g, (tag) => {
    const [a, b] = tag.match(/data-sync="([^"]*)"/)[1].split("..");
    const ini = ref(a);
    const dur = Math.max(0.1, ref(b) - ini);
    let out = tag
      .replace(/data-start="[^"]*"/, `data-start="${fmt(ini)}"`)
      .replace(/data-duration="[^"]*"/, `data-duration="${fmt(dur)}"`);
    if (/data-sync-media="inicio"/.test(tag)) out = out.replace(/data-media-start="[^"]*"/, `data-media-start="${fmt(ini)}"`);
    return out;
  });
}

if (args.includes("--guia")) {
  const lines = vozGuia();
  escribir(lines, duracion(VOZ_OUT));
} else if (args.includes("--aplicar")) {
  aplicar(JSON.parse(readFileSync(join(ROOT, "tools/timing.json"), "utf8")));
  console.log("Clips re-sincronizados con tools/timing.json");
} else if (arg("--voz")) {
  const voz = resolve(arg("--voz"));
  const lines = vozReal(voz, arg("--transcript") && resolve(arg("--transcript")));
  escribir(lines, duracion(voz));
} else {
  console.log("Uso: node tools/sincronizar.mjs --guia | --voz <archivo> [--transcript <json>] | --aplicar");
  process.exit(1);
}
