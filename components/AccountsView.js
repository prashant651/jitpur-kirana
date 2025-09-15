import React from 'react';
import AccountCard from './IdeaCard.js';

const AccountsView = ({ accounts, onAddTransaction, onViewHistory, onEditAccount, onDeleteAccount }) => {
  return (
    React.createElement('div', null,
      React.createElement('div', { className: "flex justify-between items-center mb-6" },
        React.createElement('h1', { className: "text-2xl font-bold" }, `All Accounts (${accounts.length})`),
        React.createElement('button', { className: "px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm" },
          "+ Add Account"
        )
      ),
      accounts.length > 0 ? (
        React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" },
          accounts.map(account => (
            React.createElement(AccountCard, 
              { key: account.id, 
              account: account, 
              onAddTransaction: () => onAddTransaction(account.id),
              onViewHistory: () => onViewHistory(account.id),
              onEdit: () => onEditAccount(account.id),
              onDelete: () => onDeleteAccount(account.id) }
            )
          ))
        )
      ) : (
        React.createElement('div', { className: "text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow" },
          React.createElement('p', { className: "text-gray-500 dark:text-gray-400" }, "No accounts found. Add one to get started!")
        )
      )
    )
  );
};

export default AccountsView;
