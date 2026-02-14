import React, { useState, useMemo } from 'react';
import CalendarView from './CalendarView.js';
import { ChequeStatus } from '../types.js';
import { ChequeForm } from './ChequeForm.js';
import { ChequeCard } from './ChequeCard.js';
import { getTodayBSString } from '../services/bs-date-utils.js';

const StatCard = ({ title, amount, colorClass }) => (
    React.createElement('div', { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 w-full" },
        React.createElement('h2', { className: "text-md font-semibold text-gray-500 dark:text-gray-400 mb-1" }, title),
        React.createElement('p', { className: `text-xl sm:text-2xl font-bold ${colorClass}` },
            `Rs ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        )
    )
);

const ViewToggleButton = ({ active, onClick, children }) => (
    React.createElement('button',
        { onClick: onClick,
        className: `px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md flex items-center gap-2 transition-colors ${
            active
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
        }` },
        children
    )
);

const ChequeManager = ({ cheques, accounts, onSaveCheque, onSaveNewAccount, onUpdateChequeStatus, onDeleteCheque }) => {
  const [activeTab, setActiveTab] = useState('today');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  const { filteredCheques, totalReceivable, totalPayable } = useMemo(() => {
    const today = getTodayBSString();
    
    let filtered;
    if (activeTab === 'today') {
        filtered = cheques.filter(c => 
            (c.date === today || c.reminderDate === today) && 
            c.status === ChequeStatus.Pending
        );
    } else {
        filtered = cheques.filter(c => c.type === activeTab);
    }

    const receivable = cheques
        .filter(c => c.type === 'receivable' && c.status === ChequeStatus.Pending)
        .reduce((sum, c) => sum + c.amount, 0);
    const payable = cheques
        .filter(c => c.type === 'payable' && c.status === ChequeStatus.Pending)
        .reduce((sum, c) => sum + c.amount, 0);
        
    return { filteredCheques: filtered, totalReceivable: receivable, totalPayable: payable };
  }, [cheques, activeTab]);

  const handleAddChequeClick = () => {
    setIsFormOpen(true);
  };

  const handleSave = (chequeFormData) => {
    const newCheque = {
      ...chequeFormData,
      id: '', // Will be assigned in App.js
      type: activeTab === 'receivable' ? 'receivable' : (activeTab === 'payable' ? 'payable' : 'receivable'), 
      status: ChequeStatus.Pending
    };
    onSaveCheque(newCheque);
    setIsFormOpen(false);
  };

  const TabButton = ({ id, label }) => (
    React.createElement('button', { 
        onClick: () => setActiveTab(id), 
        className: `flex-1 py-2 px-1 text-xs sm:text-base font-semibold transition-colors ${activeTab === id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}` 
    }, label)
  );

  return (
    React.createElement('div', null,
      React.createElement('div', { className: "grid grid-cols-2 gap-4 mb-6" },
          React.createElement(StatCard, { title: "Total Payable", amount: totalPayable, colorClass: "text-red-600" }),
          React.createElement(StatCard, { title: "Total Receivable", amount: totalReceivable, colorClass: "text-green-600" })
      ),

      React.createElement('div', { className: "flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4" },
        React.createElement('h1', { className: "text-2xl font-bold" }, "Cheque Management"),
        React.createElement('div', { className: "flex items-center gap-2" },
            React.createElement(ViewToggleButton, { active: viewMode === 'list', onClick: () => setViewMode('list') },
                React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z", clipRule: "evenodd" })),
                "List"
            ),
            React.createElement(ViewToggleButton, { active: viewMode === 'calendar', onClick: () => setViewMode('calendar') },
               React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z", clipRule: "evenodd" })),
                "Calendar"
            ),
             React.createElement('button', { onClick: handleAddChequeClick, className: "ml-2 px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-xs shadow" },
              "+ New"
            )
        )
      ),

      viewMode === 'list' ? (
        React.createElement('div', null,
          React.createElement('div', { className: "flex border-b border-gray-200 dark:border-gray-700 mb-6" },
            React.createElement(TabButton, { id: 'today', label: 'Today' }),
            React.createElement(TabButton, { id: 'payable', label: 'Payables' }),
            React.createElement(TabButton, { id: 'receivable', label: 'Receivables' })
          ),
          
          filteredCheques.length > 0 ? (
              React.createElement('div', { className: "space-y-4" },
                  filteredCheques.map(cheque => (
                      React.createElement(ChequeCard, { key: cheque.id, cheque: cheque, onUpdateStatus: onUpdateChequeStatus, onDelete: () => onDeleteCheque(cheque.id) })
                  ))
              )
          ) : (
            React.createElement('div', { className: "text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700" },
                React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "mx-auto h-12 w-12 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })
                ),
                React.createElement('h3', { className: "mt-2 text-xl font-medium text-gray-900 dark:text-white" }, 
                    activeTab === 'today' ? "No cheques due today." : `No pending ${activeTab}s found.`
                ),
                React.createElement('p', { className: "mt-1 text-gray-500 dark:text-gray-400 text-sm" },
                    "Click '+ New' to add a cheque record."
                )
            )
          )
        )
      ) : (
        React.createElement(CalendarView, { cheques: cheques })
      ),

      React.createElement(ChequeForm, 
        { isOpen: isFormOpen,
        onClose: () => setIsFormOpen(false),
        onSave: handleSave,
        chequeType: activeTab === 'receivable' ? 'receivable' : 'payable',
        accounts: accounts,
        onSaveNewAccount: onSaveNewAccount }
      )
    )
  );
};

export default ChequeManager;