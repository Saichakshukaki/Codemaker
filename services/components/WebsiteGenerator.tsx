import React, { useState } from 'react';
import { Github, ExternalLink, Sparkles } from 'lucide-react';

interface WebsiteGeneratorProps {
  systemStatus: any;
  setSystemStatus: (status: any) => void;
}

export function WebsiteGenerator({ systemStatus, setSystemStatus }: WebsiteGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generateSite = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("https://codemaker-backend.onrender.com/generate", {
        method: "POST"
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Unknown error");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError("Something went wrong: " + err.message);
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

      {error && (
        <div className="mt-4 text-red-500">{error}</div>
      )}

      {result && (
        <div className="p-4 border mt-6 rounded-lg bg-white dark:bg-gray-800">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            <Sparkles className="inline-block mr-2 text-yellow-400" />
            {result.idea}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Website files have been saved to GitHub repo in <code>/generated</code> folder.
          </p>

          <div className="flex space-x-4">
            <a
              href={`https://github.com/Saichakshukaki/Codemaker/tree/main/generated`}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              <span>View Code</span>
            </a>

            <a
              href={`https://saichakshukaki.github.io/Codemaker/generated/index.html`}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              target="_blank"
              rel="noopener noreferrer"
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
