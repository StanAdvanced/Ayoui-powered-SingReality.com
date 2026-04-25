import { narrationEngine } from '../services/narrationEngine';

export function useActionNarrator() {
  const narrateAction = (action: string) => {
    switch (action) {
      case 'enter_arena':
        narrationEngine.narrate("Entering the arena. Your avatar is primed, and the crowd is restless in the Quantum Singularity.", true);
        break;
      case 'generate_choreo':
        narrationEngine.narrate("Commencing DiffDance algorithm. The AI is crafting hyper-synchronized choreography for you.", true);
        break;
      case 'mint_creation':
        narrationEngine.narrate("Executing Genesis sequence. Your Universal Action Link is live and ready for instant royalties.", true);
        break;
      case 'explore_dimension':
        narrationEngine.narrate("Journey deep into our holographic dimensions. Unlocking new 3D Gaussian paths.", true);
        break;
      case 'login':
        narrationEngine.narrate("Authentication successful. Welcome back to the Nexus. Your royalties are intact.", true);
        break;
      case 'vr_mode':
        narrationEngine.narrate("Entering WebXR immersive mode. Please secure your head mounted display.", true);
        break;
      default:
        console.log("No specific narration for this action:", action);
        break;
    }
  };

  return { narrateAction };
}
