import React, { useState, useEffect, useRef } from 'react';

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

export const TransactionForm = ({ isOpen, onClose, onSave, account }) => {
  const getDefaultTransactionType = () => account?.type === 'customer' ? 'decrease' : 'increase';

  const [amount, setAmount] = useState('');
  const [type, setType] = useState(getDefaultTransactionType());
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);


  useEffect(() => {
    if (isOpen && account) {
      setDate('2081-05-29');
      setAmount('');
      setNote('');
      setPhoto(null);
      setType(account.type === 'customer' ? 'decrease' : 'increase');
    }
  }, [isOpen, account]);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!account || !amount || !date) {
      alert('Please fill in all required fields.');
      return;
    }

    onSave({
      accountId: account.id,
      amount: parseFloat(amount),
      type: type,
      date,
      note,
      photo: photo || undefined,
    });
  };

  if (!isOpen || !account) return null;

  const customerLabels = { increase: 'Bill/Udharo', decrease: 'Cash Received' };
  const supplierLabels = { increase: 'Purchase/Payable', decrease: 'Payment Made' };
  const labels = account.type === 'customer' ? customerLabels : supplierLabels;
  const isIncreaseSelected = type === 'increase';

  return (
    React.createElement(Modal, { onClose: onClose, title: `Add Transaction for ${account.name}` },
      React.createElement('form', { onSubmit: handleSubmit, className: "space-y-4" },
        React.createElement('div', null,
          React.createElement('label', { htmlFor: "amount", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Amount*"),
          React.createElement('input', 
            { type: "number", 
            id: "amount", 
            value: amount, 
            onChange: e => setAmount(e.target.value), 
            required: true, 
            className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500", 
            placeholder: "e.g., 5000" }
          )
        ),

        React.createElement('div', null,
           React.createElement('label', { className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Transaction Type"),
           React.createElement('div', { className: "mt-1 flex rounded-md shadow-sm" },
             React.createElement('button', { type: "button", onClick: () => setType('decrease'), className: `relative inline-flex items-center justify-center w-1/2 px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium transition-colors ${!isIncreaseSelected ? 'bg-blue-600 text-white z-10' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'}` },
                labels.decrease
             ),
             React.createElement('button', { type: "button", onClick: () => setType('increase'), className: `-ml-px relative inline-flex items-center justify-center w-1/2 px-4 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium transition-colors ${isIncreaseSelected ? 'bg-red-600 text-white z-10' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'}` },
                labels.increase
             )
           )
        ),

        React.createElement('div', null,
          React.createElement('label', { htmlFor: "date", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Date (BS)*"),
          React.createElement('input', 
            { type: "text", 
            id: "date", 
            value: date, 
            onChange: e => setDate(e.target.value), 
            required: true, 
            className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
            placeholder: "YYYY-MM-DD" }
          )
        ),

        React.createElement('div', null,
          React.createElement('label', { htmlFor: "note", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Note (Optional)"),
          React.createElement('input', 
            { type: "text", 
            id: "note", 
            value: note, 
            onChange: e => setNote(e.target.value), 
            className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500", 
            placeholder: "e.g., Invoice #123" }
          )
        ),
        
        React.createElement('div', null,
           React.createElement('label', { className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Photo (Optional)"),
            React.createElement('input', { type: "file", accept: "image/*", ref: fileInputRef, onChange: handleFileSelect, className: "hidden" }),
            photo ? (
                React.createElement('div', { className: "mt-2 relative" },
                    React.createElement('img', { src: photo, alt: "Preview", className: "w-full h-auto max-h-40 object-contain rounded-md border dark:border-gray-600" }),
                    React.createElement('button', { type: "button", onClick: () => setPhoto(null), className: "absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 leading-none" }, "×")
                )
            ) : (
                React.createElement('button', { type: "button", onClick: () => fileInputRef.current?.click(), className: "mt-1 w-full flex justify-center py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" },
                    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 mr-2", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z", clipRule: "evenodd" })),
                    "Attach Photo"
                )
            )
        ),

        React.createElement('div', { className: "flex justify-end gap-3 pt-4" },
          React.createElement('button', { type: "button", onClick: onClose, className: "px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500" }, "Cancel"),
          React.createElement('button', { type: "submit", className: "px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors" }, "Save Transaction")
        )
      )
    )
  );
};
