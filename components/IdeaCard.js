import React, { useState, useRef, useEffect } from 'react';

const AccountCard = ({ account, onAddTransaction, onViewHistory, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const balanceColor = account.balance >= 0 ? 'text-green-600' : 'text-red-600';
  const balanceLabel = account.type === 'customer' 
    ? (account.balance >= 0 ? 'Receivable' : 'Advance') 
    : (account.balance >= 0 ? 'Payable' : 'Advance Paid');
  const balancePrefix = account.balance < 0 ? '-' : '';

  return (
    React.createElement('div', { className: "bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col justify-between h-full" },
      React.createElement('div', null,
        React.createElement('div', { className: "flex justify-between items-start mb-4" },
          React.createElement('div', null,
            React.createElement('h3', { className: "text-xl font-bold text-gray-900 dark:text-white" }, account.name),
            account.phone && React.createElement('p', { className: "text-sm text-gray-600 dark:text-gray-400" }, account.phone)
          ),
          React.createElement('div', { className: "relative", ref: menuRef },
            React.createElement('button', { onClick: () => setMenuOpen(!menuOpen), className: "p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors", "aria-label": "More options" },
              React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 5v.01M12 12v.01M12 19v.01" }))
            ),
            menuOpen && (
              React.createElement('div', { className: "absolute right-0 mt-2 w-36 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-10" },
                React.createElement('button', { onClick: () => { onEdit(); setMenuOpen(false); }, className: "w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg transition-colors" }, "Edit Account"),
                React.createElement('button', { onClick: () => { onDelete(); setMenuOpen(false); }, className: "w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-b-lg transition-colors" }, "Delete")
              )
            )
          )
        ),
        React.createElement('div', { className: "text-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg" },
            React.createElement('p', { className: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, balanceLabel),
            React.createElement('p', { className: `text-2xl font-bold ${balanceColor}` },
                `${balancePrefix} Rs ${Math.abs(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            )
        )
      ),
      React.createElement('div', { className: "flex gap-3 mt-5" },
        React.createElement('button', 
          { onClick: onAddTransaction,
          className: "w-full py-2.5 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm" },
          "+ Transaction"
        ),
        React.createElement('button', 
          { onClick: onViewHistory,
          className: "w-full py-2.5 px-4 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors text-sm dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500" },
          "View History"
        )
      )
    )
  );
};

export default AccountCard;
