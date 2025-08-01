export class AutomationService {
  private static instance: AutomationService;
  private isRunning = false;
  private scheduledTask: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeScheduler();
  }

  public static getInstance(): AutomationService {
    if (!AutomationService.instance) {
      AutomationService.instance = new AutomationService();
    }
    return AutomationService.instance;
  }

  private initializeScheduler() {
    // Check if we should run daily automation
    const settings = this.getSettings();
    if (settings.automation.enabled) {
      this.scheduleNextRun();
    }
  }

  private scheduleNextRun() {
    const settings = this.getSettings();
    const [hours, minutes] = settings.deploymentTime.split(':').map(Number);
    
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);
    
    // If the time has passed today, schedule for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const timeUntilRun = nextRun.getTime() - now.getTime();
    
    this.scheduledTask = setTimeout(() => {
      this.runAutomation();
    }, timeUntilRun);
    
    console.log(`Next automation scheduled for: ${nextRun.toLocaleString()}`);
  }

  private async runAutomation() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Starting automated website generation...');
    
    try {
      const website = await this.generateWebsite();
      await this.deployWebsite(website);
      this.updateDashboard(website);
      
      console.log('Automation completed successfully');
    } catch (error) {
      console.error('Automation failed:', error);
    } finally {
      this.isRunning = false;
      this.scheduleNextRun(); // Schedule next run
    }
  }

  private async generateWebsite() {
    const settings = this.getSettings();
    const enabledCategories = Object.entries(settings.categories)
      .filter(([_, enabled]) => enabled)
      .map(([category]) => category);
    
    const category = enabledCategories[Math.floor(Math.random() * enabledCategories.length)];
    
    // Simulate website generation
    const websiteIdeas = {
      games: [
        { name: 'Memory Match Game', description: 'Test your memory with this engaging card matching game' },
        { name: 'Word Scramble', description: 'Unscramble words to test your vocabulary' },
        { name: 'Number Puzzle', description: 'Solve number sequences and patterns' }
      ],
      tools: [
        { name: 'Unit Converter', description: 'Convert between different units of measurement' },
        { name: 'QR Code Generator', description: 'Generate QR codes for text and URLs' },
        { name: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64 strings' }
      ],
      educational: [
        { name: 'Solar System Explorer', description: 'Learn about planets and space' },
        { name: 'Language Flashcards', description: 'Practice vocabulary in different languages' },
        { name: 'Chemistry Elements', description: 'Explore the periodic table interactively' }
      ],
      creative: [
        { name: 'Pattern Maker', description: 'Create beautiful geometric patterns' },
        { name: 'Color Mixer', description: 'Experiment with color combinations' },
        { name: 'Typography Tester', description: 'Preview text with different fonts' }
      ],
      productivity: [
        { name: 'Goal Tracker', description: 'Track and achieve your personal goals' },
        { name: 'Time Zones', description: 'Compare times across different time zones' },
        { name: 'Quick Notes', description: 'Take and organize quick notes' }
      ]
    };

    const ideas = websiteIdeas[category as keyof typeof websiteIdeas] || websiteIdeas.tools;
    const idea = ideas[Math.floor(Math.random() * ideas.length)];
    
    return {
      id: Date.now().toString(),
      name: idea.name,
      description: idea.description,
      category,
      url: `https://ai-gen-${Date.now()}.github.io`,
      createdAt: new Date().toISOString(),
      status: 'deployed' as const,
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'GitHub Pages'],
      stats: {
        visits: 0,
        uptime: 99.9
      }
    };
  }

  private async deployWebsite(website: any) {
    // Simulate deployment process
    console.log(`Deploying ${website.name}...`);
    
    // In a real implementation, this would:
    // 1. Generate the actual HTML, CSS, and JavaScript code
    // 2. Create a GitHub repository
    // 3. Push the code to the repository
    // 4. Enable GitHub Pages
    // 5. Wait for deployment to complete
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Deployment completed');
  }

  private updateDashboard(website: any) {
    const existingWebsites = JSON.parse(localStorage.getItem('generatedWebsites') || '[]');
    existingWebsites.unshift(website);
    localStorage.setItem('generatedWebsites', JSON.stringify(existingWebsites));
    
    const totalSites = parseInt(localStorage.getItem('totalSites') || '0') + 1;
    localStorage.setItem('totalSites', totalSites.toString());
    localStorage.setItem('lastRun', new Date().toISOString());
  }

  private getSettings() {
    const defaultSettings = {
      githubUsername: 'ai-website-generator',
      deploymentTime: '03:00',
      categories: {
        games: true,
        tools: true,
        educational: true,
        creative: true,
        productivity: true
      },
      automation: {
        enabled: true,
        testBeforeDeploy: true,
        backupCode: true,
        notifyOnComplete: false
      },
      advanced: {
        codeOptimization: true,
        seoOptimization: true,
        accessibilityCheck: true,
        performanceAudit: true
      }
    };

    const saved = localStorage.getItem('systemSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  }

  public forceRun() {
    if (!this.isRunning) {
      this.runAutomation();
    }
  }

  public stop() {
    if (this.scheduledTask) {
      clearTimeout(this.scheduledTask);
      this.scheduledTask = null;
    }
  }
}