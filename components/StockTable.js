import React, { useMemo } from 'react';

const TableHeader = () => (
    React.createElement('thead', { className: "bg-gray-100 dark:bg-gray-700" },
        React.createElement('tr', null,
            React.createElement('th', { scope: "col", className: "px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-3/12" }, "Item Name"),
            React.createElement('th', { scope: "col", className: "px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12" }, "Opening"),
            React.createElement('th', { scope: "col", className: "px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12" }, "Closing"),
            React.createElement('th', { scope: "col", className: "px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12" }, "Sold Qty"),
            React.createElement('th', { scope: "col", className: "px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12" }, "Rate"),
            React.createElement('th', { scope: "col", className: "px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12" }, "Total Amount"),
            React.createElement('th', { scope: "col", className: "relative px-3 py-3 w-1/12" }, React.createElement('span', { className: "sr-only" }, "Actions"))
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
    
    const inputClass = "w-full bg-transparent p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:text-gray-500 dark:disabled:text-gray-400";

    return (
        React.createElement('tr', { className: "bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-800/50" },
            React.createElement('td', { className: "px-3 py-2 whitespace-nowrap" }, React.createElement('input', { type: "text", name: "name", value: item.name, onChange: handleInputChange, className: inputClass, disabled: isReadOnly })),
            React.createElement('td', { className: "px-3 py-2 whitespace-nowrap" }, React.createElement('input', { type: "number", name: "openingQty", value: item.openingQty || '', onChange: handleInputChange, className: inputClass, disabled: isReadOnly })),
            React.createElement('td', { className: "px-3 py-2 whitespace-nowrap" }, React.createElement('input', { type: "number", name: "closingQty", value: item.closingQty || '', onChange: handleInputChange, className: inputClass, disabled: isReadOnly })),
            React.createElement('td', { className: "px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100" }, soldQty),
            React.createElement('td', { className: "px-3 py-2 whitespace-nowrap" }, React.createElement('input', { type: "number", name: "rate", value: item.rate || '', onChange: handleInputChange, className: inputClass, disabled: isReadOnly })),
            React.createElement('td', { className: "px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100" }, totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })),
            React.createElement('td', { className: "px-3 py-2 whitespace-nowrap text-right" },
                !isReadOnly && (
                    React.createElement('button', { onClick: onRemove, className: "text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400", "aria-label": "Remove item" },
                        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z", clipRule: "evenodd" }))
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
         React.createElement('div', { className: "bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
            React.createElement('div', { className: "flex justify-between items-center mb-4" },
                 React.createElement('h2', { className: "text-xl font-bold" }, "Stock Calculation"),
                 !isReadOnly && (
                     React.createElement('button', { onClick: handleAddItem, className: "px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm shadow" },
                        "+ Add Item"
                     )
                 )
            ),
            React.createElement('div', { className: "overflow-x-auto" },
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
                            React.createElement('td', { colSpan: 5, className: "px-3 py-3 text-right text-gray-800 dark:text-gray-100" }, "Total Sales Today:"),
                            React.createElement('td', { className: "px-3 py-3 text-left text-gray-800 dark:text-gray-100" },
                                `Rs ${totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            ),
                             React.createElement('td', null)
                        )
                    )
                )
            )
        )
    );
};
