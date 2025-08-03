from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import requests
import traceback

app = Flask(__name__)
CORS(app)  # ✅ Allow frontend to call backend

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")

REPO_OWNER = "Saichakshukaki"
REPO_NAME = "Codemaker"

@app.route('/generate', methods=['POST'])
def generate():
    try:
        print("🔄 Starting generation")

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "mistral:instruct",  # ✅ Update with your selected model
            "messages": [
                {"role": "system", "content": "You are a website generator bot."},
                {"role": "user", "content": "Give me a creative website idea and HTML, CSS, and JS files for it."}
            ]
        }

        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)

        if response.status_code != 200:
            print("❌ OpenRouter error:", response.status_code, response.text)
            return jsonify({"error": "AI generation failed"}), 500

        result = response.json()['choices'][0]['message']['content']
        print("✅ AI replied with content")
        print(result)

        return jsonify({
            "idea": "Sample idea",
            "files": {
                "index.html": "<html><body><h1>Sample Site</h1></body></html>",
                "style.css": "body { background: white; }",
                "script.js": "console.log('Hello');"
            }
        })

    except Exception as e:
        print("❌ ERROR:")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500

# ✅ Use the correct port for Render hosting
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
