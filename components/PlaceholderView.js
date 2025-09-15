import React from 'react';

const PlaceholderView = ({ title, message }) => {
    return (
        React.createElement('div', { className: "flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
            React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-16 w-16 text-gray-400 mb-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" })
            ),
            React.createElement('h2', { className: "text-2xl font-bold text-gray-800 dark:text-white mb-2" }, title),
            React.createElement('p', { className: "text-gray-500 dark:text-gray-400" }, message)
        )
    );
};

export default PlaceholderView;
