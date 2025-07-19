import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Moon, Sun, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AuthModal } from '../components/AuthModal';
import { supabase } from '../lib/supabase';

export const Route = createRootRoute({
  component: () => {
    const [darkMode, setDarkMode] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [darkMode]);

    useEffect(() => {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
      await supabase.auth.signOut();
    };

    return (
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'light bg-gray-50'}`}>
        <nav className="fixed top-0 left-0 right-0 bg-gray-800 dark:bg-gray-900 shadow-lg z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="neon-text text-xl font-bold hover:text-orange-400 transition-colors">
                  S & R Sports
                </Link>
                <div className="flex space-x-4">
                  <Link 
                    to="/about" 
                    className="neon-text hover:text-orange-400 px-3 py-2 rounded-md transition-colors"
                  >
                    About
                  </Link>
                  <Link 
                    to="/product" 
                    className="neon-text hover:text-orange-400 px-3 py-2 rounded-md transition-colors"
                  >
                    Product
                  </Link>
                  <Link 
                    to="/contact" 
                    className="neon-text hover:text-orange-400 px-3 py-2 rounded-md transition-colors"
                  >
                    Contact Us
                  </Link>
                  <Link 
                    to="/session" 
                    className="neon-text hover:text-orange-400 px-3 py-2 rounded-md transition-colors"
                  >
                    Log Session
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun className="h-6 w-6 text-neon-orange" />
                  ) : (
                    <Moon className="h-6 w-6 text-neon-orange" />
                  )}
                </button>
                {user ? (
                  <div className="flex items-center space-x-2">
                    <UserCircle className="h-6 w-6 text-neon-orange" />
                    <button
                      onClick={handleSignOut}
                      className="neon-text hover:text-orange-400 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="neon-text hover:text-orange-400 transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Outlet />
        </main>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  },
});