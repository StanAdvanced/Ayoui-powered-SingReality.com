export interface LogEntry {
  message: string;
  error?: Error;
  errorInfo?: any;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
}

class MonitoringService {
  private logs: LogEntry[] = [];

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
      localStorage.setItem('singreality_logs', JSON.stringify(savedLogs.slice(-100))); // Keep last 100
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

  getLogs() {
    return this.logs;
  }
}

export const monitoringService = new MonitoringService();
