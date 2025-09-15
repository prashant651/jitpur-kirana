import React, { useState, useEffect } from 'react';
import { AccountForm } from './AccountForm.js';

const Modal = ({ children, onClose, title }) => {
  return (
    React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4", onClick: onClose, role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title" },
      React.createElement('div', { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md", onClick: e => e.stopPropagation() },
        React.createElement('div', { className: "flex justify-between items-center p-4 border-b dark:border-gray-700" },
          React.createElement('h2', { id: "modal-title", className: "text-xl font-bold" }, title),
          React.createElement('button', { onClick: onClose, className: "p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700", "aria-label": "Close modal" },
            React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))
          )
        ),
        React.createElement('div', { className: "p-6" }, children)
      )
    )
  );
};

export const ChequeForm = ({ isOpen, onClose, onSave, chequeType, accounts, onSaveNewAccount }) => {
  const [formData, setFormData] = useState({
    partyName: '',
    bankName: '',
    chequeNumber: '',
    amount: 0,
    date: '',
    reminderDate: ''
  });
  const [isNewContactFormOpen, setIsNewContactFormOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setFormData({
            partyName: '',
            bankName: '',
            chequeNumber: '',
            amount: 0,
            date: '',
            reminderDate: ''
        });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  const handlePartyNameChange = (e) => {
    const { value } = e.target;
    if (value === 'add_new') {
        setIsNewContactFormOpen(true);
    } else {
        handleChange(e);
    }
  };

  const handleSaveNewContact = (accountData) => {
    const savedAccount = onSaveNewAccount(accountData);
    setIsNewContactFormOpen(false);
    setFormData(prev => ({...prev, partyName: savedAccount.name }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.partyName || !formData.amount || !formData.chequeNumber || !formData.date) {
      alert('Party Name, Amount, Cheque Number, and Cheque Date are required.');
      return;
    }
    onSave(formData);
  };
  
  if (!isOpen) return null;

  return (
    React.createElement(React.Fragment, null,
      React.createElement(Modal, { onClose: onClose, title: `Add New ${chequeType === 'payable' ? 'Payable' : 'Receivable'} Cheque` },
        React.createElement('form', { onSubmit: handleSubmit, className: "space-y-4" },
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "partyName", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Party Name*"),
            React.createElement('select', { 
                id: "partyName", 
                name: "partyName", 
                value: formData.partyName, 
                onChange: handlePartyNameChange, 
                required: true, 
                className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
            },
                React.createElement('option', { value: "", disabled: true }, "-- Select a Contact --"),
                accounts.map(acc => (
                    React.createElement('option', { key: acc.id, value: acc.name }, acc.name)
                )),
                React.createElement('option', { value: "add_new", className: "font-bold text-blue-600" }, "+ Add New Contact")
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "amount", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Amount*"),
            React.createElement('input', { type: "number", id: "amount", name: "amount", value: formData.amount || '', onChange: handleChange, required: true, className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "chequeNumber", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Cheque Number*"),
            React.createElement('input', { type: "text", id: "chequeNumber", name: "chequeNumber", value: formData.chequeNumber, onChange: handleChange, required: true, className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "bankName", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Bank Name"),
            React.createElement('input', { type: "text", id: "bankName", name: "bankName", value: formData.bankName || '', onChange: handleChange, className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "date", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Cheque Date (BS)*"),
            React.createElement('input', { type: "text", id: "date", name: "date", value: formData.date, onChange: handleChange, required: true, placeholder: "YYYY-MM-DD", className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: "reminderDate", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Reminder Date (BS)"),
            React.createElement('input', { type: "text", id: "reminderDate", name: "reminderDate", value: formData.reminderDate, onChange: handleChange, placeholder: "YYYY-MM-DD", className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
          ),
          React.createElement('div', { className: "flex justify-end gap-3 pt-4" },
            React.createElement('button', { type: "button", onClick: onClose, className: "px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500" }, "Cancel"),
            React.createElement('button', { type: "submit", className: "px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors" }, "Save Cheque")
          )
        )
      ),
      React.createElement(AccountForm, {
        isOpen: isNewContactFormOpen,
        onClose: () => setIsNewContactFormOpen(false),
        onSave: handleSaveNewContact,
        account: null
      })
    )
  );
};