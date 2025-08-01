import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { SystemStatus } from './components/SystemStatus';
import { WebsiteGenerator } from './components/WebsiteGenerator';
import { Settings } from './components/Settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/Tabs';
import { Brain, Globe, Settings as SettingsIcon, Activity } from 'lucide-react';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [systemStatus, setSystemStatus] = useState({
    isRunning: false,
    lastRun: localStorage.getItem('lastRun') || null,
    nextRun: null,
    totalSites: parseInt(localStorage.getItem('totalSites') || '0'),
    currentTask: null
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Calculate next run time (daily at 3 AM)
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(3, 0, 0, 0);
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    setSystemStatus(prev => ({ ...prev, nextRun: nextRun.toISOString() }));
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Autonomous AI Website Generator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Creating and deploying websites daily, automatically
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Status</span>
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Generator</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard systemStatus={systemStatus} setSystemStatus={setSystemStatus} />
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <SystemStatus systemStatus={systemStatus} setSystemStatus={setSystemStatus} />
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <WebsiteGenerator systemStatus={systemStatus} setSystemStatus={setSystemStatus} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;