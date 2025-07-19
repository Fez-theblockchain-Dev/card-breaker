import { Await, createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { LineChart, BarChart, Activity } from 'lucide-react';

// Simulated analytics data fetching
const fetchAnalytics = async () => {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    revenueLastMonth: 24500,
    totalBreaks: 156,
    activeSubscribers: 89,
    recentBreaks: [
      { id: 1, name: 'Premium Baseball Break', date: '2024-03-15', revenue: 1200 },
      { id: 2, name: 'Basketball Mixer', date: '2024-03-14', revenue: 850 },
      { id: 3, name: 'Football Select Break', date: '2024-03-13', revenue: 975 },
    ]
  };
};

export const Route = createFileRoute('/')({
  loader: async () => {
    return {
      analytics: fetchAnalytics(),
    };
  },
  component: HomePage,
});

function HomePage() {
  const { analytics } = Route.useLoaderData();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold neon-text mb-8">Card Breaker Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium neon-text">Revenue (Last 30 Days)</p>
                <Suspense fallback={<div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mt-1"></div>}>
                  <Await
                    promise={analytics}
                    children={(data) => (
                      <p className="text-2xl font-semibold neon-text">${data.revenueLastMonth}</p>
                    )}
                  />
                </Suspense>
              </div>
              <LineChart className="h-8 w-8 text-neon-orange" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium neon-text">Total Breaks</p>
                <Suspense fallback={<div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1"></div>}>
                  <Await
                    promise={analytics}
                    children={(data) => (
                      <p className="text-2xl font-semibold neon-text">{data.totalBreaks}</p>
                    )}
                  />
                </Suspense>
              </div>
              <BarChart className="h-8 w-8 text-neon-orange" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium neon-text">Active Users</p>
                <Suspense fallback={<div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1"></div>}>
                  <Await
                    promise={analytics}
                    children={(data) => (
                      <p className="text-2xl font-semibold neon-text">{data.activeSubscribers}</p>
                    )}
                  />
                </Suspense>
              </div>
              <Activity className="h-8 w-8 text-neon-orange" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium neon-text mb-4">Recent Breaks</h2>
            <Suspense fallback={<div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>}>
              <Await
                promise={analytics}
                children={(data) => (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data.recentBreaks.map((break_) => (
                      <div key={break_.id} className="py-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium neon-text">{break_.name}</p>
                          <p className="text-sm neon-text opacity-75">{break_.date}</p>
                        </div>
                        <p className="text-sm font-medium neon-text">${break_.revenue}</p>
                      </div>
                    ))}
                  </div>
                )}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}