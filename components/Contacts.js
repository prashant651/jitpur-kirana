import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AccountForm } from './AccountForm.js';

const ContactListItem = ({ account, onEdit, onDelete }) => {
    return (
        React.createElement('div', { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-3" },
            React.createElement('div', { className: "flex-grow" },
                React.createElement('h3', { className: "font-bold text-gray-900 dark:text-white" }, account.name),
                React.createElement('div', { className: "text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-2" },
                    account.phone && React.createElement('p', { className: "flex items-center" }, React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 mr-2 text-gray-400 flex-shrink-0", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { d: "M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" })), ` ${account.phone}`),
                    account.address && React.createElement('p', { className: "flex items-center" }, React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 mr-2 text-gray-400 flex-shrink-0", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z", clipRule: "evenodd" })), ` ${account.address}`),
                    account.pan && React.createElement('p', { className: "flex items-center" }, React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 mr-2 text-gray-400 flex-shrink-0", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm12 5a1 1 0 100-2H4a1 1 0 100 2h12zM4 13a1 1 0 100 2h6a1 1 0 100-2H4z", clipRule: "evenodd" })), ` ${account.pan}`)
                )
            ),
            React.createElement('div', { className: "flex gap-2 flex-shrink-0 self-end sm:self-center" },
                React.createElement('button', { onClick: onEdit, className: "p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors", "aria-label": "Edit Contact" },
                    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { d: "M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" }), React.createElement('path', { fillRule: "evenodd", d: "M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z", clipRule: "evenodd" }))
                ),
                React.createElement('button', { onClick: onDelete, className: "p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-500 transition-colors", "aria-label": "Delete Contact" },
                    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z", clipRule: "evenodd" }))
                )
            )
        )
    );
};

const Contacts = ({ accounts, onSave, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('customer');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);

    const filteredContacts = useMemo(() => {
        const byTab = accounts.filter(acc => acc.type === activeTab);
        if (!searchTerm) return byTab;

        return byTab.filter(acc =>
            acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acc.phone?.includes(searchTerm)
        );
    }, [accounts, searchTerm, activeTab]);

    const handleAddContactClick = () => {
        setEditingContact(null);
        setIsFormOpen(true);
    };

    const handleEditContact = (accountId) => {
        const contactToEdit = accounts.find(acc => acc.id === accountId);
        if (contactToEdit) {
            setEditingContact(contactToEdit);
            setIsFormOpen(true);
        }
    };

    const handleSave = (accountData) => {
        onSave({ ...accountData, type: activeTab });
        setIsFormOpen(false);
        setEditingContact(null);
    };

    const handleKeyPress = useCallback((event) => {
        if (event.key === 'Escape') {
            setIsFormOpen(false);
            setEditingContact(null);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    return (
        React.createElement('div', null,
            React.createElement('div', { className: "flex border-b border-gray-200 dark:border-gray-700 mb-6" },
                React.createElement('button', { onClick: () => setActiveTab('customer'), className: `py-2 px-4 text-lg font-semibold transition-colors ${activeTab === 'customer' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}` }, "Customers"),
                React.createElement('button', { onClick: () => setActiveTab('supplier'), className: `py-2 px-4 text-lg font-semibold transition-colors ${activeTab === 'supplier' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}` }, "Suppliers")
            ),
            React.createElement('div', { className: "flex flex-col sm:flex-row justify-between items-center mb-6 gap-4" },
                React.createElement('h1', { className: "text-2xl font-bold capitalize" }, `${activeTab}s (${filteredContacts.length})`),
                React.createElement('div', { className: "w-full sm:w-auto flex gap-2" },
                    React.createElement('input',
                        { type: "text",
                        placeholder: "Search by name or phone...",
                        value: searchTerm,
                        onChange: e => setSearchTerm(e.target.value),
                        className: "w-full sm:w-64 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" }
                    ),
                    React.createElement('button', { onClick: handleAddContactClick, className: "flex-shrink-0 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm shadow" },
                        "+ Add New"
                    )
                )
            ),
            filteredContacts.length > 0 ? (
                React.createElement('div', { className: "space-y-3" },
                    filteredContacts.map(account => (
                        React.createElement(ContactListItem,
                            { key: account.id,
                            account: account,
                            onEdit: () => handleEditContact(account.id),
                            onDelete: () => onDelete(account.id) }
                        )
                    ))
                )
            ) : (
                React.createElement('div', { className: "text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700" },
                    React.createElement('p', { className: "text-gray-500 dark:text-gray-400" }, `No ${activeTab}s found. Add one to get started!`)
                )
            ),
            React.createElement(AccountForm, 
                { isOpen: isFormOpen, 
                onClose: () => setIsFormOpen(false), 
                onSave: handleSave, 
                account: editingContact } 
            )
        )
    );
};

export default Contacts;
