import React, { useState } from 'react';

export function WebsiteGenerator({ systemStatus, setSystemStatus }: any) {
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState('');
  const [files, setFiles] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');

  const generateWebsite = async () => {
    setLoading(true);
    setError('');
    setIdea('');
    setFiles({});

    try {
      const response = await fetch('https://codemaker-backend.onrender.com/generate', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Backend failed to respond');
      }

      const data = await response.json();
      setIdea(data.idea);
      setFiles(data.files);

      const now = new Date().toISOString();
      setSystemStatus((prev: any) => ({
        ...prev,
        lastRun: now,
        totalSites: prev.totalSites + 1,
        currentTask: `Generated: ${data.idea}`,
      }));
      localStorage.setItem('lastRun', now);
      localStorage.setItem('totalSites', (systemStatus.totalSites + 1).toString());
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={generateWebsite}
        disabled={loading}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {loading ? 'Generating...' : 'Generate New Website'}
      </button>

      {error && <p className="text-red-500">Error: {error}</p>}

      {idea && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">💡 Idea:</h3>
          <p className="text-gray-700 dark:text-gray-300">{idea}</p>
        </div>
      )}

      {Object.keys(files).length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="text-md font-bold text-gray-800 dark:text-gray-100">📁 Generated Files:</h4>
          {Object.entries(files).map(([filename, content]) => (
            <div key={filename} className="border border-gray-300 dark:border-gray-700 p-3 rounded bg-white dark:bg-gray-800">
              <h5 className="font-mono text-sm text-blue-600 dark:text-blue-300">{filename}</h5>
              <pre className="whitespace-pre-wrap text-sm mt-2 text-gray-800 dark:text-gray-200 overflow-x-auto">
                {content}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
