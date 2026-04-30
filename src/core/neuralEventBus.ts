export class NeuralEventBus {
  private static instance: NeuralEventBus;
  private listeners: Map<string, Function[]> = new Map();

  private constructor() {}

  public static getInstance(): NeuralEventBus {
    if (!NeuralEventBus.instance) {
      NeuralEventBus.instance = new NeuralEventBus();
    }
    return NeuralEventBus.instance;
  }

  public emit(event: string, payload: any) {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach(fn => fn(payload));
  }

  public on(event: string, handler: Function) {
    const handlers = this.listeners.get(event) || [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
  }
}
