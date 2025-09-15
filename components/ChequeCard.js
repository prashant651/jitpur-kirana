import React, { useState, useRef, useEffect } from 'react';
import { ChequeStatus } from '../types.js';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        [ChequeStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        [ChequeStatus.Cleared]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        [ChequeStatus.Bounced]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return (
        React.createElement('span', { className: `px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[status]}` },
            status
        )
    );
};

export const ChequeCard = ({ cheque, onUpdateStatus }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const amountColor = cheque.type === 'payable' ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500';

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        React.createElement('div', { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
            React.createElement('div', { className: "flex flex-col sm:flex-row justify-between sm:items-start gap-4" },
                React.createElement('div', { className: "flex-1" },
                    React.createElement('div', { className: "flex items-center justify-between mb-2" },
                        React.createElement('h3', { className: "text-lg font-bold text-gray-900 dark:text-white" }, cheque.partyName),
                        React.createElement(StatusBadge, { status: cheque.status })
                    ),
                    React.createElement('p', { className: `text-2xl font-bold ${amountColor}` },
                        `Rs ${cheque.amount.toLocaleString('en-IN')}`
                    ),
                    React.createElement('div', { className: "mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400" },
                        React.createElement('p', null, React.createElement('span', { className: "font-semibold text-gray-800 dark:text-gray-200" }, "Bank:"), ` ${cheque.bankName || 'N/A'}`),
                        React.createElement('p', null, React.createElement('span', { className: "font-semibold text-gray-800 dark:text-gray-200" }, "Cheque No:"), ` ${cheque.chequeNumber}`),
                        React.createElement('p', null, React.createElement('span', { className: "font-semibold text-gray-800 dark:text-gray-200" }, "Cheque Date:"), ` ${cheque.date}`),
                        React.createElement('p', null, React.createElement('span', { className: "font-semibold text-gray-800 dark:text-gray-200" }, "Reminder:"), ` ${cheque.reminderDate || 'N/A'}`)
                    )
                ),
                React.createElement('div', { className: "relative flex-shrink-0 self-end sm:self-start", ref: menuRef },
                     React.createElement('button', { onClick: () => setMenuOpen(!menuOpen), className: "p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors", "aria-label": "More options" },
                        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 5v.01M12 12v.01M12 19v.01" }))
                    ),
                    menuOpen && (
                        React.createElement('div', { className: "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-10" },
                            cheque.status === ChequeStatus.Pending && (
                                React.createElement('button',
                                    {
                                        onClick: () => {
                                            onUpdateStatus(cheque.id, ChequeStatus.Cleared);
                                            setMenuOpen(false);
                                        },
                                        className: "w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                                    },
                                   React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" })),
                                    "Mark as Cleared"
                                )
                            )
                        )
                    )
                )
            )
        )
    );
};
