from flask import Flask, request, jsonify
import os
import base64
import requests
import traceback

app = Flask(__name__)

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")

REPO_OWNER = "Saichakshukaki"
REPO_NAME = "Codemaker"

@app.route('/generate', methods=['POST'])
def generate():
    try:
        print("🔄 Starting generation")

        # Step 1: Get AI response from OpenRouter
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "mistral:instruct",  # or another OpenRouter model you selected
            "messages": [
                {"role": "system", "content": "You are a website generator bot. You generate simple, creative, and useful websites."},
                {"role": "user", "content": "Generate a creative website idea and include index.html, style.css, and script.js"}
            ]
        }

        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)

        if response.status_code != 200:
            print("❌ OpenRouter failed:", response.status_code, response.text)
            return jsonify({"error": "AI generation failed"}), 500

        ai_reply = response.json()['choices'][0]['message']['content']
        print("✅ AI replied!")

        # Assume AI sends output in format:
        # IDEA: Tip Calculator
        # FILE: index.html
        # <html>...</html>
        # FILE: style.css
        # body {...}
        # FILE: script.js
        # console.log(...)

        parts = ai_reply.split("FILE:")
        idea = parts[0].replace("IDEA:", "").strip()
        files = {}

        for part in parts[1:]:
            lines = part.strip().split("\n")
            filename = lines[0].strip()
            content = "\n".join(lines[1:])
            files[filename] = content

        # Step 2: Upload each file to GitHub
        for filename, content in files.items():
            upload_to_github(filename, content)

        print("✅ All files uploaded to GitHub!")

        return jsonify({
            "idea": idea,
            "files": files
        })

    except Exception as e:
        print("❌ ERROR:")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500

def upload_to_github(filename, content):
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/generated/{filename}"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    # Check if file exists
    resp = requests.get(url, headers=headers)
    sha = resp.json().get('sha') if resp.status_code == 200 else None

    data = {
        "message": f"Add {filename}",
        "content": base64.b64encode(content.encode()).decode(),
        "branch": "main"
    }

    if sha:
        data["sha"] = sha

    res = requests.put(url, headers=headers, json=data)
    print(f"📁 Uploaded {filename}:", res.status_code)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
