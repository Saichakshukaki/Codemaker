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
    try {
      const res = await fetch("https://codemaker-backend.onrender.com/generate", {
        method: "POST",
      });
      console.log("Backend response status:", res.status);
      const data = await res.json();
      console.log("Backend response data:", data);
      setResult(data);
    } catch (err) {
      console.error("Error during generation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        AI Website Generator
      </h2>

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
          <p className="text-gray-600 dark:text-gray-400 mb-4">Files saved to GitHub repo in <code>/generated</code></p>

          <div className="flex space-x-4">
            <a
              href={`https://github.com/Saichakshukaki/Codemaker/tree/main/generated`}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:underline"
              target="_blank"
            >
              <Github className="w-4 h-4" />
              <span>View Code</span>
            </a>

            <a
              href={`https://saichakshukaki.github.io/Codemaker/generated/index.html`}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              target="_blank"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demo</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
