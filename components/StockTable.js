import React, { useMemo } from 'react';

const TableHeader = () => (
    React.createElement('thead', { className: "bg-gray-100 dark:bg-gray-700" },
        React.createElement('tr', null,
            // Item Name gets a generous minimum width for readability
            React.createElement('th', { scope: "col", className: "px-2 py-3 text-left text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[160px]" }, "Item Name"),
            React.createElement('th', { scope: "col", className: "px-1 py-3 text-center text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider w-16" }, "Open"),
            React.createElement('th', { scope: "col", className: "px-1 py-3 text-center text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider w-16" }, "Close"),
            React.createElement('th', { scope: "col", className: "px-1 py-3 text-center text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider w-14" }, "Sold"),
            React.createElement('th', { scope: "col", className: "px-1 py-3 text-center text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20" }, "Rate"),
            React.createElement('th', { scope: "col", className: "px-2 py-3 text-right text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24" }, "Total"),
            React.createElement('th', { scope: "col", className: "w-10 px-1" }, React.createElement('span', { className: "sr-only" }, "Actions"))
        )
    )
);

const TableRow = ({ item, onUpdate, onRemove, isReadOnly }) => {
    const soldQty = useMemo(() => item.openingQty - item.closingQty, [item.openingQty, item.closingQty]);
    const totalAmount = useMemo(() => soldQty * item.rate, [soldQty, item.rate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ ...item, [name]: name === 'name' ? value : parseFloat(value) || 0 });
    };
    
    // Using min-w-0 and block to ensure Safari respects the table cell constraints
    const inputClass = "w-full min-w-0 bg-transparent p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:text-gray-500 dark:disabled:text-gray-400 text-xs sm:text-sm border-none shadow-none block";

    return (
        React.createElement('tr', { className: "bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-800/50" },
            React.createElement('td', { className: "px-2 py-2" }, 
                React.createElement('input', { 
                    type: "text", 
                    name: "name", 
                    value: item.name, 
                    onChange: handleInputChange, 
                    className: `${inputClass} font-semibold text-gray-900 dark:text-white`, 
                    disabled: isReadOnly, 
                    placeholder: "Item Name" 
                })
            ),
            React.createElement('td', { className: "px-1 py-2 text-center" }, 
                React.createElement('input', { type: "number", name: "openingQty", value: item.openingQty || '', onChange: handleInputChange, className: `${inputClass} text-center`, disabled: isReadOnly })
            ),
            React.createElement('td', { className: "px-1 py-2 text-center" }, 
                React.createElement('input', { type: "number", name: "closingQty", value: item.closingQty || '', onChange: handleInputChange, className: `${inputClass} text-center`, disabled: isReadOnly })
            ),
            React.createElement('td', { className: "px-1 py-2 text-center text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100" }, 
                soldQty
            ),
            React.createElement('td', { className: "px-1 py-2 text-center" }, 
                React.createElement('input', { type: "number", name: "rate", value: item.rate || '', onChange: handleInputChange, className: `${inputClass} text-center`, disabled: isReadOnly })
            ),
            React.createElement('td', { className: "px-2 py-2 text-right text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100" }, 
                totalAmount.toLocaleString('en-IN')
            ),
            React.createElement('td', { className: "px-1 py-2 text-center" },
                !isReadOnly && (
                    React.createElement('button', { onClick: onRemove, className: "p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors", "aria-label": "Remove item" },
                        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 mx-auto", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z", clipRule: "evenodd" }))
                    )
                )
            )
        )
    );
};

export const StockTable = ({ items, onItemsChange, isReadOnly }) => {

    const totalSales = useMemo(() => {
        return items.reduce((total, item) => {
            const soldQty = item.openingQty - item.closingQty;
            return total + (soldQty * item.rate);
        }, 0);
    }, [items]);
    
    const handleUpdateItem = (updatedItem) => {
        const newItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
        onItemsChange(newItems);
    };

    const handleRemoveItem = (itemId) => {
        onItemsChange(items.filter(item => item.id !== itemId));
    };
    
    const handleAddItem = () => {
        const newItem = {
            id: `item-${Date.now()}`,
            name: '',
            rate: 0,
            openingQty: 0,
            closingQty: 0
        };
        onItemsChange([...items, newItem]);
    };

    return (
         React.createElement('div', { className: "bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
            React.createElement('div', { className: "flex justify-between items-center mb-3 px-1" },
                 React.createElement('h2', { className: "text-md sm:text-lg font-bold" }, "Stock Calculation"),
                 !isReadOnly && (
                     React.createElement('button', { onClick: handleAddItem, className: "px-3 py-1.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors text-[10px] uppercase tracking-wide shadow-sm" },
                        "+ Add Item"
                     )
                 )
            ),
            // The wrapper allows horizontal scrolling on mobile without stretching the whole app
            React.createElement('div', { className: "overflow-x-auto -mx-2 sm:mx-0 border rounded-lg dark:border-gray-700" },
                React.createElement('table', { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700" },
                    React.createElement(TableHeader, null),
                    React.createElement('tbody', { className: "divide-y divide-gray-200 dark:divide-gray-700" },
                        items.map(item => (
                            React.createElement(TableRow, 
                                { key: item.id,
                                item: item,
                                onUpdate: handleUpdateItem,
                                onRemove: () => handleRemoveItem(item.id),
                                isReadOnly: isReadOnly }
                            )
                        ))
                    ),
                    React.createElement('tfoot', null,
                        React.createElement('tr', { className: "bg-gray-100 dark:bg-gray-700 font-bold" },
                            React.createElement('td', { colSpan: 5, className: "px-2 py-3 text-right text-[11px] sm:text-sm text-gray-800 dark:text-gray-100" }, "Total Sales Today:"),
                            React.createElement('td', { className: "px-2 py-3 text-right text-[11px] sm:text-sm text-gray-800 dark:text-gray-100" },
                                `Rs ${totalSales.toLocaleString('en-IN')}`
                            ),
                             React.createElement('td', null)
                        )
                    )
                )
            )
        )
    );
};