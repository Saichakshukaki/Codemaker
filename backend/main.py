from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import requests

app = Flask(__name__)
CORS(app)

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
REPO_OWNER = "Saichakshukaki"
REPO_NAME = "Codemaker"

@app.route('/generate', methods=['POST'])
def generate():
    # Ask AI for a website idea and code
    prompt = "Give me a fun, original website idea that includes: 1. a name, 2. a short description, 3. one index.html file, 4. one style.css file, 5. one script.js file. Return them as JSON with keys: idea, html, css, js."

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "https://codemaker.saichakshukaki.repl.co",  # change to your site URL later if needed
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openrouter/deepseek-coder:7b-instruct",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)

    if response.status_code != 200:
        return jsonify({"error": "AI request failed", "details": response.text}), 500

    try:
        result = response.json()['choices'][0]['message']['content']
        parsed = eval(result)  # We'll safely format this better later
    except Exception as e:
        return jsonify({"error": "Could not parse AI response", "details": str(e)}), 500

    idea = parsed.get("idea", "Unnamed Idea")
    html = parsed.get("html", "")
    css = parsed.get("css", "")
    js = parsed.get("js", "")

    files = {
        "index.html": html,
        "style.css": css,
        "script.js": js
    }

    for filename, content in files.items():
        upload_to_github(filename, content)

    return jsonify({
        "idea": idea,
        "files": files
    })

def upload_to_github(filename, content):
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/generated/{filename}"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    get_resp = requests.get(url, headers=headers)
    sha = get_resp.json().get('sha') if get_resp.status_code == 200 else None

    data = {
        "message": f"Add {filename}",
        "content": base64.b64encode(content.encode()).decode(),
        "branch": "main"
    }

    if sha:
        data["sha"] = sha

    put_resp = requests.put(url, headers=headers, json=data)
    print(f"Uploaded {filename}: {put_resp.status_code}")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
