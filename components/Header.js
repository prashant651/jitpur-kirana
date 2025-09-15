import React from 'react';
import { getTodayBS, bsMonthNames } from '../services/bs-date-utils.js';

const Header = ({ theme, toggleTheme }) => {
    const Logo = () => (
      React.createElement('svg', { width: "40", height: "40", viewBox: "0 0 40 40", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement('text', {
          x: "50%",
          y: "50%",
          dy: ".3em",
          textAnchor: "middle",
          fontSize: "24",
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
        },
          React.createElement('tspan', { fill: "#ef4444" }, "J"),
          React.createElement('tspan', { fill: "#22c55e" }, "K")
        )
      )
    );

    const SunIcon = () => (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" })
      )
    );

    const MoonIcon = () => (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" })
      )
    );
    
    const [currentTime, setCurrentTime] = React.useState(new Date());
    const [nepaliDate, setNepaliDate] = React.useState('');
    const previousDateRef = React.useRef(new Date().getDate());

    React.useEffect(() => {
        // Function to update Nepali date
        const updateNepaliDate = () => {
            const todayBS = getTodayBS();
            const formattedDate = `${bsMonthNames[todayBS.month - 1]} ${todayBS.day}, ${todayBS.year}`;
            setNepaliDate(formattedDate);
        };

        // Set initial date
        updateNepaliDate();

        const timerId = setInterval(() => {
            const now = new Date();
            // Check if the Gregorian date has changed to trigger a Nepali date update
            if (now.getDate() !== previousDateRef.current) {
                updateNepaliDate();
                previousDateRef.current = now.getDate();
            }
            setCurrentTime(now);
        }, 1000);

        return () => clearInterval(timerId);
    }, []); // Empty dependency array ensures this effect runs only once.
    
    const formattedTime = currentTime.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    return (
        React.createElement('header', { className: "bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30" },
            React.createElement('div', { className: "px-4 sm:px-6 py-3 flex justify-between items-center" },
                React.createElement('div', { className: "flex items-center gap-3" },
                    React.createElement(Logo, null),
                    React.createElement('h1', { className: "text-xl font-bold text-gray-900 dark:text-white hidden sm:block" },
                        "Jitpur Kirana"
                    ),
                    React.createElement('span', { className: "text-sm text-gray-500 dark:text-gray-400 font-mono hidden sm:block pl-3 ml-3 border-l border-gray-300 dark:border-gray-600" },
                        `${nepaliDate} | ${formattedTime}`
                    )
                ),
                React.createElement('button', 
                  { onClick: toggleTheme, 
                  className: "p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors",
                  "aria-label": "Toggle theme"
                },
                    theme === 'light' ? React.createElement(MoonIcon, null) : React.createElement(SunIcon, null)
                )
            )
        )
    );
};

export default Header;