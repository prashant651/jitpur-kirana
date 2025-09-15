import React, { useMemo, useState } from 'react';
import { AccountForm } from './AccountForm.js';

const DailyTransactionInput = ({ title, transactions, onTransactionsChange, accounts, onAddNewCustomer, isReadOnly }) => {
    const [isNewCustomerFormOpen, setIsNewCustomerFormOpen] = useState(false);
    
    const handleAddRow = () => {
        const newRow = { id: Date.now().toString(), customerId: '', amount: 0 };
        onTransactionsChange([...transactions, newRow]);
    };

    const handleRemoveRow = (id) => {
        onTransactionsChange(transactions.filter(tx => tx.id !== id));
    };

    const handleUpdateRow = (id, updatedTx) => {
        onTransactionsChange(transactions.map(tx => tx.id === id ? { ...tx, ...updatedTx } : tx));
    };
    
    const handleCustomerChange = (id, customerId) => {
        if (customerId === 'add_new') {
            setIsNewCustomerFormOpen(true);
        } else {
            handleUpdateRow(id, { customerId });
        }
    };
    
    const handleSaveNewCustomer = (accountData) => {
        const newAccount = onAddNewCustomer(accountData);
        setIsNewCustomerFormOpen(false);
    };

    return (
        React.createElement('div', { className: "space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50" },
            React.createElement('h3', { className: "font-semibold text-lg text-center" }, title),
            transactions.map((tx, index) => (
                React.createElement('div', { key: tx.id, className: "flex items-center gap-2" },
                    React.createElement('select',
                        {
                            value: tx.customerId,
                            onChange: (e) => handleCustomerChange(tx.id, e.target.value),
                            className: "flex-grow block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm",
                            disabled: isReadOnly
                        },
                        React.createElement('option', { value: "", disabled: true }, "Select Customer"),
                        accounts.map(acc => React.createElement('option', { key: acc.id, value: acc.id }, acc.name)),
                        React.createElement('option', { value: "add_new", className: "text-blue-600 font-bold" }, "+ Add New Customer")
                    ),
                    React.createElement('input',
                        {
                            type: "number",
                            placeholder: "Amount",
                            value: tx.amount || '',
                            onChange: (e) => handleUpdateRow(tx.id, { amount: parseFloat(e.target.value) || 0 }),
                            className: "w-28 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm",
                            disabled: isReadOnly
                        }
                    ),
                    !isReadOnly && (
                        React.createElement('button', { onClick: () => handleRemoveRow(tx.id), className: "p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full", "aria-label": "Remove Row" },
                           React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z", clipRule: "evenodd" }))
                        )
                    )
                )
            )),
            !isReadOnly && (
                React.createElement('button', { onClick: handleAddRow, className: "w-full mt-2 px-4 py-2 text-sm border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" },
                    "+ Add Row"
                )
            ),
            React.createElement(AccountForm, 
                { isOpen: isNewCustomerFormOpen, 
                onClose: () => setIsNewCustomerFormOpen(false), 
                onSave: handleSaveNewCustomer, 
                account: null } 
            )
        )
    );
};


