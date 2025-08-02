from flask import Flask, request, jsonify
import os
import base64
import requests

app = Flask(__name__)

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
REPO_OWNER = "Saichakshukaki"  # Replace with your GitHub username
REPO_NAME = "Codemaker"        # Replace with your repository name

@app.route('/')
def home():
    return jsonify({"message": "Codemaker backend is live!"})

@app.route('/generate', methods=['POST'])
def generate():
    idea = "Random Tip Calculator"
    html = "<!DOCTYPE html><html><head><title>Tip Calculator</title></head><body><h1>Tip Calculator</h1></body></html>"
    css = "body { font-family: Arial; }"
    js = "console.log('This is a placeholder for tip calculator logic');"

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

    # Check if file already exists
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        sha = response.json()['sha']
    else:
        sha = None

    payload = {
        "message": f"Add {filename}",
        "content": base64.b64encode(content.encode()).decode(),
        "branch": "main"
    }

    if sha:
        payload["sha"] = sha

    put_response = requests.put(url, headers=headers, json=payload)
    print(f"{filename} upload status:", put_response.status_code)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
