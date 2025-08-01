export class CodeGenerator {
  public static generateHTML(idea: any): string {
    const templates = {
      games: this.generateGameHTML,
      tools: this.generateToolHTML,
      educational: this.generateEducationalHTML,
      creative: this.generateCreativeHTML,
      productivity: this.generateProductivityHTML
    };

    const generator = templates[idea.category as keyof typeof templates] || templates.tools;
    return generator(idea);
  }

  public static generateCSS(idea: any): string {
    return `
/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 600px;
  width: 100%;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 10px;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

input, select {
  padding: 12px 20px;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 1rem;
  margin: 10px;
  transition: border-color 0.3s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: #667eea;
}

.result {
  background: #f8f9ff;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  border-left: 4px solid #667eea;
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
    margin: 10px;
  }
  
  h1 {
    font-size: 2rem;
  }
}
`;
  }

  public static generateJavaScript(idea: any): string {
    const templates = {
      games: this.generateGameJS,
      tools: this.generateToolJS,
      educational: this.generateEducationalJS,
      creative: this.generateCreativeJS,
      productivity: this.generateProductivityJS
    };

    const generator = templates[idea.category as keyof typeof templates] || templates.tools;
    return generator(idea);
  }

  private static generateGameHTML(idea: any): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${idea.name}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>${idea.name}</h1>
        <p class="subtitle">${idea.description}</p>
        
        <div id="gameArea">
            <div id="score">Score: <span id="scoreValue">0</span></div>
            <div id="gameBoard"></div>
            <button id="startBtn">Start Game</button>
            <button id="resetBtn">Reset</button>
        </div>
        
        <div id="instructions">
            <h3>How to Play</h3>
            <p>Use your mouse or touch to interact with the game elements.</p>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
`;
  }

  private static generateToolHTML(idea: any): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${idea.name}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>${idea.name}</h1>
        <p class="subtitle">${idea.description}</p>
        
        <div id="toolInterface">
            <div class="input-group">
                <label for="inputField">Enter value:</label>
                <input type="text" id="inputField" placeholder="Type here...">
            </div>
            
            <div class="controls">
                <button id="processBtn">Process</button>
                <button id="clearBtn">Clear</button>
                <button id="copyBtn">Copy Result</button>
            </div>
            
            <div id="result" class="result">
                <p>Result will appear here...</p>
            </div>
        </div>
        
        <div class="features">
            <h3>Features</h3>
            <ul>
                <li>Fast processing</li>
                <li>Copy to clipboard</li>
                <li>Mobile friendly</li>
            </ul>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
`;
  }

  private static generateGameJS(idea: any): string {
    return `
class Game {
    constructor() {
        this.score = 0;
        this.isPlaying = false;
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('scoreValue');
        
        this.initializeEventListeners();
        this.setupGame();
    }
    
    initializeEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }
    
    setupGame() {
        this.gameBoard.innerHTML = '';
        // Create game elements
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'game-cell';
            cell.addEventListener('click', () => this.handleCellClick(i));
            this.gameBoard.appendChild(cell);
        }
    }
    
    start() {
        this.isPlaying = true;
        document.getElementById('startBtn').textContent = 'Playing...';
        document.getElementById('startBtn').disabled = true;
    }
    
    handleCellClick(index) {
        if (!this.isPlaying) return;
        
        const cells = this.gameBoard.children;
        if (cells[index].classList.contains('clicked')) return;
        
        cells[index].classList.add('clicked');
        cells[index].textContent = '✓';
        
        this.updateScore(10);
        
        // Check win condition
        if (this.checkWin()) {
            this.win();
        }
    }
    
    updateScore(points) {
        this.score += points;
        this.scoreElement.textContent = this.score;
    }
    
    checkWin() {
        const cells = Array.from(this.gameBoard.children);
        return cells.every(cell => cell.classList.contains('clicked'));
    }
    
    win() {
        this.isPlaying = false;
        alert('Congratulations! You won!');
        document.getElementById('startBtn').textContent = 'Play Again';
        document.getElementById('startBtn').disabled = false;
    }
    
    reset() {
        this.score = 0;
        this.isPlaying = false;
        this.scoreElement.textContent = '0';
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('startBtn').disabled = false;
        
        const cells = this.gameBoard.children;
        Array.from(cells).forEach(cell => {
            cell.classList.remove('clicked');
            cell.textContent = '';
        });
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});

// Add some game-specific CSS
const style = document.createElement('style');
style.textContent = \`
    #gameBoard {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin: 20px 0;
        max-width: 300px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .game-cell {
        aspect-ratio: 1;
        background: #f0f0f0;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 2rem;
    }
    
    .game-cell:hover {
        background: #e0e0e0;
        transform: scale(0.95);
    }
    
    .game-cell.clicked {
        background: #667eea;
        color: white;
    }
    
    #score {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 20px;
    }
\`;
document.head.appendChild(style);
`;
  }

  private static generateToolJS(idea: any): string {
    return `
class Tool {
    constructor() {
        this.inputField = document.getElementById('inputField');
        this.resultDiv = document.getElementById('result');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        document.getElementById('processBtn').addEventListener('click', () => this.process());
        document.getElementById('clearBtn').addEventListener('click', () => this.clear());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyResult());
        
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.process();
            }
        });
    }
    
    process() {
        const input = this.inputField.value.trim();
        
        if (!input) {
            this.showResult('Please enter a value to process.', 'error');
            return;
        }
        
        try {
            const result = this.performCalculation(input);
            this.showResult(result, 'success');
        } catch (error) {
            this.showResult('Error processing input: ' + error.message, 'error');
        }
    }
    
    performCalculation(input) {
        // Generic processing - can be customized based on tool type
        if (this.isNumeric(input)) {
            const num = parseFloat(input);
            return \`
                <h4>Number Analysis</h4>
                <p><strong>Value:</strong> \${num}</p>
                <p><strong>Squared:</strong> \${num * num}</p>
                <p><strong>Square Root:</strong> \${Math.sqrt(num).toFixed(2)}</p>
                <p><strong>Binary:</strong> \${num.toString(2)}</p>
            \`;
        } else {
            return \`
                <h4>Text Analysis</h4>
                <p><strong>Length:</strong> \${input.length} characters</p>
                <p><strong>Words:</strong> \${input.split(/\\s+/).length}</p>
                <p><strong>Uppercase:</strong> \${input.toUpperCase()}</p>
                <p><strong>Reversed:</strong> \${input.split('').reverse().join('')}</p>
            \`;
        }
    }
    
    isNumeric(str) {
        return !isNaN(str) && !isNaN(parseFloat(str));
    }
    
    showResult(content, type = 'success') {
        this.resultDiv.innerHTML = content;
        this.resultDiv.className = \`result \${type}\`;
        this.resultDiv.style.display = 'block';
    }
    
    clear() {
        this.inputField.value = '';
        this.resultDiv.innerHTML = '<p>Result will appear here...</p>';
        this.resultDiv.className = 'result';
        this.inputField.focus();
    }
    
    copyResult() {
        const text = this.resultDiv.textContent;
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Result copied to clipboard!');
        }).catch(() => {
            this.showToast('Failed to copy result', 'error');
        });
    }
    
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = \`toast \${type}\`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize tool when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Tool();
});

// Add toast styles
const style = document.createElement('style');
style.textContent = \`
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }
    
    .toast.success {
        background: #10b981;
    }
    
    .toast.error {
        background: #ef4444;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    .result.error {
        background: #fee2e2;
        border-left-color: #ef4444;
        color: #dc2626;
    }
\`;
document.head.appendChild(style);
`;
  }

  private static generateEducationalHTML = (idea: any) => this.generateToolHTML(idea);
  private static generateCreativeHTML = (idea: any) => this.generateToolHTML(idea);
  private static generateProductivityHTML = (idea: any) => this.generateToolHTML(idea);
  
  private static generateEducationalJS = (idea: any) => this.generateToolJS(idea);
  private static generateCreativeJS = (idea: any) => this.generateToolJS(idea);
  private static generateProductivityJS = (idea: any) => this.generateToolJS(idea);
}