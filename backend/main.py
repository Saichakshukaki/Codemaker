from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import requests

app = Flask(__name__)
CORS(app)  # Allow frontend to talk to backend

# GitHub info
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
REPO_OWNER = "Saichakshukaki"  # Your GitHub username
REPO_NAME = "Codemaker"         # Your GitHub repo name

def upload_to_github(filename, content):
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/generated/{filename}"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    # Check if file exists
    resp = requests.get(url, headers=headers)
    sha = resp.json()['sha'] if resp.status_code == 200 else None

    data = {
        "message": f"Add {filename}",
        "content": base64.b64encode(content.encode()).decode(),
        "branch": "main"
    }

    if sha:
        data["sha"] = sha

    res = requests.put(url, headers=headers, json=data)
    print(f"Uploaded {filename}:", res.status_code)

@app.route("/generate", methods=["POST"])
def generate():
    idea = "Random Tip Calculator"
    html = """
    <!DOCTYPE html>
    <html>
    <head><title>Tip Calculator</title><link rel='stylesheet' href='style.css'></head>
    <body>
      <h1>Tip Calculator</h1>
      <script src='script.js'></script>
    </body>
    </html>
    """
    css = "body { font-family: Arial; background-color: #f0f0f0; padding: 2rem; }"
    js = "console.log('Tip calculator logic goes here');"

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

@app.route("/")
def home():
    return "Codemaker backend is running."

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
