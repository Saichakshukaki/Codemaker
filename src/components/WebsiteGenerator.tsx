import React, { useState } from 'react';
import { Lightbulb, Code, Bug, Rocket, Github, ExternalLink } from 'lucide-react';

interface WebsiteGeneratorProps {
  systemStatus: any;
  setSystemStatus: (status: any) => void;
}

export function WebsiteGenerator({ systemStatus, setSystemStatus }: WebsiteGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [generationStep, setGenerationStep] = useState(0);
  const [currentIdea, setCurrentIdea] = useState<any>(null);

  const categories = [
    { id: 'random', name: 'Random', description: 'Let AI choose the best category' },
    { id: 'games', name: 'Games', description: 'Interactive browser games and puzzles' },
    { id: 'tools', name: 'Tools', description: 'Useful calculators and utilities' },
    { id: 'educational', name: 'Educational', description: 'Learning resources and references' },
    { id: 'creative', name: 'Creative', description: 'Art, design, and creative tools' },
    { id: 'productivity', name: 'Productivity', description: 'Time management and organization' }
  ];

  const websiteIdeas = {
    games: [
      { name: 'Tic-Tac-Toe AI', description: 'Classic game with unbeatable AI opponent', features: ['AI difficulty levels', 'Score tracking', 'Sound effects'] },
      { name: 'Snake Game', description: 'Modern take on the classic snake game', features: ['High scores', 'Speed controls', 'Colorful graphics'] },
      { name: 'Memory Card Game', description: 'Flip cards to find matching pairs', features: ['Multiple themes', 'Timer challenge', 'Difficulty levels'] }
    ],
    tools: [
      { name: 'Advanced Tip Calculator', description: 'Split bills and calculate tips easily', features: ['Bill splitting', 'Tax calculation', 'Custom tip amounts'] },
      { name: 'Password Generator', description: 'Generate secure passwords', features: ['Customizable length', 'Character options', 'Strength meter'] },
      { name: 'Color Palette Generator', description: 'Create beautiful color schemes', features: ['Export formats', 'Accessibility check', 'Trend colors'] }
    ],
    educational: [
      { name: 'Periodic Table Explorer', description: 'Interactive periodic table with element details', features: ['Element search', 'Properties display', 'Visual grouping'] },
      { name: 'Math Practice Hub', description: 'Practice arithmetic with timed challenges', features: ['Multiple operations', 'Progress tracking', 'Difficulty adjustment'] },
      { name: 'World Geography Quiz', description: 'Test your knowledge of countries and capitals', features: ['Multiple game modes', 'Score leaderboard', 'Fact learning'] }
    ],
    creative: [
      { name: 'ASCII Art Generator', description: 'Convert text and images to ASCII art', features: ['Multiple fonts', 'Export options', 'Custom sizing'] },
      { name: 'Gradient Generator', description: 'Create beautiful CSS gradients', features: ['Live preview', 'Code export', 'Preset collections'] },
      { name: 'Logo Maker', description: 'Simple logo creation tool', features: ['Icon library', 'Text customization', 'Download formats'] }
    ],
    productivity: [
      { name: 'Pomodoro Timer Pro', description: 'Advanced time management with statistics', features: ['Custom intervals', 'Task tracking', 'Break reminders'] },
      { name: 'Daily Habit Tracker', description: 'Track and build positive habits', features: ['Visual progress', 'Streak counters', 'Goal setting'] },
      { name: 'Meeting Notes App', description: 'Quick note-taking for meetings', features: ['Auto-save', 'Export options', 'Template library'] }
    ]
  };

  const generateIdea = () => {
    const category = selectedCategory === 'random' ? 
      Object.keys(websiteIdeas)[Math.floor(Math.random() * Object.keys(websiteIdeas).length)] :
      selectedCategory;
    
    const ideas = websiteIdeas[category as keyof typeof websiteIdeas] || websiteIdeas.tools;
    const idea = ideas[Math.floor(Math.random() * ideas.length)];
    
    setCurrentIdea({
      ...idea,
      category,
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Local Storage'],
      estimatedTime: Math.floor(Math.random() * 6) + 2 + ' hours'
    });
    
    setGenerationStep(1);
  };

  const steps = [
    { id: 1, name: 'Idea Generation', icon: Lightbulb, description: 'AI generates creative website concept' },
    { id: 2, name: 'Code Generation', icon: Code, description: 'Full stack code generation with best practices' },
    { id: 3, name: 'Testing & Debugging', icon: Bug, description: 'Automated testing and bug fixes' },
    { id: 4, name: 'Deployment', icon: Rocket, description: 'Deploy to GitHub Pages automatically' }
  ];

  return (
    <div className="space-y-6">
      {/* Generator Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          AI Website Generator
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The AI system follows a systematic approach to create high-quality websites from concept to deployment.
        </p>

        {/* Generation Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className={`p-4 rounded-lg border-2 ${
              generationStep >= step.id ? 
                'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20' :
                'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
            }`}>
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  generationStep >= step.id ? 
                    'bg-blue-600 text-white' : 
                    'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                }`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{step.name}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Website Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedCategory === category.id ?
                  'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20' :
                  'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
            >
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{category.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current Idea Display */}
      {currentIdea && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Generated Idea
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
              {currentIdea.category}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-xl mb-2">
                {currentIdea.name}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {currentIdea.description}
              </p>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Key Features:</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {currentIdea.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Technologies: {currentIdea.technologies.join(', ')}</span>
                <span>•</span>
                <span>Est. Time: {currentIdea.estimatedTime}</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Github className="w-4 h-4" />
                  <span>View Code</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={generateIdea}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Lightbulb className="w-5 h-5" />
          <span>Generate New Idea</span>
        </button>
      </div>
    </div>
  );
}