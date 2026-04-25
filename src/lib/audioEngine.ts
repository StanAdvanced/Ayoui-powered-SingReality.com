import * as Tone from 'tone';

let isInitialized = false;
let isInitializing = false;
let masterReverb: Tone.Reverb;
let masterDelay: Tone.FeedbackDelay;
let masterDistortion: Tone.Distortion;

export async function initAudio() {
  if (isInitialized || isInitializing) return;
  isInitializing = true;
  try {
    await Tone.start();
    
    // Create Effects Chain
    masterDistortion = new Tone.Distortion(0.4);
    masterDelay = new Tone.FeedbackDelay("8n", 0.4);
    masterReverb = new Tone.Reverb({ decay: 4, preDelay: 0.1 });
    
    // Wait for reverb to generate impulse response
    await masterReverb.generate();
    
    // Route: Distortion -> Delay -> Reverb -> Destination
    masterDistortion.connect(masterDelay);
    masterDelay.connect(masterReverb);
    masterReverb.toDestination();
    
    isInitialized = true;
  } finally {
    isInitializing = false;
  }
}

export interface SparkRecipe {
  synthType: 'FM' | 'AM' | 'Poly' | 'Membrane';
  tempo: number;
  notes: { note: string; duration: string; time: string }[];
}

export async function playSpark(recipe: SparkRecipe) {
  await initAudio();
  
  Tone.Transport.bpm.value = recipe.tempo;
  
  let synth: any;
  
  switch (recipe.synthType) {
    case 'FM':
      synth = new Tone.FMSynth();
      break;
    case 'AM':
      synth = new Tone.AMSynth();
      break;
    case 'Membrane':
      synth = new Tone.MembraneSynth();
      break;
    case 'Poly':
    default:
      synth = new Tone.PolySynth(Tone.Synth);
      break;
  }
  
  // Connect synth to the effects chain
  synth.connect(masterDistortion);
  
  const now = Tone.now();
  
  // Group notes by time to ensure strict ordering and avoid PolySynth duplicate time errors
  const groups: Record<number, { notes: string[], duration: string }> = {};
  
  recipe.notes.forEach((n) => {
    const timeInSeconds = Tone.Time(n.time).toSeconds();
    if (!groups[timeInSeconds]) {
      groups[timeInSeconds] = { notes: [], duration: n.duration };
    }
    // Prevent duplicate notes at the exact same exact timestamp
    if (!groups[timeInSeconds].notes.includes(n.note)) {
      groups[timeInSeconds].notes.push(n.note);
    }
  });
  
  const times = Object.keys(groups).map(parseFloat).sort((a, b) => a - b);
  
  times.forEach((t) => {
    const grp = groups[t];
    synth.triggerAttackRelease(grp.notes, grp.duration, now + t);
  });
  
  // Cleanup synth after sequence finishes + 8 seconds for tail
  const maxTime = times.length > 0 ? Math.max(...times.map(t => t + Tone.Time(groups[t].duration).toSeconds())) : 0;
  setTimeout(() => {
    synth.dispose();
  }, (maxTime + 8) * 1000);
}
