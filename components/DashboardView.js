import React from 'react';

const DashboardView = ({ totalReceivable, totalPayable }) => {
  return (
    React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
      React.createElement('div', { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
        React.createElement('h2', { className: "text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2" }, "Total Receivable"),
        React.createElement('p', { className: "text-4xl font-bold text-green-600" },
          `Rs ${totalReceivable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        )
      ),
      React.createElement('div', { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
        React.createElement('h2', { className: "text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2" }, "Total Payable"),
        React.createElement('p', { className: "text-4xl font-bold text-red-600" },
          `Rs ${totalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        )
      )
    )
  );
};

export default DashboardView;
