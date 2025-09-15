import React from 'react';

const StatCard = ({ title, amount, colorClass }) => (
    React.createElement('div', { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
        React.createElement('h2', { className: "text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2" }, title),
        React.createElement('p', { className: `text-3xl lg:text-4xl font-bold ${colorClass}` },
            `Rs ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        )
    )
);

const PlaceholderCard = ({ title }) => (
    React.createElement('div', { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
        React.createElement('h2', { className: "text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2" }, title),
        React.createElement('p', { className: "text-3xl lg:text-4xl font-bold text-gray-400 dark:text-gray-500" },
            "Coming Soon"
        )
    )
);


const Dashboard = ({ totalReceivable, totalPayable }) => {
  return (
    React.createElement('div', null,
        React.createElement('h1', { className: "text-3xl font-bold mb-6" }, "Dashboard"),
        React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" },
            React.createElement(StatCard, { title: "Total Receivable", amount: totalReceivable, colorClass: "text-green-600" }),
            React.createElement(StatCard, { title: "Total Payable", amount: totalPayable, colorClass: "text-red-600" }),
            React.createElement(PlaceholderCard, { title: "Cheques Receivable" }),
            React.createElement(PlaceholderCard, { title: "Cheques Payable" })
        )
    )
  );
};

export default Dashboard;
