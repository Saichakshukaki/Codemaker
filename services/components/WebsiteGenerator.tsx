import React, { useState } from 'react';

export function WebsiteGenerator() {
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState('');
  const [files, setFiles] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');

  async function generateSite() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://codemaker-backend.onrender.com/generate', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to generate site');
      }
      const data = await response.json();
      setIdea(data.idea);
      setFiles(data.files);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Website Generator</h2>
      <button onClick={generateSite} disabled={loading}>
        {loading ? 'Generating...' : 'Generate New Website'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {idea && <h3>Idea: {idea}</h3>}
      {files && Object.keys(files).length > 0 && (
        <div>
          <h4>Generated Files:</h4>
          <ul>
            {Object.entries(files).map(([filename, content]) => (
              <li key={filename}>
                <strong>{filename}</strong>
                <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}>
                  {content}
                </pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
