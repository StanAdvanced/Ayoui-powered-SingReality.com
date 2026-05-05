export interface LogEntry {
  message: string;
  error?: Error;
  errorInfo?: any;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
}

class MonitoringService {
  private logs: LogEntry[] = [];

  private safeStringify(obj: any): string {
    const cache = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        // Handle common circular/massive DOM-related objects
        if (value.nodeType === 1 || value instanceof HTMLElement) return `[${value.tagName || 'HTML'} Element]`;
        if (value === window) return '[Window]';
        if (value === document) return '[Document]';
        
        if (cache.has(value)) return '[Circular]';
        
        // Handle Error objects specifically as they don't stringify well
        if (value instanceof Error) {
          return {
            name: value.name,
            message: value.message,
            stack: value.stack
          };
        }
        
        cache.add(value);
      }
      return value;
    });
  }

  log(message: string, level: 'info' | 'warn' | 'error' = 'info', error?: Error, errorInfo?: any) {
    const entry: LogEntry = {
      message,
      level,
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
    };
    this.logs.push(entry);
    
    // In a real app, we would send this to Sentry, LogRocket, or a custom backend
    console.log(`[Monitoring] [${level.toUpperCase()}] ${message}`, error || '');
    
    // Persist to localStorage for debugging in this demo
    try {
      const savedLogs = JSON.parse(localStorage.getItem('singreality_logs') || '[]');
      savedLogs.push(entry);
      localStorage.setItem('singreality_logs', this.safeStringify(savedLogs.slice(-100))); // Keep last 100
    } catch (e) {
      // Ignore storage errors
    }
  }

  error(message: string, error?: Error, errorInfo?: any) {
    this.log(message, 'error', error, errorInfo);
  }

  warn(message: string) {
    this.log(message, 'warn');
  }

  info(message: string) {
    this.log(message, 'info');
  }

  success(message: string) {
    this.log(message, 'info'); // Using info level for success in this simple logger
  }

  getLogs() {
    return this.logs;
  }
}

export const monitoringService = new MonitoringService();
