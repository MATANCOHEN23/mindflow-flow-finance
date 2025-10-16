
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorCount: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Save error to localStorage for debugging
    try {
      const errorLog = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      const existingErrors = JSON.parse(localStorage.getItem('app-errors') || '[]');
      existingErrors.push(errorLog);
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.shift();
      }
      localStorage.setItem('app-errors', JSON.stringify(existingErrors));
    } catch (e) {
      console.error('Failed to save error to localStorage:', e);
    }
    
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));
  }

  private clearCacheAndReload = () => {
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Clear localStorage (except important data)
    try {
      const importantKeys = ['pwa-first-install', 'pwa-sessions'];
      const backup: Record<string, string> = {};
      importantKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) backup[key] = value;
      });
      
      localStorage.clear();
      
      Object.entries(backup).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
    
    // Hard reload
    window.location.href = window.location.origin;
  };

  public render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;
      const errorCode = `ERR-${Date.now().toString(36).toUpperCase()}`;
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50" dir="rtl">
          <div className="max-w-2xl mx-auto text-center p-8 bg-white rounded-2xl shadow-2xl border-2 border-red-200">
            <div className="text-7xl mb-6 animate-bounce">⚠️</div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              שגיאה במערכת
            </h2>
            
            <p className="text-gray-600 mb-6 text-lg">
              אירעה שגיאה לא צפויה. אנא בחר באחת מהאפשרויות הבאות:
            </p>
            
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                🔄 רענן דף
              </button>
              
              <button
                onClick={this.clearCacheAndReload}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                🗑️ נקה מטמון ורענן
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                🏠 חזרה לדף הבית
              </button>
            </div>
            
            {/* Error details - DEV only */}
            {isDev && this.state.error && (
              <details className="mt-6 text-right bg-red-50 p-4 rounded-lg border border-red-200">
                <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                  פרטי שגיאה (מפתחים בלבד)
                </summary>
                <div className="text-sm text-red-700 font-mono whitespace-pre-wrap text-left">
                  <p className="font-bold mb-2">{this.state.error.message}</p>
                  <p className="text-xs">{this.state.error.stack}</p>
                  {this.state.errorInfo && (
                    <p className="text-xs mt-2 border-t border-red-300 pt-2">
                      {this.state.errorInfo.componentStack}
                    </p>
                  )}
                </div>
              </details>
            )}
            
            {/* Error code for support */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                קוד שגיאה לתמיכה טכנית: <code className="bg-gray-100 px-2 py-1 rounded font-mono">{errorCode}</code>
              </p>
              {this.state.errorCount > 1 && (
                <p className="text-sm text-red-600 mt-2">
                  ⚠️ השגיאה חזרה {this.state.errorCount} פעמים - מומלץ לנקות מטמון
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
