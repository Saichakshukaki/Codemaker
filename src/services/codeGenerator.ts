export async function generateWebsiteCode() {
  const response = await fetch('https://codemaker-backend.onrender.com/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to generate site');
  }

  const data = await response.json();
  return data;
}
