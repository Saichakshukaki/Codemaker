import React, { useState } from 'react';
import { Lightbulb, Github, ExternalLink } from 'lucide-react';

interface WebsiteGeneratorProps {
  systemStatus: any;
  setSystemStatus: (status: any) => void;
}

export function WebsiteGenerator({ systemStatus, setSystemStatus }: WebsiteGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generateSite = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("https://codemaker-backend.onrender.com/generate", {
        method: "POST"
      });

      if (!res.ok) throw new Error("Failed to generate");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error generating site:", err);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Website Generator</h2>

      <button
        onClick={generateSite}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Generating..." : "Generate New Idea"}
      </button>

      {result && (
        <div className="p-4 border mt-6 rounded-lg bg-white dark:bg-gray-800">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{result.idea}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Your site files were saved to GitHub under <code>/generated</code>.</p>

          <div className="flex space-x-4 mb-4">
            <a
              href={`https://github.com/Saichakshukaki/Codemaker/tree/main/generated`}
              target="_blank"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:underline"
            >
              <Github className="w-4 h-4" />
              <span>View Code</span>
            </a>
            <a
              href={`https://saichakshukaki.github.io/Codemaker/generated/index.html`}
              target="_blank"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demo</span>
            </a>
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 rounded p-4 space-y-2 text-sm">
            {Object.entries(result.files).map(([filename, content]) => (
              <div key={filename}>
                <h4 className="font-bold text-gray-800 dark:text-white mb-1">{filename}</h4>
                <pre className="overflow-x-auto whitespace-pre-wrap text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 p-2 rounded">
                  {content}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
