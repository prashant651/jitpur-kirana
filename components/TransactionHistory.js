import React, { useState } from 'react';

const TransactionRow = ({ transaction, accountType, onPhotoClick }) => {
    const isIncrease = transaction.type === 'increase';
    
    let label = '';
    let colorClass = '';

    if (accountType === 'customer') {
        if (isIncrease) {
            label = 'Bill / Udharo';
            colorClass = 'text-red-600 dark:text-red-500';
        } else {
            label = 'Cash Received';
            colorClass = 'text-green-600 dark:text-green-500';
        }
    } else { // supplier
        if (isIncrease) {
            label = 'Purchase / Payable';
            colorClass = 'text-red-600 dark:text-red-500';
        } else {
            label = 'Payment Made';
            colorClass = 'text-green-600 dark:text-green-500';
        }
    }

    return (
        React.createElement('li', { className: "py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md" },
            React.createElement('div', { className: "flex items-center space-x-4" },
                React.createElement('div', { className: "flex-shrink-0" },
                    React.createElement('p', { className: "text-sm font-semibold text-gray-800 dark:text-gray-200" }, transaction.date)
                ),
                React.createElement('div', { className: "flex-1 min-w-0" },
                    React.createElement('p', { className: "text-md font-medium text-gray-900 dark:text-white truncate" }, label),
                    transaction.note && React.createElement('p', { className: "text-sm text-gray-500 dark:text-gray-400 truncate" }, transaction.note)
                ),
                React.createElement('div', { className: "inline-flex items-center text-md font-semibold text-right" },
                    React.createElement('span', { className: colorClass },
                        `${isIncrease ? '+' : '-'} Rs ${transaction.amount.toLocaleString('en-IN')}`
                    )
                )
            ),
            transaction.photo && (
                 React.createElement('div', { className: "mt-2 pl-4" },
                    React.createElement('button', { onClick: () => onPhotoClick(transaction.photo), className: "text-sm text-blue-600 hover:underline dark:text-blue-400" },
                        "View Attached Photo"
                    )
                )
            )
        )
    );
};


const TransactionHistory = ({ isOpen, onClose, account, transactions }) => {
    const [previewImage, setPreviewImage] = useState(null);

    const handleDownloadPDF = () => {
        if (!account) return;

        const doc = new jspdf.jsPDF();
        
        doc.setFontSize(18);
        doc.text('Transaction Statement', 14, 22);
        
        doc.setFontSize(11);
        doc.text(`Account: ${account.name}`, 14, 32);
        doc.text(`Type: ${account.type.charAt(0).toUpperCase() + account.type.slice(1)}`, 14, 38);
        
        const balanceText = `Current Balance: Rs ${account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        doc.text(balanceText, 205 - doc.getTextWidth(balanceText), 32);

        const head = [['Date', 'Description', 'Debit (Rs)', 'Credit (Rs)', 'Balance (Rs)']];
        const body = [];

        const sortedTransactions = [...transactions].reverse();

        const netTransactionValue = transactions.reduce((acc, tx) => {
            return tx.type === 'increase' ? acc + tx.amount : acc - tx.amount;
        }, 0);
        const openingBalance = account.balance - netTransactionValue;

        let runningBalance = openingBalance;
        
        body.push(['', 'Opening Balance', '', '', openingBalance.toLocaleString('en-IN')]);

        sortedTransactions.forEach(tx => {
            const isIncrease = tx.type === 'increase';
            let debit = '';
            let credit = '';

            if (account.type === 'customer') {
                if (isIncrease) {
                    debit = tx.amount.toLocaleString('en-IN');
                    runningBalance += tx.amount;
                } else {
                    credit = tx.amount.toLocaleString('en-IN');
                    runningBalance -= tx.amount;
                }
            } else {
                if (isIncrease) {
                    credit = tx.amount.toLocaleString('en-IN');
                    runningBalance += tx.amount;
                } else {
                    debit = tx.amount.toLocaleString('en-IN');
                    runningBalance -= tx.amount;
                }
            }
            
            const description = tx.note ? `${tx.note}` : (account.type === 'customer' ? (isIncrease ? 'Bill / Udharo' : 'Cash Received') : (isIncrease ? 'Purchase / Payable' : 'Payment Made'));
            
            body.push([
                tx.date,
                description,
                debit,
                credit,
                runningBalance.toLocaleString('en-IN')
            ]);
        });

        doc.autoTable({
            startY: 45,
            head: head,
            body: body,
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] },
            styles: { halign: 'right' },
            columnStyles: { 
                0: { halign: 'left' },
                1: { halign: 'left' }
            }
        });

        doc.save(`Statement-${account.name.replace(/\s/g, '_')}-${new Date().toISOString().slice(0,10)}.pdf`);
    };

    if (!isOpen || !account) return null;

    return (
        React.createElement(React.Fragment, null,
            React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-start p-4 overflow-y-auto", onClick: onClose, role: "dialog", "aria-modal": "true" },
                React.createElement('div', { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl my-8", onClick: e => e.stopPropagation() },
                    React.createElement('div', { className: "flex justify-between items-center p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10" },
                        React.createElement('div', null,
                            React.createElement('h2', { className: "text-xl font-bold" }, "Transaction History"),
                            React.createElement('p', { className: "text-sm text-gray-500 dark:text-gray-400" }, account.name)
                        ),
                        React.createElement('div', { className: "flex items-center gap-2" },
                           React.createElement('button', { onClick: handleDownloadPDF, className: "p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700", "aria-label": "Download PDF" },
                                React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
                                    React.createElement('path', { fillRule: "evenodd", d: "M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z", clipRule: "evenodd" })
                                )
                            ),
                            React.createElement('button', { onClick: onClose, className: "p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700", "aria-label": "Close modal" },
                                React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))
                            )
                        )
                    ),
                    React.createElement('div', { className: "p-2 md:p-4" },
                        transactions.length > 0 ? (
                            React.createElement('ul', { className: "divide-y divide-gray-200 dark:divide-gray-700" },
                                transactions.map(tx => (
                                    React.createElement(TransactionRow, { key: tx.id, transaction: tx, accountType: account.type, onPhotoClick: setPreviewImage })
                                ))
                            )
                        ) : (
                            React.createElement('div', { className: "text-center py-12" },
                                React.createElement('p', { className: "text-gray-500 dark:text-gray-400" }, "No transactions recorded for this account yet.")
                            )
                        )
                    )
                )
            ),
            previewImage && (
                React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4", onClick: () => setPreviewImage(null) },
                    React.createElement('img', { src: previewImage, alt: "Transaction attachment", className: "max-w-full max-h-full rounded-lg" })
                )
            )
        )
    );
};

export default TransactionHistory;
