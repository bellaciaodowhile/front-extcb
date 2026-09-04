// Web Audio API Procedural Sound Synthesizer for subtle game audio

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.6;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getEnabled(): boolean {
    return this.enabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  // Subtle pleasant chime when a new participant joins the leaderboard
  public playNewParticipant() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Gentle ascending two-note chime (F5 -> A5)
      const notes = [698.46, 880.0];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15 * this.volume, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Victory sparkle sound when a user finishes their questionnaire (status: finished / ace-icon check)
  public playFinishVictory() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Sweet victory chord (C5 -> E5 -> G5 -> C6)
      const frequencies = [523.25, 659.25, 783.99, 1046.5];
      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 3 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.2 * this.volume, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.55);
      });
    } catch {
      // Ignore
    }
  }

  // Subtle click/tick sound for UI feedback
  public playTick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }

  // Dramatic fanfare chord for step reveal in Winners ceremony
  public playFanfareStep(place: number) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 5th place: F4 -> A4 -> C5
      // 4th place: E4 -> G#4 -> B4
      // 3rd place: Bronze fanfare (G4 -> B4 -> D5)
      // 2nd place: Silver fanfare (A4 -> C#5 -> E5 -> A5)
      // 1st place: Golden grand triumphant fanfare (C5 -> E5 -> G5 -> C6 -> E6)
      const chordMap: Record<number, number[]> = {
        5: [349.23, 440.0, 523.25],
        4: [329.63, 415.3, 493.88],
        3: [392.0, 493.88, 587.33],
        2: [440.0, 554.37, 659.25, 880.0],
        1: [523.25, 659.25, 783.99, 1046.5, 1318.51],
      };

      const notes = chordMap[place] || [440.0, 554.37, 659.25];

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = place === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.25 * this.volume, now + idx * 0.07 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + (place === 1 ? 0.9 : 0.6));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + (place === 1 ? 1.0 : 0.7));
      });
    } catch {
      // Ignore
    }
  }

  // Full celebratory grand victory fanfare loop
  public playGrandVictory() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const melody = [
        { freq: 523.25, time: 0, dur: 0.15 },
        { freq: 523.25, time: 0.16, dur: 0.15 },
        { freq: 523.25, time: 0.32, dur: 0.15 },
        { freq: 659.25, time: 0.48, dur: 0.35 },
        { freq: 587.33, time: 0.85, dur: 0.15 },
        { freq: 659.25, time: 1.02, dur: 0.15 },
        { freq: 783.99, time: 1.20, dur: 0.6 },
        { freq: 1046.5, time: 1.82, dur: 0.9 },
      ];

      melody.forEach(({ freq, time, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.22 * this.volume, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur + 0.05);
      });
    } catch {
      // Ignore
    }
  }

  // Dramatic drumroll / build-up suspense sound before revealing 1st place
  public playDrumrollSuspense(durationSeconds: number = 2.4) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const steps = 24;

      for (let i = 0; i < steps; i++) {
        const timeOffset = (i / steps) * (durationSeconds * 0.9);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        // Pitch gradually rises with increasing intensity
        const freq = 160 + (i / steps) * 220;
        osc.frequency.setValueAtTime(freq, now + timeOffset);

        gain.gain.setValueAtTime(0, now + timeOffset);
        gain.gain.linearRampToValueAtTime((0.08 + (i / steps) * 0.15) * this.volume, now + timeOffset + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.05);
      }
    } catch {
      // Ignore
    }
  }
}

export const soundEffects = new SoundEngine();
