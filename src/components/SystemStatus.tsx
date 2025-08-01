import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle, AlertCircle, Play, Pause, RotateCw } from 'lucide-react';

interface SystemStatusProps {
  systemStatus: any;
  setSystemStatus: (status: any) => void;
}

export function SystemStatus({ systemStatus, setSystemStatus }: SystemStatusProps) {
  const [logs, setLogs] = useState<Array<{
    id: string;
    timestamp: string;
    level: 'info' | 'success' | 'warning' | 'error';
    message: string;
    details?: string;
  }>>(() => {
    const saved = localStorage.getItem('systemLogs');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'System initialized',
        details: 'Autonomous AI Website Generator is ready'
      }
    ];
  });

  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  useEffect(() => {
    localStorage.setItem('systemLogs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        // Simulate system activity
        if (Math.random() > 0.7) {
          const newLog = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            level: ['info', 'success'][Math.floor(Math.random() * 2)] as 'info' | 'success',
            message: [
              'Monitoring system health',
              'Checking for scheduled tasks',
              'Validating deployment status',
              'Optimizing performance metrics'
            ][Math.floor(Math.random() * 4)]
          };
          setLogs(prev => [newLog, ...prev.slice(0, 49)]);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAutoRefresh]);

  const addLog = (level: 'info' | 'success' | 'warning' | 'error', message: string, details?: string) => {
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level,
      message,
      details
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const simulateGeneration = async () => {
    setSystemStatus((prev: any) => ({ ...prev, isRunning: true, currentTask: 'Generating website idea...' }));
    addLog('info', 'Starting website generation process');

    // Simulate the generation process
    const steps = [
      { task: 'Generating website idea...', duration: 2000 },
      { task: 'Creating HTML structure...', duration: 3000 },
      { task: 'Generating CSS styles...', duration: 2500 },
      { task: 'Adding JavaScript functionality...', duration: 3500 },
      { task: 'Testing and fixing bugs...', duration: 2000 },
      { task: 'Deploying to GitHub Pages...', duration: 4000 },
      { task: 'Updating dashboard...', duration: 1000 }
    ];

    for (const step of steps) {
      setSystemStatus((prev: any) => ({ ...prev, currentTask: step.task }));
      addLog('info', step.task);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    // Create a mock website
    const mockWebsite = {
      id: Date.now().toString(),
      name: `Daily Site ${new Date().toLocaleDateString()}`,
      description: [
        'Interactive tip calculator with bill splitting',
        'Weather dashboard with 7-day forecast',
        'Pomodoro timer with productivity tracking',
        'Random quote generator with social sharing',
        'Color palette generator for designers'
      ][Math.floor(Math.random() * 5)],
      category: ['tools', 'games', 'educational', 'creative', 'utilities'][Math.floor(Math.random() * 5)],
      url: `https://ai-gen-${Date.now()}.github.io`,
      createdAt: new Date().toISOString(),
      status: 'deployed' as const,
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'GitHub Pages'],
      stats: {
        visits: 0,
        uptime: 99.9
      }
    };

    // Update local storage
    const existingWebsites = JSON.parse(localStorage.getItem('generatedWebsites') || '[]');
    existingWebsites.unshift(mockWebsite);
    localStorage.setItem('generatedWebsites', JSON.stringify(existingWebsites));

    setSystemStatus((prev: any) => ({
      ...prev,
      isRunning: false,
      currentTask: null,
      lastRun: new Date().toISOString(),
      totalSites: prev.totalSites + 1
    }));

    localStorage.setItem('lastRun', new Date().toISOString());
    localStorage.setItem('totalSites', (parseInt(localStorage.getItem('totalSites') || '0') + 1).toString());

    addLog('success', 'Website generation completed successfully', `Created: ${mockWebsite.name}`);
  };

  const getStatusColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getStatusIcon = (level: string) => {
    switch (level) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h3>
              <p className={`text-sm ${systemStatus.isRunning ? 'text-green-600' : 'text-gray-600'} dark:text-gray-400`}>
                {systemStatus.isRunning ? 'Running' : 'Idle'}
              </p>
            </div>
            <div className={`p-2 rounded-full ${systemStatus.isRunning ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'} dark:bg-gray-700`}>
              {systemStatus.isRunning ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </div>
          </div>
          {systemStatus.currentTask && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">{systemStatus.currentTask}</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Last Run</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {systemStatus.lastRun ? 
                  new Date(systemStatus.lastRun).toLocaleString() : 
                  'Never'
                }
              </p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Next Run</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {systemStatus.nextRun ? 
                  new Date(systemStatus.nextRun).toLocaleString() : 
                  'Calculating...'
                }
              </p>
            </div>
            <RotateCw className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manual Controls</h3>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={isAutoRefresh}
                onChange={(e) => setIsAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Auto-refresh logs</span>
            </label>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={simulateGeneration}
            disabled={systemStatus.isRunning}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Generate Website Now</span>
          </button>
          
          <button
            onClick={() => setLogs([])}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* System Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Logs</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Real-time system activity</p>
        </div>
        
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {logs.map(log => {
            const StatusIcon = getStatusIcon(log.level);
            return (
              <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <StatusIcon className={`w-4 h-4 mt-0.5 ${getStatusColor(log.level)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {log.message}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {log.details && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {log.details}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}