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

@app.route("/generate", methods=["POST"])
def generate():
    try:
        # Step 1: Ask OpenRouter for an idea and code
        ai_response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "togethercomputer/CodeLlama-13b-Instruct",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful AI that generates creative website ideas and simple HTML, CSS, JS code."
                    },
                    {
                        "role": "user",
                        "content": "Give me a unique website idea and generate simple HTML, CSS, and JS files for it."
                    }
                ]
            }
        )

        if ai_response.status_code != 200:
            return jsonify({"error": "Failed to fetch from OpenRouter"}), 500

        output = ai_response.json()
        full_text = output['choices'][0]['message']['content']

        # Step 2: Extract parts (for now just dummy split)
        idea = full_text.split("###")[0].strip()
        html = "<html><body><h1>Example Page</h1></body></html>"
        css = "body { font-family: Arial; }"
        js = "console.log('Hello from AI!');"

        files = {
            "index.html": html,
            "style.css": css,
            "script.js": js
        }

        # Step 3: Upload to GitHub
        for filename, content in files.items():
            upload_to_github(filename, content)

        return jsonify({
            "idea": idea,
            "files": files
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


def upload_to_github(filename, content):
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/generated/{filename}"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    # Check if file exists
    get_resp = requests.get(url, headers=headers)
    sha = get_resp.json().get("sha") if get_resp.status_code == 200 else None

    data = {
        "message": f"Add {filename}",
        "content": base64.b64encode(content.encode()).decode(),
        "branch": "main"
    }

    if sha:
        data["sha"] = sha

    put_resp = requests.put(url, headers=headers, json=data)
    print(f"{filename} → GitHub:", put_resp.status_code)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
