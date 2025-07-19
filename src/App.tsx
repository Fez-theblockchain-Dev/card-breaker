import React from 'react';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'light bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-6 w-6 text-neon-orange" />
            ) : (
              <Moon className="h-6 w-6 text-neon-orange" />
            )}
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 neon-text">S & R Sports</h1>
          <p className="text-xl neon-text">
            Analytics tool to help sports cards collectors keep track of their P/L
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;