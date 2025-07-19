import { createFileRoute } from '@tanstack/react-router';
import { BarChart, PieChart, TrendingUp } from 'lucide-react';

export const Route = createFileRoute('/product')({
  component: ProductPage,
});

function ProductPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 neon-text">CBA2 Analytics Platform</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <BarChart className="h-8 w-8 text-neon-orange mr-3" />
            <h2 className="text-2xl font-bold neon-text">Advanced Analytics</h2>
          </div>
          <p className="neon-text">
            Track your collection's performance with detailed analytics, ROI calculations,
            and market trend analysis.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <PieChart className="h-8 w-8 text-neon-orange mr-3" />
            <h2 className="text-2xl font-bold neon-text">Portfolio Management</h2>
          </div>
          <p className="neon-text">
            Manage your card portfolio with ease, track individual card performance,
            and get insights on market opportunities.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg md:col-span-2">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-8 w-8 text-neon-orange mr-3" />
            <h2 className="text-2xl font-bold neon-text">Market Insights</h2>
          </div>
          <p className="neon-text">
            Stay ahead of the market with real-time pricing data, market trends,
            and predictive analytics for sports card investments.
          </p>
        </div>
      </div>
    </div>
  );
}