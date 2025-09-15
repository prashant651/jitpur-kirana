import React, { useState, useEffect } from 'react';

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

export const AccountForm = ({ isOpen, onClose, onSave, account }) => {
  const [formData, setFormData] = useState({ name: '', type: 'customer', phone: '', address: '', pan: '' });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: account?.name || '',
        type: account?.type || 'customer',
        phone: account?.phone || '',
        address: account?.address || '',
        pan: account?.pan || '',
      });
    }
  }, [account, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Account name is required.');
      return;
    }
    onSave({ id: account?.id || '', ...formData });
  };
  
  if (!isOpen) return null;

  return (
    React.createElement(Modal, { onClose: onClose, title: account ? 'Edit Contact' : 'Add New Contact' },
      React.createElement('form', { onSubmit: handleSubmit, className: "space-y-4" },
        React.createElement('div', null,
          React.createElement('label', { htmlFor: "name", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Account Name*"),
          React.createElement('input', { type: "text", id: "name", name: "name", value: formData.name, onChange: handleChange, required: true, className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
        ),
        React.createElement('div', null,
          React.createElement('label', { htmlFor: "type", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Account Type"),
          React.createElement('select', { id: "type", name: "type", value: formData.type, onChange: handleChange, className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" },
            React.createElement('option', { value: "customer" }, "Customer"),
            React.createElement('option', { value: "supplier" }, "Supplier")
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { htmlFor: "phone", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Phone Number"),
          React.createElement('input', { type: "tel", id: "phone", name: "phone", value: formData.phone, onChange: handleChange, className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
        ),
         React.createElement('div', null,
          React.createElement('label', { htmlFor: "address", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Address"),
          React.createElement('input', { type: "text", id: "address", name: "address", value: formData.address, onChange: handleChange, className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
        ),
         React.createElement('div', null,
          React.createElement('label', { htmlFor: "pan", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "PAN Number"),
          React.createElement('input', { type: "text", id: "pan", name: "pan", value: formData.pan, onChange: handleChange, className: "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
        ),
        React.createElement('div', { className: "flex justify-end gap-3 pt-4" },
          React.createElement('button', { type: "button", onClick: onClose, className: "px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500" }, "Cancel"),
          React.createElement('button', { type: "submit", className: "px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors" }, "Save Contact")
        )
      )
    )
  );
};
