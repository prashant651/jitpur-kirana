import React from 'react';

const Header = ({ theme, toggleTheme }) => {
    const Logo = () => (
      React.createElement('svg', { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "text-blue-600 dark:text-blue-500" },
          React.createElement('path', { d: "M21 6.5H3", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
          React.createElement('path', { d: "M12 21V6.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
          React.createElement('path', { d: "M18.843 3H5.157C4.195 3 3.513 4.024 3.94 4.886L9.798 16.514C10.852 18.6 13.148 18.6 14.202 16.514L20.06 4.886C20.487 4.024 19.805 3 18.843 3Z", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
          React.createElement('path', { d: "M3.5 17.5H20.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
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

    return (
        React.createElement('header', { className: "bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30" },
            React.createElement('div', { className: "px-4 sm:px-6 py-3 flex justify-between items-center" },
                React.createElement('div', { className: "flex items-center gap-3" },
                    React.createElement(Logo, null),
                    React.createElement('h1', { className: "text-xl font-bold text-gray-900 dark:text-white hidden sm:block" },
                        "Jitpur Kirana"
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