const InputField = ({ label, name, value, onChange, isReadOnly }) => (
    React.createElement('div', null,
        React.createElement('label', { htmlFor: name, className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, label),
        React.createElement('input',
            {
                type: "number",
                id: name,
                name: name,
                value: value || '',
                onChange: onChange,
                className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 dark:disabled:bg-gray-700",
                disabled: isReadOnly
            }
        )
    )
);

export const CashBalanceSheet = ({ balanceData, onBalanceChange, totalSales, accounts, onAddNewCustomer, isReadOnly, balanceDifference }) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onBalanceChange({
            ...balanceData,
            [name]: parseFloat(value) || 0,
        });
    };
    
    const handleTransactionsChange = (field, transactions) => {
        onBalanceChange({ ...balanceData, [field]: transactions });
    };

    const { totalLeft, totalRight } = useMemo(() => {
        const totalCashIn = balanceData.cashTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        const totalCreditSales = balanceData.creditTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        
        const totalLeft = totalSales + totalCashIn + balanceData.chequesReceived;
        const totalRight = balanceData.expenses + totalCreditSales + balanceData.onlinePayments + balanceData.chequesOnHand + balanceData.cashOnHand;
        return { totalLeft, totalRight };
    }, [balanceData, totalSales]);

    const differenceColor = balanceDifference === 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500';

    return (
        React.createElement('div', { className: "bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
            React.createElement('h2', { className: "text-xl font-bold mb-4 border-b pb-2 dark:border-gray-600" }, "Cash Balancing"),
            React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" },
                
                 React.createElement('div', { className: "space-y-4" },
                     React.createElement('h3', { className: "font-semibold text-xl text-center mb-4" }, "Income & Collections"),
                     React.createElement('div', null,
                        React.createElement('label', { className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Total Sales Today"),
                        React.createElement('p', { className: "mt-1 w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-md font-bold text-lg" },
                            totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        )
                    ),
                    React.createElement(DailyTransactionInput,
                        {
                            title: "Cash Received from Customers",
                            transactions: balanceData.cashTransactions,
                            onTransactionsChange: (txs) => handleTransactionsChange('cashTransactions', txs),
                            accounts: accounts,
                            onAddNewCustomer: onAddNewCustomer,
                            isReadOnly: isReadOnly
                        }
                    ),
                    React.createElement(InputField, { label: "Cheques Received Today", name: "chequesReceived", value: balanceData.chequesReceived, onChange: handleInputChange, isReadOnly: isReadOnly })
                ),
                
                 React.createElement('div', { className: "space-y-4" },
                    React.createElement('h3', { className: "font-semibold text-xl text-center mb-4" }, "Expenses & Assets"),
                    React.createElement(DailyTransactionInput,
                        {
                            title: "Today's Credit Sales (Udharo)",
                            transactions: balanceData.creditTransactions,
                            onTransactionsChange: (txs) => handleTransactionsChange('creditTransactions', txs),
                            accounts: accounts,
                            onAddNewCustomer: onAddNewCustomer,
                            isReadOnly: isReadOnly
                        }
                    ),
                    React.createElement(InputField, { label: "Today's Expenses", name: "expenses", value: balanceData.expenses, onChange: handleInputChange, isReadOnly: isReadOnly }),
                    React.createElement(InputField, { label: "Online Payments Received", name: "onlinePayments", value: balanceData.onlinePayments, onChange: handleInputChange, isReadOnly: isReadOnly }),
                    React.createElement(InputField, { label: "Cheques on Hand", name: "chequesOnHand", value: balanceData.chequesOnHand, onChange: handleInputChange, isReadOnly: isReadOnly }),
                    React.createElement(InputField, { label: "Cash on Hand", name: "cashOnHand", value: balanceData.cashOnHand, onChange: handleInputChange, isReadOnly: isReadOnly })
                )
            ),
            
            React.createElement('div', { className: "mt-6 pt-4 border-t dark:border-gray-600 grid grid-cols-1 md:grid-cols-3 gap-4 text-center" },
                 React.createElement('div', null,
                    React.createElement('h4', { className: "text-md font-medium text-gray-500 dark:text-gray-400" }, "Total Income Side"),
                    React.createElement('p', { className: "text-xl font-bold text-gray-800 dark:text-gray-100 mt-1" },
                        `Rs ${totalLeft.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    )
                ),
                 React.createElement('div', null,
                    React.createElement('h4', { className: "text-md font-medium text-gray-500 dark:text-gray-400" }, "Total Expenses Side"),
                    React.createElement('p', { className: "text-xl font-bold text-gray-800 dark:text-gray-100 mt-1" },
                        `Rs ${totalRight.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    )
                ),
                 React.createElement('div', null,
                    React.createElement('h4', { className: "text-md font-medium text-gray-500 dark:text-gray-400" }, "Difference"),
                    React.createElement('p', { className: `text-xl font-bold ${differenceColor} mt-1` },
                        `Rs ${balanceDifference.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    )
                )
            )
        )
    );
};
