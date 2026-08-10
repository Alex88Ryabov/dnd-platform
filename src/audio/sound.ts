import { useStore } from '../store/store';

// Все звуки синтезируются WebAudio на лету — никаких файлов
let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (!useStore.getState().settings.soundOn) {
    return null;
  }
  try {
    if (!ctx) {
      ctx = new AudioContext();
    }
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  ac: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.18,
) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ac.currentTime + start);
  gain.gain.linearRampToValueAtTime(volume, ac.currentTime + start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + duration + 0.05);
}

function noiseBurst(ac: AudioContext, start: number, duration: number, freq: number, volume = 0.3) {
  const length = Math.max(1, Math.floor(ac.sampleRate * duration));
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = 1.2;
  const gain = ac.createGain();
  gain.gain.value = volume;
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(ac.currentTime + start);
}

export const sfx = {
  click() {
    const ac = audio();
    if (!ac) {
      return;
    }
    tone(ac, 950, 0, 0.05, 'sine', 0.07);
  },
  dice() {
    const ac = audio();
    if (!ac) {
      return;
    }
    for (let i = 0; i < 6; i++) {
      noiseBurst(ac, i * 0.09 + Math.random() * 0.03, 0.045, 1700 + Math.random() * 1600, 0.22 - i * 0.02);
    }
    noiseBurst(ac, 0.6, 0.09, 900, 0.25);
  },
  crit() {
    const ac = audio();
    if (!ac) {
      return;
    }
    [523, 659, 784, 1047].forEach((f, i) => tone(ac, f, 0.06 * i, 0.35, 'triangle', 0.16));
    tone(ac, 1568, 0.28, 0.5, 'sine', 0.1);
  },
  fumble() {
    const ac = audio();
    if (!ac) {
      return;
    }
    tone(ac, 220, 0, 0.25, 'sawtooth', 0.1);
    tone(ac, 156, 0.18, 0.4, 'sawtooth', 0.12);
  },
  levelUp() {
    const ac = audio();
    if (!ac) {
      return;
    }
    [392, 523, 659, 784].forEach((f, i) => tone(ac, f, 0.11 * i, 0.3, 'triangle', 0.16));
    [523, 659, 784, 1047].forEach((f) => tone(ac, f, 0.5, 0.8, 'triangle', 0.1));
  },
  coin() {
    const ac = audio();
    if (!ac) {
      return;
    }
    tone(ac, 2100, 0, 0.12, 'sine', 0.12);
    tone(ac, 2800, 0.07, 0.18, 'sine', 0.1);
  },
  damage() {
    const ac = audio();
    if (!ac) {
      return;
    }
    noiseBurst(ac, 0, 0.12, 350, 0.35);
    tone(ac, 95, 0, 0.22, 'sine', 0.25);
  },
  heal() {
    const ac = audio();
    if (!ac) {
      return;
    }
    tone(ac, 660, 0, 0.25, 'sine', 0.1);
    tone(ac, 830, 0.12, 0.35, 'sine', 0.1);
  },
};
