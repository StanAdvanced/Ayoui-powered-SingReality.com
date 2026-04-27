import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { narrationEngine } from '../services/narrationEngine';
import { useStore } from '../store/useStore';

type Persona = 'aura' | 'zephyr';

interface PageScript {
  text: string;
}

const SCRIPTS: Record<string, PageScript> = {
  '/': { 
    text: "Welcome to SingReality. Step onto the main stage, design your ultimate creator empire, and unlock instant monetization. Lock in a Premium Publisher License today to start generating royalties."
  },
  '/studio': {
    text: "Welcome to the Khoral-Flow Studio. Here, you unleash your creativity using AI Choreography and WebXR tools. Create, dance, and mint your universal action links. Ready to design magic?"
  },
  '/tv': { 
    text: "SingReality TV. Our global broadcast hub. Broadcast your talent to millions and earn instant crypto royalties via our Enterprise API while viewers engage live."
  },
  '/karaoke-arena': { 
    text: "The Karaoke Arena. Hit those perfect notes for 99.99% fidelity scoring. Want to own this backing track? Instantly purchase exclusive rights here in the marketplace."
  },
  '/market': { 
    text: "The Nexus Marketplace. Trade musical stems, secure exclusive rights, and instantly monetize your productions with global buyers in real time."
  },
  '/map': { 
    text: "Behold the Global Map. Connect with elite nodes worldwide. Upgrade to VIP to instantly broadcast your secure signal to top-tier producers."
  },
  '/auth': {
    text: "Authentication portal. Secure your identity within the quantum singularity. Create an account to track your royalties and save your creations."
  },
  'default': { 
    text: "Explore SingReality. Every interaction is a chance to grow your empire and instantly monetize your creativity."
  }
};

export function useAvatarSpeech() {
  const location = useLocation();
  const [isTalking, setIsTalking] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const narrationVoice = useStore((state) => state.narrationVoice);

  useEffect(() => {
    let isCancelled = false;

    const playIntro = async () => {
      const script = SCRIPTS[location.pathname] || SCRIPTS['default'];
      setCurrentText(script.text);
      setIsTalking(true);

      // Delay briefly so visuals can load
      await new Promise(r => setTimeout(r, 800));
      
      if (!isCancelled) {
        // Use user selected narration voice
        await narrationEngine.narrate(script.text, true, narrationVoice);
        
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
  }, [location.pathname, narrationVoice]);

  return { isTalking, currentText };
}
