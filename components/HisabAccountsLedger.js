import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AccountForm } from './AccountForm.js';
import AccountLedger from './AccountLedger.js';

const StatCard = ({ title, amount, colorClass }) => (
    React.createElement('div', { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 w-full" },
        React.createElement('h2', { className: "text-md font-semibold text-gray-500 dark:text-gray-400 mb-1" }, title),
        React.createElement('p', { className: `text-2xl font-bold ${colorClass}` },
            `Rs ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        )
    )
);

const HisabAccountsLedger = ({ accounts, transactions, onSaveAccount }) => {
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  
  const customerAccounts = accounts;
  
  const totalReceivable = useMemo(() => 
    customerAccounts
      .filter(a => a.balance > 0)
      .reduce((sum, a) => sum + a.balance, 0),
  [customerAccounts]);

  const selectedAccount = useMemo(() => {
    if (!selectedAccountId) return null;
    return accounts.find(acc => acc.id === selectedAccountId) || null;
  }, [selectedAccountId, accounts]);

  const selectedAccountTransactions = useMemo(() => {
    if (!selectedAccountId) return [];
    return transactions
      .filter(t => t.accountId === selectedAccountId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [selectedAccountId, transactions]);

  const handleAddAccountClick = () => {
    setEditingAccount(null);
    setIsAccountFormOpen(true);
  };
  
  const handleSaveAccountCallback = (accountData) => {
    onSaveAccount(accountData);
    setIsAccountFormOpen(false);
    setEditingAccount(null);
  };
  
  const closeAllModals = useCallback(() => {
    setIsAccountFormOpen(false);
    setEditingAccount(null);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        closeAllModals();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [closeAllModals]);

  return (
    React.createElement('div', null,
        React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" },
            React.createElement('div', { className: "lg:col-span-1" },
                React.createElement(StatCard, { title: "Total Hisab Receivable", amount: totalReceivable, colorClass: "text-green-600" }),
                React.createElement('div', { className: "mt-4 flex justify-between items-center" },
                    React.createElement('h2', { className: "text-xl font-bold" }, `Hisab Customers (${customerAccounts.length})`),
                     React.createElement('button', { onClick: handleAddAccountClick, className: "px-3 py-1.5 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors text-xs shadow" },
                        "+ New"
                    )
                ),
                React.createElement('div', { className: "mt-4 bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 max-h-[65vh] overflow-y-auto" },
                    React.createElement('ul', { className: "divide-y dark:divide-gray-700" },
                        customerAccounts.map(account => (
                            React.createElement('li', { key: account.id },
                                React.createElement('button', 
                                  { onClick: () => setSelectedAccountId(account.id),
                                  className: `w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedAccountId === account.id ? 'bg-blue-100 dark:bg-blue-900/40' : ''}` },
                                    React.createElement('p', { className: "font-semibold text-gray-900 dark:text-white" }, account.name),
                                    React.createElement('p', { className: `text-sm ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}` },
                                      `Balance: Rs ${account.balance.toLocaleString()}`
                                    )
                                )
                            )
                        ))
                    )
                )
            ),

            React.createElement('div', { className: "lg:col-span-2" },
                selectedAccount ? (
                    React.createElement(AccountLedger, 
                        { account: selectedAccount, 
                        transactions: selectedAccountTransactions,
                        onAddTransaction: () => {},
                        hideAddTransaction: true }
                    )
                ) : (
                    React.createElement('div', { className: "flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 p-10" },
                         React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-16 w-16 text-gray-400 mb-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" })
                        ),
                        React.createElement('h3', { className: "text-xl font-bold text-gray-800 dark:text-white" }, "Select a Hisab Customer"),
                        React.createElement('p', { className: "text-gray-500 dark:text-gray-400 mt-1" }, "Choose a customer to view their transaction history."),
                        React.createElement('p', { className: "text-xs text-gray-500 dark:text-gray-400 mt-4" }, "Transactions are added automatically when a daily hisab is submitted.")
                    )
                )
            )
        ),
        
      React.createElement(AccountForm, { isOpen: isAccountFormOpen, onClose: () => setIsAccountFormOpen(false), onSave: handleSaveAccountCallback, account: editingAccount })
    )
  );
};

export default HisabAccountsLedger;
