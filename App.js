import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header.js';
import Nav from './components/Nav.js';
import Accounts from './components/Accounts.js';
import ChequeManager from './components/ChequeManager.js';
import StockManager from './components/StockManager.js';
import Contacts from './components/Contacts.js';
import HomeDashboard from './components/HomeDashboard.js';
import Settings from './components/Settings.js';
import { usePersistentState } from './hooks/usePersistentState.js';

import { ChequeStatus } from './types.js';
import { getTodayBSString } from './services/bs-date-utils.js';
import { mockDailyHisabsData, mockHisabAccounts, mockHisabTransactions, mockAccounts, mockTransactions, mockCheques } from './services/mock-data.js';

// Define a version for our data structure. Increment this when making breaking changes to data types.
const CURRENT_DATA_VERSION = 1;

const App = () => {
    const [theme, setTheme] = useState(() => (localStorage.getItem('theme') || 'light'));
    const [activeView, setActiveView] = useState('home'); // Default to home dashboard

    // --- Data Migration & Versioning ---
    useEffect(() => {
        const storedVersion = localStorage.getItem('data_version');
        const version = storedVersion ? parseInt(storedVersion, 10) : 0;

        if (version < CURRENT_DATA_VERSION) {
            console.log(`Data version mismatch. Stored: ${version}, Current: ${CURRENT_DATA_VERSION}. Setting up...`);
            
            localStorage.setItem('data_version', CURRENT_DATA_VERSION.toString());
            console.log('Data structure is now up to date.');
        }
    }, []);

    // Main Data state - now using the persistent hook
    const [accounts, setAccounts] = usePersistentState('jitpur_kirana_accounts', mockAccounts);
    const [transactions, setTransactions] = usePersistentState('jitpur_kirana_transactions', mockTransactions);
    const [cheques, setCheques] = usePersistentState('jitpur_kirana_cheques', mockCheques);
    const [dailyHisabs, setDailyHisabs] = usePersistentState('jitpur_kirana_daily_hisabs', mockDailyHisabsData);
    const [hisabAccounts, setHisabAccounts] = usePersistentState('jitpur_kirana_hisab_accounts', mockHisabAccounts);
    const [hisabTransactions, setHisabTransactions] = usePersistentState('jitpur_kirana_hisab_transactions', mockHisabTransactions);


    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    // --- Notification Logic for Cheque Reminders ---
    useEffect(() => {
        const checkReminders = () => {
            if (!("Notification" in window)) {
                console.log("This browser does not support desktop notification");
                return;
            }

            if (Notification.permission === "granted") {
                const today = getTodayBSString();
                const lastCheck = localStorage.getItem('lastNotificationCheck');

                if (lastCheck === today) {
                    return; // Already checked today
                }
                
                const todaysReminders = cheques.filter(c => c.reminderDate === today && c.status === ChequeStatus.Pending);

                if (todaysReminders.length > 0) {
                     todaysReminders.forEach(cheque => {
                        const type = cheque.type.charAt(0).toUpperCase() + cheque.type.slice(1);
                        const contact = accounts.find(acc => acc.name === cheque.partyName);
                        const phone = contact?.phone ? ` (${contact.phone})` : '';
                        const body = `${type} cheque for Rs ${cheque.amount.toLocaleString()} to/from ${cheque.partyName}${phone}. Cheque date: ${cheque.date}.`;
                        
                        new Notification('Jitpur Kirana Cheque Reminder', {
                            body: body,
                            icon: './favicon.svg'
                        });
                    });
                }
                localStorage.setItem('lastNotificationCheck', today);
            }
        };

        checkReminders();
    }, [cheques, accounts]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const accountsWithBalance = useMemo(() => {
        return accounts.map(account => {
            const accountTransactions = transactions.filter(t => t.accountId === account.id);
            const balance = accountTransactions.reduce((acc, curr) => {
                return curr.type === 'increase' ? acc + curr.amount : acc - curr.amount;
            }, 0);
            return { ...account, balance };
        });
    }, [accounts, transactions]);

    const handleSaveAccount = (accountData) => {
        const isEditing = accounts.some(acc => acc.id === accountData.id);
        let savedAccount;
        if (isEditing) {
            savedAccount = { ...accountData };
            setAccounts(prev => prev.map(acc => acc.id === accountData.id ? { ...acc, ...accountData } : acc));
        } else {
            savedAccount = { ...accountData, id: Date.now().toString() };
            setAccounts(prev => [...prev, savedAccount]);
        }
        return savedAccount;
    };

    const handleSaveHisabAccount = (accountData) => {
        const isEditing = hisabAccounts.some(acc => acc.id === accountData.id);
        let savedAccount;
        if (isEditing) {
            savedAccount = { ...accountData };
            setHisabAccounts(prev => prev.map(acc => acc.id === accountData.id ? { ...acc, ...accountData } : acc));
        } else {
            savedAccount = { ...accountData, id: `h-acc-${Date.now().toString()}` };
            setHisabAccounts(prev => [...prev, savedAccount]);
        }
        return savedAccount;
    };
    
    const handleDeleteAccount = (accountId) => {
        if(window.confirm('Are you sure you want to delete this account? This will also remove all associated transactions.')) {
            setAccounts(prev => prev.filter(acc => acc.id !== accountId));
            setTransactions(prev => prev.filter(t => t.accountId !== accountId));
        }
    };
    
    const handleSaveTransaction = (transactionData) => {
        const newTransaction = { ...transactionData, id: `t${Date.now()}`};
        setTransactions(prev => [...prev, newTransaction]);
    };
    
    const handleSaveCheque = (chequeData) => {
        const isEditing = chequeData.id && cheques.some(c => c.id === chequeData.id);
        if (isEditing) {
            setCheques(prev => prev.map(c => c.id === chequeData.id ? chequeData : c));
        } else {
            const newCheque = { ...chequeData, id: `c${Date.now()}` };
            setCheques(prev => [newCheque, ...prev]);
        }
    };

    const handleDeleteCheque = (chequeId) => {
        if (window.confirm('Are you sure you want to delete this cheque record? This action cannot be undone.')) {
            setCheques(prev => prev.filter(c => c.id !== chequeId));
        }
    };

    const handleUpdateChequeStatus = (chequeId, status) => {
        setCheques(prevCheques =>
            prevCheques.map(cheque =>
                cheque.id === chequeId ? { ...cheque, status } : cheque
            )
        );
    };

    const handleSubmitHisab = (hisabData) => {
        const finalHisab = { ...hisabData, status: 'submitted' };
        setDailyHisabs(prev => {
            const existingIndex = prev.findIndex(h => h.date === finalHisab.date);
            if (existingIndex > -1) {
                const updatedHisabs = [...prev];
                updatedHisabs[existingIndex] = finalHisab;
                return updatedHisabs;
            } else {
                return [...prev, finalHisab].sort((a, b) => a.date.localeCompare(b.date));
            }
        });

        const newHisabTransactions = [];
        
        hisabData.balance.cashTransactions.forEach(tx => {
            if (tx.customerId && tx.amount > 0) {
                newHisabTransactions.push({
                    id: `ht-cash-${Date.now()}-${tx.id}`,
                    accountId: tx.customerId,
                    amount: tx.amount,
                    type: 'decrease',
                    date: hisabData.date,
                    note: 'Cash payment from daily hisab'
                });
            }
        });

        hisabData.balance.creditTransactions.forEach(tx => {
             if (tx.customerId && tx.amount > 0) {
                newHisabTransactions.push({
                    id: `ht-credit-${Date.now()}-${tx.id}`,
                    accountId: tx.customerId,
                    amount: tx.amount,
                    type: 'increase',
                    date: hisabData.date,
                    note: 'Credit sale from daily hisab'
                });
            }
        });

        setHisabTransactions(prev => [...prev, ...newHisabTransactions]);
        alert(`Hisab for ${hisabData.date} submitted successfully and accounts updated!`);
    };
    
    const handleUpdateHisabStatus = (date, status) => {
        setDailyHisabs(prev => 
            prev.map(h => (h.date === date ? { ...h, status: status } : h))
        );
    };

    const renderView = () => {
        switch (activeView) {
            case 'home':
                return React.createElement(HomeDashboard, { setActiveView: setActiveView });
            case 'contacts':
                return React.createElement(Contacts, { 
                  accounts: accounts,
                  onSave: handleSaveAccount,
                  onDelete: handleDeleteAccount
                });
            case 'accounts':
                return React.createElement(Accounts, { 
                  accounts: accountsWithBalance,
                  transactions: transactions,
                  onSaveAccount: handleSaveAccount,
                  onDeleteAccount: handleDeleteAccount,
                  onSaveTransaction: handleSaveTransaction
                });
            case 'cheques':
                return React.createElement(ChequeManager, { 
                    cheques: cheques,
                    accounts: accounts,
                    onSaveCheque: handleSaveCheque,
                    onSaveNewAccount: handleSaveAccount,
                    onUpdateChequeStatus: handleUpdateChequeStatus,
                    onDeleteCheque: handleDeleteCheque
                });
            case 'stock':
                return React.createElement(StockManager, { 
                    hisabs: dailyHisabs,
                    hisabAccounts: hisabAccounts,
                    hisabTransactions: hisabTransactions,
                    onSubmitHisab: handleSubmitHisab,
                    onSaveHisabAccount: handleSaveHisabAccount,
                    onUpdateHisabStatus: handleUpdateHisabStatus
                });
            case 'settings':
                return React.createElement(Settings, null);
            default:
                return React.createElement(HomeDashboard, { setActiveView: setActiveView });
        }
    };

    return (
        React.createElement('div', { className: "bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300" },
            React.createElement(Header, { theme: theme, toggleTheme: toggleTheme }),
            React.createElement(Nav, { activeView: activeView, setActiveView: setActiveView }),
            React.createElement('main', { className: "p-4 sm:p-6 sm:container sm:mx-auto pb-20 sm:pb-6" },
                renderView()
            )
        )
    );
};

export default App;