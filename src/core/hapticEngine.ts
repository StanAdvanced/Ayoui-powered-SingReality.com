export class ImmersiveHapticEngine {
  public static triggerVibration(pattern: number[]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }
}
