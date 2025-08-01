import React, { useState, useEffect } from 'react';
import { WebsiteCard } from './WebsiteCard';
import { StatsCard } from './StatsCard';
import { Globe, Code, Bug, Rocket, Calendar, TrendingUp } from 'lucide-react';

interface Website {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  createdAt: string;
  status: 'deployed' | 'deploying' | 'failed';
  technologies: string[];
  stats: {
    visits: number;
    uptime: number;
  };
}

interface DashboardProps {
  systemStatus: any;
  setSystemStatus: (status: any) => void;
}

export function Dashboard({ systemStatus, setSystemStatus }: DashboardProps) {
  const [websites, setWebsites] = useState<Website[]>(() => {
    const saved = localStorage.getItem('generatedWebsites');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    localStorage.setItem('generatedWebsites', JSON.stringify(websites));
  }, [websites]);

  const stats = {
    totalSites: websites.length,
    deployed: websites.filter(w => w.status === 'deployed').length,
    categories: new Set(websites.map(w => w.category)).size,
    avgUptime: websites.length > 0 ? 
      (websites.reduce((acc, w) => acc + w.stats.uptime, 0) / websites.length).toFixed(1) : '0'
  };

  const categories = ['all', ...new Set(websites.map(w => w.category))];

  const filteredWebsites = websites
    .filter(w => filter === 'all' || w.category === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name': return a.name.localeCompare(b.name);
        case 'visits': return b.stats.visits - a.stats.visits;
        default: return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Sites"
          value={stats.totalSites}
          icon={Globe}
          color="blue"
          change="+1 today"
        />
        <StatsCard
          title="Deployed"
          value={stats.deployed}
          icon={Rocket}
          color="green"
          change={`${((stats.deployed / Math.max(stats.totalSites, 1)) * 100).toFixed(0)}% success`}
        />
        <StatsCard
          title="Categories"
          value={stats.categories}
          icon={Code}
          color="purple"
          change="Diverse"
        />
        <StatsCard
          title="Avg Uptime"
          value={`${stats.avgUptime}%`}
          icon={TrendingUp}
          color="emerald"
          change="Excellent"
        />
      </div>

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="visits">Most Visits</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredWebsites.length} of {websites.length} sites
          </div>
        </div>
      </div>

      {/* Website Grid */}
      {filteredWebsites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebsites.map(website => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No websites yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The AI system will create its first website automatically. Check back soon!
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Next generation scheduled for: {systemStatus.nextRun ? 
              new Date(systemStatus.nextRun).toLocaleString() : 'Calculating...'}
          </div>
        </div>
      )}
    </div>
  );
}