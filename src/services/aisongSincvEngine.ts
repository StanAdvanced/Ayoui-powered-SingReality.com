import * as Tone from 'tone';

export interface BiometricData {
  heartRate: number;
  alphaWave: number;
  thetaWave: number;
  timestamp: number;
}

export interface SynthesisParams {
  tempo: number;
  complexity: number;
  valence: number;
}

export class AISongSincvEngine {
  private static instance: AISongSincvEngine;
  private synth: Tone.PolySynth | null = null;
  private lfo: Tone.LFO | null = null;
  private filter: Tone.Filter | null = null;
  private isPlaying: boolean = false;
  private loop: Tone.Loop | null = null;
  
  private constructor() {}

  public static getInstance(): AISongSincvEngine {
    if (!AISongSincvEngine.instance) {
      AISongSincvEngine.instance = new AISongSincvEngine();
    }
    return AISongSincvEngine.instance;
  }

  private isInitializing: boolean = false;

  public async startSynthesis() {
    if (this.isPlaying || this.isInitializing) return;
    this.isInitializing = true;
    
    try {
      await Tone.start();
      
      this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
      this.filter = new Tone.Filter(400, "lowpass").toDestination();
      this.synth.connect(this.filter);
      
      this.lfo = new Tone.LFO(0.5, 200, 1200);
      this.lfo.connect(this.filter.frequency);
      this.lfo.start();

      const notes = ["C4", "E4", "G4", "B4", "D5"];
      let index = 0;

      this.loop = new Tone.Loop((time) => {
        if (this.synth) {
          this.synth.triggerAttackRelease(notes[index % notes.length], "8n", time);
          index++;
        }
      }, "8n");

      Tone.Transport.start();
      this.loop.start(0);
      this.isPlaying = true;
    } finally {
      this.isInitializing = false;
    }
  }

  public stopSynthesis() {
    if (!this.isPlaying) return;
    this.loop?.stop();
    this.loop?.dispose();
    this.lfo?.stop();
    this.lfo?.dispose();
    this.synth?.dispose();
    this.filter?.dispose();
    Tone.Transport.stop();
    this.isPlaying = false;
  }

  public async synthesize(biometricData: BiometricData): Promise<string> {
    if (!this.isPlaying) {
      await this.startSynthesis();
    }

    const now = Tone.now();

    // Modulate audio parameters based on biometrics using setTargetAtTime to prevent rapid scheduling collision errors
    if (this.lfo) {
      // Alpha wave controls LFO rate (0.1 to 5 Hz)
      this.lfo.frequency.setTargetAtTime(0.1 + biometricData.alphaWave * 5, now, 0.1);
    }
    
    if (this.filter) {
      // Theta wave controls filter base frequency
      this.filter.frequency.setTargetAtTime(200 + biometricData.thetaWave * 2000, now, 0.1);
    }

    // Heart rate controls tempo
    Tone.Transport.bpm.setTargetAtTime(biometricData.heartRate, now, 0.5);

    return "Real-time synthesis active";
  }
}
