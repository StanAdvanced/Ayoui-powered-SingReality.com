import { soundService } from '../services/soundService';

export function useSound() {
  return {
    playClick: () => soundService.playClick(),
    playSuccess: () => soundService.playSuccess(),
    playError: () => soundService.playError(),
    playTransition: () => soundService.playTransition(),
    playWhoosh: () => soundService.playWhoosh(),
    playChime: () => soundService.playChime(),
  };
}
