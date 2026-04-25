import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { narrationEngine } from '../services/narrationEngine';

type Persona = 'aura' | 'zephyr';

interface PageScript {
  text: string;
  voice: 'alloy' | 'nova' | 'shimmer' | 'echo' | 'fable' | 'onyx'; // Gemini TTS compatible voices via mapping or directly
}

const SCRIPTS: Record<string, PageScript> = {
  '/': { 
    text: "Welcome to SingReality. Step onto the main stage, design your ultimate creator empire, and unlock instant monetization. Lock in a Premium Publisher License today to start generating royalties.", 
    voice: 'nova' // Female, exciting, professional
  },
  '/studio': {
    text: "Welcome to the Khoral-Flow Studio. Here, you unleash your creativity using AI Choreography and WebXR tools. Create, dance, and mint your universal action links. Ready to design magic?",
    voice: 'echo' // Male, professional reporter
  },
  '/tv': { 
    text: "SingReality TV. Our global broadcast hub. Broadcast your talent to millions and earn instant crypto royalties via our Enterprise API while viewers engage live.", 
    voice: 'nova'
  },
  '/karaoke-arena': { 
    text: "The Karaoke Arena. Hit those perfect notes for 99.99% fidelity scoring. Want to own this backing track? Instantly purchase exclusive rights here in the marketplace.", 
    voice: 'nova' 
  },
  '/market': { 
    text: "The Nexus Marketplace. Trade musical stems, secure exclusive rights, and instantly monetize your productions with global buyers in real time.", 
    voice: 'echo'
  },
  '/map': { 
    text: "Behold the Global Map. Connect with elite nodes worldwide. Upgrade to VIP to instantly broadcast your secure signal to top-tier producers.", 
    voice: 'nova' 
  },
  '/auth': {
    text: "Authentication portal. Secure your identity within the quantum singularity. Create an account to track your royalties and save your creations.",
    voice: 'echo'
  },
  'default': { 
    text: "Explore SingReality. Every interaction is a chance to grow your empire and instantly monetize your creativity.", 
    voice: 'nova' 
  }
};

export function useAvatarSpeech() {
  const location = useLocation();
  const [isTalking, setIsTalking] = useState(false);
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const playIntro = async () => {
      const script = SCRIPTS[location.pathname] || SCRIPTS['default'];
      setCurrentText(script.text);
      setIsTalking(true);

      // Delay briefly so visuals can load
      await new Promise(r => setTimeout(r, 800));
      
      if (!isCancelled) {
        // You could theoretically pass the voice preference down to narrationEngine 
        // if using an extended generateSpeech that supports multiple voices.
        await narrationEngine.narrate(script.text, true);
        
        if (!isCancelled) {
          setIsTalking(false);
        }
      }
    };

    playIntro();

    return () => {
      isCancelled = true;
      narrationEngine.stop();
      setIsTalking(false);
    };
  }, [location.pathname]);

  return { isTalking, currentText };
}
