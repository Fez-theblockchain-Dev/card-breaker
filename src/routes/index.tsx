import { Await, createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { LineChart, BarChart, Activity } from 'lucide-react';
import { getBreakingSessions } from '../lib/database';

// Real analytics data fetching from Supabase
const fetchAnalytics = async () => {
  try {
    const sessions = await getBreakingSessions();
    
    const totalRevenue = sessions.reduce((sum, session) => sum + Number(session.sales_price), 0);
    const totalCosts = sessions.reduce((sum, session) => sum + Number(session.package_cost), 0);
    const netProfit = totalRevenue - totalCosts;
    
    return {
      totalRevenue,
      totalBreaks: sessions.length,
      netProfit,
      recentBreaks: sessions.slice(0, 5).map(session => ({
        id: session.id,
        buyer: session.buyer,
        date: new Date(session.created_at!).toLocaleDateString(),
        revenue: Number(session.sales_price),
        cost: Number(session.package_cost),
        profit: Number(session.sales_price) - Number(session.package_cost)
      }))
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // Return default data if user is not authenticated or there's an error
    return {
      totalRevenue: 0,
      totalBreaks: 0,
      netProfit: 0,
      recentBreaks: []
    };
  }
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
                <p className="text-sm font-medium neon-text">Total Revenue</p>
                <Suspense fallback={<div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mt-1"></div>}>
                  <Await
                    promise={analytics}
                    children={(data) => (
                      <p className="text-2xl font-semibold neon-text">${data.totalRevenue.toFixed(2)}</p>
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
                <p className="text-sm font-medium neon-text">Net Profit</p>
                <Suspense fallback={<div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1"></div>}>
                  <Await
                    promise={analytics}
                    children={(data) => (
                      <p className={`text-2xl font-semibold ${data.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${data.netProfit.toFixed(2)}
                      </p>
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
                    {data.recentBreaks.length > 0 ? (
                      data.recentBreaks.map((break_) => (
                        <div key={break_.id} className="py-4 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium neon-text">Buyer: {break_.buyer}</p>
                            <p className="text-sm neon-text opacity-75">{break_.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium neon-text">Revenue: ${break_.revenue.toFixed(2)}</p>
                            <p className={`text-sm font-medium ${break_.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              Profit: ${break_.profit.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <div>
                          <p className="text-sm neon-text opacity-75">No breaking sessions logged yet.</p>
                          <p className="text-sm neon-text opacity-75">Start by logging your first session!</p>
                        </div>
                      </div>
                    )}
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