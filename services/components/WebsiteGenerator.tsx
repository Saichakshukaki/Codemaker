import React, { useState, useEffect } from 'react';

interface GeneratedFiles {
  idea: string;
  files: {
    "index.html": string;
    "style.css": string;
    "script.js": string;
  };
}

export function WebsiteGenerator({
  systemStatus,
  setSystemStatus
}: {
  systemStatus: any;
  setSystemStatus: any;
}) {
  const [data, setData] = useState<GeneratedFiles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://codemaker-backend.onrender.com/generate', {
      method: 'POST'
    })
      .then(res => {
        if (!res.ok) throw new Error("Backend error");
        return res.json();
      })
      .then(json => {
        setData(json);
        setSystemStatus((prev: any) => ({
          ...prev,
          isRunning: true,
          lastRun: new Date().toISOString(),
          totalSites: prev.totalSites + 1,
          currentTask: json.idea
        }));
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch website idea from backend.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Website Generator
      </h2>

      {loading && <p className="text-gray-500 dark:text-gray-400">Generating website...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {data && (
        <div className="space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            <strong>Generated Idea:</strong> {data.idea}
          </p>

          <iframe
            title="Generated Site"
            className="w-full h-[500px] border rounded-lg"
            srcDoc={`
              <html>
                <head>
                  <style>${data.files["style.css"]}</style>
                </head>
                <body>
                  ${data.files["index.html"]}
                  <script>${data.files["script.js"]}</script>
                </body>
              </html>
            `}
          />
        </div>
      )}
    </div>
  );
}
