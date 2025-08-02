from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Hello from Codemaker backend!"})

@app.route('/generate', methods=['POST'])
def generate():
    # Simulate thinking of an idea
    idea = "A tip calculator"
    html = "<!DOCTYPE html><html><head><title>Tip Calculator</title></head><body><h1>Tip Calculator</h1></body></html>"
    css = "body { font-family: Arial; }"
    js = "console.log('This is a placeholder for tip calculator logic');"

    return jsonify({
        "idea": idea,
        "files": {
            "index.html": html,
            "style.css": css,
            "script.js": js
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
