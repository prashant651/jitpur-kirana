import React from 'react';

const Nav = ({ activeView, setActiveView }) => {
    const navItems = [
        { id: 'home', label: 'Home', icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 sm:mr-2", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { d: "M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" })) },
        { id: 'stock', label: 'Stock Hisab', icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 sm:mr-2", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M5 2a1 1 0 00-1 1v1H3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1h-1V3a1 1 0 00-1-1H5zM4 6h12v10H4V6zm2-2h8v1H6V4z", clipRule: "evenodd" })) },
        { id: 'cheques', label: 'Cheques', icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 sm:mr-2", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm1 4a1 1 0 100 2h10a1 1 0 100-2H5z", clipRule: "evenodd" }), React.createElement('path', { d: "M4 12a2 2 0 00-2 2v2a2 2 0 002 2h12a2 2 0 002-2v-2a2 2 0 00-2-2H4z" })) },
        { id: 'accounts', label: 'Accounts', icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 sm:mr-2", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { d: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" })) },
        { id: 'contacts', label: 'Contacts', icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 sm:mr-2", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { d: "M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" })) },
    ];

    const homeButton = navItems.find(item => item.id === 'home');
    const mainButtons = navItems.filter(item => item.id !== 'home' && item.id !== 'settings');

    const renderNavItems = (items) => items.map(item => (
        React.createElement('button',
            {
                key: item.id,
                onClick: () => setActiveView(item.id),
                className: `flex-1 sm:flex-shrink-0 flex flex-col sm:flex-row items-center justify-center text-xs sm:text-base font-medium py-2 sm:py-3 px-1 sm:px-5 sm:border-b-2 transition-colors duration-200 ${
                    activeView === item.id
                    ? 'sm:border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'sm:border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`
            },
            item.icon,
            React.createElement('span', { className: "whitespace-nowrap mt-1 sm:mt-0" }, item.label)
        )
    ));
    
    // Hide nav entirely on the home screen for a cleaner landing page experience
    if (activeView === 'home') {
        return null;
    }

    return (
        React.createElement('nav', { className: "sm:bg-white sm:dark:bg-gray-800 sm:shadow-md sm:relative fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:border-t-0" },
            // Mobile View (Bottom Bar)
            React.createElement('div', { className: "w-full px-0 flex justify-around sm:hidden" },
               renderNavItems([homeButton, ...mainButtons, navItems.find(item => item.id === 'contacts')].filter(Boolean))
            ),
            // Desktop View (Top Tab Bar)
            React.createElement('div', { className: "px-4 sm:px-6 hidden sm:block" },
                 React.createElement('div', { className: "flex -mb-px overflow-x-auto" },
                    renderNavItems(navItems)
                )
            )
        )
    );
};

export default Nav;