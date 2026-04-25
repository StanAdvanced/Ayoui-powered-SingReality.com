import * as Tone from 'tone';

class SoundService {
  private clickSynth: Tone.Synth | null = null;
  private successSynth: Tone.PolySynth | null = null;
  private errorSynth: Tone.DuoSynth | null = null;
  private transitionSynth: Tone.NoiseSynth | null = null;
  private whooshSynth: Tone.NoiseSynth | null = null;
  private chimeSynth: Tone.PolySynth | null = null;
  private filter: Tone.Filter | null = null;
  private initialized = false;

  private async init() {
    if (this.initialized) return;
    
    try {
      await Tone.start();
      
      this.clickSynth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
      }).toDestination();
      this.clickSynth.volume.value = -12;

      this.successSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.1, release: 0.5 }
      }).toDestination();
      this.successSynth.volume.value = -10;

      this.errorSynth = new Tone.DuoSynth({
        vibratoAmount: 0.5,
        vibratoRate: 5,
        harmonicity: 1.5,
        voice0: { oscillator: { type: 'sawtooth' } },
        voice1: { oscillator: { type: 'square' } }
      }).toDestination();
      this.errorSynth.volume.value = -15;

      this.filter = new Tone.Filter(2000, 'lowpass').toDestination();
      this.transitionSynth = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.1, decay: 0.3, sustain: 0, release: 0.3 }
      }).connect(this.filter);
      this.transitionSynth.volume.value = -25;

      this.whooshSynth = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: { attack: 0.5, decay: 0.5, sustain: 0, release: 0.5 }
      }).connect(this.filter);
      this.whooshSynth.volume.value = -20;

      this.chimeSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 1, sustain: 0, release: 1 }
      }).toDestination();
      this.chimeSynth.volume.value = -15;

      this.initialized = true;
    } catch (error) {
      console.warn('SoundService: Failed to initialize audio context', error);
    }
  }

  async playClick() {
    await this.init();
    if (this.clickSynth) {
      this.clickSynth.triggerAttackRelease('C5', '16n');
    }
  }

  async playSuccess() {
    await this.init();
    if (this.successSynth) {
      this.successSynth.triggerAttackRelease(['C4', 'E4', 'G4'], '8n');
    }
  }

  async playError() {
    await this.init();
    if (this.errorSynth) {
      this.errorSynth.triggerAttackRelease('G2', '4n');
    }
  }

  async playWhoosh() {
    await this.init();
    if (this.whooshSynth && this.filter) {
      const now = Tone.now();
      try {
        // Robust scheduling: cancel previous events and set start value with small offset
        this.filter.frequency.cancelScheduledValues(now);
        this.filter.frequency.setValueAtTime(400, now + 0.01);
        this.filter.frequency.exponentialRampToValueAtTime(2000, now + 0.31);
        this.filter.frequency.exponentialRampToValueAtTime(400, now + 0.61);
        this.whooshSynth.triggerAttackRelease('4n', now + 0.01);
      } catch(e) {
        console.warn('Tone: Whoosh scheduling collision prevented', e);
      }
    }
  }

  async playChime() {
    await this.init();
    if (this.chimeSynth) {
      const now = Tone.now();
      this.chimeSynth.triggerAttackRelease(['E5', 'G5', 'C6'], '2n', now + 0.01);
    }
  }

  async playTransition() {
    await this.init();
    if (this.transitionSynth && this.filter) {
      const now = Tone.now();
      try {
        this.filter.frequency.cancelScheduledValues(now);
        this.filter.frequency.setValueAtTime(2000, now + 0.01);
        this.filter.frequency.exponentialRampToValueAtTime(200, now + 0.51);
        this.filter.frequency.exponentialRampToValueAtTime(2000, now + 0.81);
        this.transitionSynth.triggerAttackRelease('4n', now + 0.01);
      } catch (e) {
        console.warn('Tone: Transition scheduling collision prevented.', e);
      }
    }
  }
}

export const soundService = new SoundService();
