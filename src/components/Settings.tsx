import React, { useState } from 'react';
import { Save, Github, Globe, Clock, Zap, Shield } from 'lucide-react';

export function Settings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('systemSettings');
    return saved ? JSON.parse(saved) : {
      githubUsername: '',
      deploymentTime: '03:00',
      categories: {
        games: true,
        tools: true,
        educational: true,
        creative: true,
        productivity: true
      },
      automation: {
        enabled: true,
        testBeforeDeploy: true,
        backupCode: true,
        notifyOnComplete: false
      },
      advanced: {
        codeOptimization: true,
        seoOptimization: true,
        accessibilityCheck: true,
        performanceAudit: true
      }
    };
  });

  const handleSave = () => {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const updateSetting = (path: string, value: any) => {
    setSettings((prev: any) => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  return (
    <div className="space-y-6">
      {/* GitHub Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Github className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            GitHub Configuration
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GitHub Username
            </label>
            <input
              type="text"
              value={settings.githubUsername}
              onChange={(e) => updateSetting('githubUsername', e.target.value)}
              placeholder="your-github-username"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Used for creating repositories and GitHub Pages deployment
            </p>
          </div>
        </div>
      </div>

      {/* Automation Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Automation Settings
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Daily Generation Time
            </label>
            <input
              type="time"
              value={settings.deploymentTime}
              onChange={(e) => updateSetting('deploymentTime', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            {[
              { key: 'enabled', label: 'Enable Automatic Generation', desc: 'Generate websites daily without manual intervention' },
              { key: 'testBeforeDeploy', label: 'Test Before Deployment', desc: 'Run automated tests before publishing' },
              { key: 'backupCode', label: 'Backup Generated Code', desc: 'Keep local backups of all generated code' },
              { key: 'notifyOnComplete', label: 'Completion Notifications', desc: 'Show notifications when generation completes' }
            ].map(item => (
              <label key={item.key} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={settings.automation[item.key]}
                  onChange={(e) => updateSetting(`automation.${item.key}`, e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Website Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Website Categories
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(settings.categories).map(([category, enabled]) => (
            <label key={category} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => updateSetting(`categories.${category}`, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quality Assurance
          </h3>
        </div>
        
        <div className="space-y-3">
          {[
            { key: 'codeOptimization', label: 'Code Optimization', desc: 'Minify and optimize generated code' },
            { key: 'seoOptimization', label: 'SEO Optimization', desc: 'Add meta tags and SEO-friendly structure' },
            { key: 'accessibilityCheck', label: 'Accessibility Validation', desc: 'Ensure WCAG compliance' },
            { key: 'performanceAudit', label: 'Performance Audit', desc: 'Optimize for speed and efficiency' }
          ].map(item => (
            <label key={item.key} className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={settings.advanced[item.key]}
                onChange={(e) => updateSetting(`advanced.${item.key}`, e.target.checked)}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.label}
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
}