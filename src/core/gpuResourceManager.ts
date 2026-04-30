export class GPUResourceManager {
  private static instance: GPUResourceManager;
  private currentFPS: number = 60;
  private lastTime: number = performance.now();
  private frames: number = 0;
  public detailLevel: 'high' | 'medium' | 'low' = 'high';
  private targetFPS: number = 60;

  private listeners: Set<(level: 'high' | 'medium' | 'low') => void> = new Set();

  private constructor() {}

  public static getInstance(): GPUResourceManager {
    if (!GPUResourceManager.instance) {
      GPUResourceManager.instance = new GPUResourceManager();
    }
    return GPUResourceManager.instance;
  }

  public subscribe(listener: (level: 'high' | 'medium' | 'low') => void) {
    this.listeners.add(listener);
    listener(this.detailLevel);
    return () => this.listeners.delete(listener);
  }

  public updateFPS() {
    this.frames++;
    const now = performance.now();
    const elapsed = now - this.lastTime;
    
    if (elapsed >= 1000) {
      this.currentFPS = Math.round((this.frames * 1000) / elapsed);
      this.frames = 0;
      this.lastTime = now;
      this.adaptQuality();
    }
  }

  private adaptQuality() {
    let newLevel = this.detailLevel;
    
    // Very simple adaptive target
    if (this.currentFPS < 30) {
      newLevel = 'low';
    } else if (this.currentFPS < 50) {
      newLevel = 'medium';
    } else if (this.currentFPS >= 55) {
      newLevel = 'high';
    }

    if (newLevel !== this.detailLevel) {
      this.detailLevel = newLevel;
      this.listeners.forEach(l => l(newLevel));
    }
  }

  public optimizeFor(targetFPS: number) {
    console.log(`[GPU Manager] Optimizing for ${targetFPS} FPS`);
    this.targetFPS = targetFPS;
  }
}
