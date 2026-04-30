import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useStore } from '../store/useStore';
import { generateSpeech, playRawAudio, stopAudio } from '../lib/tts';

const STEPS: any[] = [
  {
    target: 'body',
    content: "G'day legends! What is up, beautiful people?! Welcome to SingReality! I'm your host and guide. We are about to blow the roof off this digital dimension! SingReality isn't just a platform, it's a massive revolution! We're talking 100% free, unlimited, uncensored AI access. Buckle up, because we're about to bend reality together! Let's go!",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.nav-studio',
    content: "First stop: The Khoral-Flow Studio! This is where the absolute magic happens. You type in an emotion, a memory, or just smash your keyboard, and our Babylon Engine translates it into a mind-melting synesthetic experience. Plus, you earn Resonance—our Love-As-Currency—just for creating! It's literally paying you to be an absolute genius.",
  },
  {
    target: '.nav-arenas',
    content: "Next up, the Live Arenas! Imagine jamming with someone in Tokyo while you're in your pajamas in New York, with zero latency. Sync your biometrics, let the AI generate background music based on your heart rate, and perform for a global audience of millions! It's gonna be epic!",
  },
  {
    target: '.nav-clones',
    content: "Need a backup singer? Or a cyberpunk bass engine? Check out Neural Clones! Purchase your very own AI synthesizer clone to elevate your production to God-tier levels. They never sleep, they never complain, and they always hit the high notes. Best bandmates ever, right?",
  },
  {
    target: '.nav-marketplace',
    content: "Welcome to the Marketplace! Buy, sell, and trade digital assets, VIP tickets, and exclusive gear. It's like Wall Street, but for music, and way cooler. Get your hands on some holographic blueprints and start building your empire! Make it rain Resonance!",
  },
  {
    target: '.nav-quantum',
    content: "Feeling experimental? Dive into the Quantum Lab. We're talking 899th Dimension Twist Algorithms and fractal cognition engines. It's where we push the boundaries of what's possible with sound and light. Wear safety goggles, seriously, things get wild in here.",
  },
  {
    target: '.nav-profile',
    content: "And finally, your Profile! Track your advanced analytics, check your singing history, and see how much Resonance you've hoarded. Customize your avatar and show the world who's boss. Now get out there and make some noise! I'll be watching and cheering you on! Let's gooooo!"
  }
];

export function OnboardingTour() {
  const [run, setRun] = useState(false);
  const { setAvatarTalking } = useStore();
  const JoyrideAny = Joyride as any;

  useEffect(() => {
    // Only run once per session or if user is new
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      // Delay to let intro finish
      const timer = setTimeout(() => {
        setRun(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = useCallback(async (data: any) => {
    const { status, index, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (type === 'step:after' || type === 'error:target_not_found') {
      // Step changed, stop current audio immediately
      stopAudio();
      setAvatarTalking(false);
    }

    if (type === 'step:before') {
      // Speak the content
      const step = STEPS[index];
      if (step && typeof step.content === 'string') {
        setAvatarTalking(true);
        try {
          const audioData = await generateSpeech(step.content, 'Aoede');
          if (audioData) {
            await playRawAudio(audioData);
          }
        } catch (error) {
          console.error("Speech generation error in tour:", error);
        } finally {
          setAvatarTalking(false);
        }
      }
    }

    if (finishedStatuses.includes(status)) {
      setRun(false);
      stopAudio();
      setAvatarTalking(false);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, [setAvatarTalking]);

  const joyrideStyles = useMemo(() => ({
    options: {
      zIndex: 10000,
      primaryColor: '#00f0ff',
      backgroundColor: '#111',
      textColor: '#fff',
      arrowColor: '#111',
    },
    tooltipContainer: {
      textAlign: 'left',
    },
    buttonNext: {
      backgroundColor: '#00f0ff',
      color: '#000',
    },
    buttonBack: {
      color: '#00f0ff',
    }
  }), []);

  // Only render Joyride if we are running and have steps
  if (!run) return null;

  return (
    <JoyrideAny
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={STEPS}
      styles={joyrideStyles as any}
    />
  );
}
