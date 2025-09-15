import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getTodayBSString, getPreviousDateString, getNextDateString } from '../services/bs-date-utils.js';
import { StockTable } from './StockTable.js';
import { CashBalanceSheet } from './CashBalanceSheet.js';
import { commonItems } from '../services/mock-data.js';
import HisabAccountsLedger from './HisabAccountsLedger.js';


const SalesReports = ({ hisabs }) => {
    const [selectedItemName, setSelectedItemName] = useState('');
    const [reportPeriod, setReportPeriod] = useState('weekly');

    const submittedHisabs = useMemo(() => 
        hisabs.filter(h => h.status === 'submitted').sort((a, b) => a.date.localeCompare(b.date)),
    [hisabs]);

    const uniqueItemNames = useMemo(() => {
        const itemSet = new Set();
        submittedHisabs.forEach(hisab => {
            hisab.stockItems.forEach(item => {
                if (item.name.trim()) {
                    itemSet.add(item.name.trim());
                }
            });
        });
        return Array.from(itemSet).sort();
    }, [submittedHisabs]);

    const reportPeriods = [
        { value: 'weekly', label: 'This Week (Last 7d)' },
        { value: 'prev_week', label: 'Previous Week (7d)' },
        { value: 'monthly', label: 'This Month (Last 30d)' },
        { value: 'prev_month', label: 'Previous Month (30d)' }
    ];

    const periodDetails = useMemo(() => {
        switch(reportPeriod) {
            case 'monthly':
                return { title: 'This Month (30d)', description: 'Displaying data for the last 30 days.' };
            case 'prev_week':
                return { title: 'Previous Week', description: 'Displaying data for the previous week (days 8-14 ago).' };
            case 'prev_month':
                return { title: 'Previous Month', description: 'Displaying data for the previous month (days 31-60 ago).' };
            case 'weekly':
            default:
                return { title: 'This Week', description: 'Displaying data for the last 7 days.' };
        }
    }, [reportPeriod]);

    const reportData = useMemo(() => {
        if (!selectedItemName || submittedHisabs.length === 0) return null;
        
        let days;
        let startDate;
        const latestDate = submittedHisabs[submittedHisabs.length - 1].date;

        switch (reportPeriod) {
            case 'monthly':
                days = 30;
                startDate = latestDate;
                break;
            case 'prev_week':
                days = 7;
                let prevWeekStartDate = latestDate;
                for (let i = 0; i < 7; i++) {
                    prevWeekStartDate = getPreviousDateString(prevWeekStartDate);
                }
                startDate = prevWeekStartDate;
                break;
            case 'prev_month':
                days = 30;
                let prevMonthStartDate = latestDate;
                for (let i = 0; i < 30; i++) {
                    prevMonthStartDate = getPreviousDateString(prevMonthStartDate);
                }
                startDate = prevMonthStartDate;
                break;
            case 'weekly':
            default:
                days = 7;
                startDate = latestDate;
                break;
        }
        
        const dateRange = [];
        let currentDate = startDate;
        for (let i = 0; i < days; i++) {
            dateRange.push(currentDate);
            currentDate = getPreviousDateString(currentDate);
        }
        dateRange.reverse();

        const dataByDate = new Map();
        dateRange.forEach(date => dataByDate.set(date, { soldQty: 0, totalValue: 0 }));

        submittedHisabs.forEach(hisab => {
            if (dataByDate.has(hisab.date)) {
                const item = hisab.stockItems.find(i => i.name.trim() === selectedItemName);
                if (item) {
                    const soldQty = item.openingQty - item.closingQty;
                    if (soldQty > 0) {
                        dataByDate.set(hisab.date, { soldQty, totalValue: soldQty * item.rate });
                    }
                }
            }
        });
        
        const chartData = Array.from(dataByDate.entries()).map(([date, data]) => ({
            label: date.substring(5), // M-D
            value: data.totalValue,
        }));
        
        const maxSaleValue = Math.max(...chartData.map(d => d.value), 0);
        
        const { totalSold, totalRevenue } = Array.from(dataByDate.values()).reduce(
            (acc, data) => {
                acc.totalSold += data.soldQty;
                acc.totalRevenue += data.totalValue;
                return acc;
            },
            { totalSold: 0, totalRevenue: 0 }
        );

        return {
            chartData: chartData.map(d => ({ ...d, percent: maxSaleValue > 0 ? (d.value / maxSaleValue) * 100 : 0 })),
            totalSold,
            totalRevenue,
            avgDailyRevenue: totalRevenue / days,
        };

    }, [selectedItemName, reportPeriod, submittedHisabs]);

    const StatCard = ({ title, value }) => (
        React.createElement('div', { className: "bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center" },
            React.createElement('h4', { className: "text-sm font-medium text-gray-500 dark:text-gray-400" }, title),
            React.createElement('p', { className: "text-xl font-bold text-gray-800 dark:text-gray-100" }, value)
        )
    );

    return (
        React.createElement('div', { className: "space-y-6" },
            React.createElement('div', { className: "bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
                React.createElement('h2', { className: "text-xl font-bold" }, "Sales Reports"),
                React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" },
                    React.createElement('select',
                        {
                            value: selectedItemName,
                            onChange: (e) => setSelectedItemName(e.target.value),
                            className: "w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        },
                        React.createElement('option', { value: "" }, "-- Select an Item --"),
                        uniqueItemNames.map(name => React.createElement('option', { key: name, value: name }, name))
                    ),
                    React.createElement('select',
                        {
                            value: reportPeriod,
                            onChange: (e) => setReportPeriod(e.target.value),
                            className: "w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        },
                        reportPeriods.map(p => React.createElement('option', { key: p.value, value: p.value }, p.label))
                    )
                )
            ),

            selectedItemName && reportData ? (
                React.createElement('div', { className: "space-y-6" },
                    React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-4" },
                        React.createElement(StatCard, { title: `Total Sold (${periodDetails.title})`, value: reportData.totalSold.toLocaleString('en-IN') }),
                        React.createElement(StatCard, { title: `Total Revenue (${periodDetails.title})`, value: `Rs ${reportData.totalRevenue.toLocaleString('en-IN')}` }),
                        React.createElement(StatCard, { title: "Avg. Daily Revenue", value: `Rs ${reportData.avgDailyRevenue.toLocaleString('en-IN', {maximumFractionDigits: 0})}` })
                    ),
                    React.createElement('div', { className: "bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
                        React.createElement('h3', { className: "text-lg font-semibold mb-1" }, "Sales Trend for ", React.createElement('span', { className: "text-blue-600 dark:text-blue-400" }, selectedItemName)),
                        React.createElement('p', { className: "text-sm text-gray-500 dark:text-gray-400 mb-4" }, periodDetails.description),
                        
                        React.createElement('div', { className: "mt-4 h-64 flex items-end gap-2 border-l-2 border-b-2 border-gray-200 dark:border-gray-700 p-2" },
                           reportData.chartData.map((d, i) => (
                                React.createElement('div', { key: i, className: "flex-1 group relative flex flex-col justify-end items-center" },
                                    React.createElement('div', { className: "absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" },
                                        `Rs ${d.value.toLocaleString('en-IN')}`
                                    ),
                                    React.createElement('div',
                                        { style: { height: `${d.percent}%` },
                                        className: "w-full bg-blue-500 hover:bg-blue-400 rounded-t-sm transition-all duration-300" }
                                    )
                                )
                            ))
                        ),
                        React.createElement('div', { className: "flex gap-2 border-l-2 border-gray-200 dark:border-gray-700 pl-2" },
                             reportData.chartData.map((d, i) => (
                                React.createElement('div', { key: i, className: "flex-1 text-xs text-center text-gray-500 dark:text-gray-400 pt-1" },
                                    d.label
                                )
                            ))
                        )
                    )
                )
            ) : (
                React.createElement('div', { className: "text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700" },
                     React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "mx-auto h-12 w-12 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                       React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" })
                     ),
                    React.createElement('h3', { className: "mt-2 text-xl font-medium text-gray-900 dark:text-white" }, "Select an Item to Begin"),
                    React.createElement('p', { className: "mt-1 text-gray-500 dark:text-gray-400" },
                        "Choose an item from the dropdown to see its sales report."
                    )
                )
            )
        )
    );
};


const HisabHistory = ({ hisabs, onSelectHisab, onEditHisab }) => {
    const submittedHisabs = hisabs.filter(h => h.status === 'submitted').sort((a,b) => b.date.localeCompare(a.date));

    return (
        React.createElement('div', { className: "bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
            React.createElement('h2', { className: "text-xl font-bold mb-4" }, "Submitted Hisab History"),
            submittedHisabs.length > 0 ? (
                React.createElement('ul', { className: "divide-y divide-gray-200 dark:divide-gray-700" },
                    submittedHisabs.map(hisab => (
                        React.createElement('li', { key: hisab.date, className: "py-3 flex justify-between items-center" },
                            React.createElement('div', null,
                                React.createElement('p', { className: "font-semibold text-gray-900 dark:text-white" }, hisab.date),
                                React.createElement('p', { className: "text-sm text-gray-500 dark:text-gray-400" },
                                    `Total Sales: Rs ${hisab.stockItems.reduce((total, item) => {
                                        const soldQty = item.openingQty - item.closingQty;
                                        return total + (soldQty * item.rate);
                                    }, 0).toLocaleString()}`
                                )
                            ),
                            React.createElement('div', { className: "flex items-center gap-2" },
                                React.createElement('button', { onClick: () => onEditHisab(hisab.date), className: "px-3 py-1 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors text-sm" },
                                    "Edit"
                                ),
                                React.createElement('button', { onClick: () => onSelectHisab(hisab.date), className: "px-3 py-1 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors text-sm dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500" },
                                    "View"
                                )
                            )
                        )
                    ))
                )
            ) : (
                React.createElement('p', { className: "text-center text-gray-500 dark:text-gray-400 py-8" }, "No hisabs have been submitted yet.")
            )
        )
    );
};

const StockNavTab = ({ label, isActive, onClick }) => (
    React.createElement('button',
        {
            onClick: onClick,
            className: `py-2 px-4 text-lg font-semibold transition-colors ${
                isActive
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`
        },
        label
    )
);

const StockManager = ({ hisabs, hisabAccounts, hisabTransactions, onSubmitHisab, onSaveHisabAccount, onUpdateHisabStatus }) => {
  const [selectedDate, setSelectedDate] = useState(getTodayBSString());
  const [currentHisab, setCurrentHisab] = useState(null);
  const [activeTab, setActiveTab] = useState('entry');
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const createNewHisabForDate = useCallback((date) => {
    const previousDate = getPreviousDateString(date);
    const previousHisab = hisabs.find(h => h.date === previousDate);

    const newStockItems = commonItems.map((item, index) => {
      const prevItem = previousHisab?.stockItems.find(pi => pi.name.trim().toLowerCase() === item.name.trim().toLowerCase());
      return {
        id: `item-${Date.now()}-${index}`,
        name: item.name,
        rate: prevItem ? prevItem.rate : 0,
        openingQty: prevItem ? prevItem.closingQty : 0,
        closingQty: 0,
      };
    });
    
    return {
      date: date,
      status: 'draft',
      stockItems: newStockItems,
      balance: {
        cashTransactions: [],
        creditTransactions: [],
        chequesReceived: 0,
        expenses: 0,
        onlinePayments: 0,
        chequesOnHand: 0,
        cashOnHand: 0,
      },
    };
  }, [hisabs]);

  useEffect(() => {
    setIsHistoryVisible(false);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'entry') {
        const existingHisab = hisabs.find(h => h.date === selectedDate);
        if (existingHisab) {
          setCurrentHisab(JSON.parse(JSON.stringify(existingHisab)));
        } else {
          setCurrentHisab(createNewHisabForDate(selectedDate));
        }
    }
  }, [selectedDate, hisabs, createNewHisabForDate, activeTab]);
  
  const handleStockItemsChange = (updatedItems) => {
    if (currentHisab) {
      setCurrentHisab({ ...currentHisab, stockItems: updatedItems });
    }
  };

  const handleBalanceChange = (updatedBalance) => {
    if (currentHisab) {
      setCurrentHisab({ ...currentHisab, balance: updatedBalance });
    }
  };

  const handleSubmit = () => {
    if (currentHisab) {
        const cleanedHisab = {
            ...currentHisab,
            stockItems: currentHisab.stockItems.filter(item => item.name.trim() !== '')
        };
      onSubmitHisab(cleanedHisab);
      // Automatically advance to the next day
      setSelectedDate(getNextDateString(currentHisab.date));
    }
  };

  const totalSales = useMemo(() => {
    if (!currentHisab) return 0;
    return currentHisab.stockItems.reduce((total, item) => {
        const soldQty = item.openingQty - item.closingQty;
        return total + (soldQty * item.rate);
    }, 0);
  }, [currentHisab]);

  const balanceDifference = useMemo(() => {
    if (!currentHisab) return 1;
    const { balance } = currentHisab;
    const totalCashIn = balance.cashTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalCreditSales = balance.creditTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    const totalLeft = totalSales + totalCashIn + balance.chequesReceived;
    const totalRight = balance.expenses + totalCreditSales + balance.onlinePayments + balance.chequesOnHand + balance.cashOnHand;
    return totalLeft - totalRight;
  }, [currentHisab, totalSales]);

  const handleSelectHisabFromHistory = (date) => {
      setSelectedDate(date);
      setIsHistoryVisible(false);
  };
  
  const handleEditHisabFromHistory = (date) => {
      if (window.confirm('Are you sure you want to edit this submitted hisab? It will be moved back to a draft.')) {
        // Find the hisab to edit from the master list.
        const hisabToEdit = hisabs.find(h => h.date === date);

        if (hisabToEdit) {
            // Create an editable deep copy and immediately set it as the current hisab.
            // This ensures the UI becomes editable instantly.
            const editableHisab = { ...JSON.parse(JSON.stringify(hisabToEdit)), status: 'draft' };
            setCurrentHisab(editableHisab);
        }

        // Update the master list in the parent component.
        onUpdateHisabStatus(date, 'draft');
        
        // Switch the view from history back to the entry form for the selected date.
        setSelectedDate(date);
        setIsHistoryVisible(false);
      }
  };

  const hisabAccountsWithBalance = useMemo(() => {
    return hisabAccounts.map(account => {
        const accountTransactions = hisabTransactions.filter(t => t.accountId === account.id);
        const balance = accountTransactions.reduce((acc, curr) => {
            return curr.type === 'increase' ? acc + curr.amount : acc - curr.amount;
        }, 0);
        return { ...account, balance };
    });
  }, [hisabAccounts, hisabTransactions]);

  const isReadOnly = currentHisab?.status === 'submitted';

  if (!currentHisab && activeTab === 'entry' && !isHistoryVisible) {
    return React.createElement('div', null, "Loading Hisab...");
  }

  return (
    React.createElement('div', { className: "space-y-6" },
       React.createElement('div', { className: "flex border-b border-gray-200 dark:border-gray-700" },
           React.createElement(StockNavTab, { label: "Daily Entry", isActive: activeTab === 'entry', onClick: () => setActiveTab('entry') }),
           React.createElement(StockNavTab, { label: "Sales Reports", isActive: activeTab === 'reports', onClick: () => setActiveTab('reports') }),
           React.createElement(StockNavTab, { label: "Hisab Accounts", isActive: activeTab === 'accounts', onClick: () => setActiveTab('accounts') })
       ),

      activeTab === 'entry' && (
        React.createElement(React.Fragment, null,
            React.createElement('div', { className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
                React.createElement('h1', { className: "text-2xl font-bold" }, "Daily Stock Hisab"),
                React.createElement('div', { className: "flex items-center gap-2 sm:gap-4" },
                React.createElement('input',
                    { type: "text",
                    value: selectedDate,
                    onChange: (e) => setSelectedDate(e.target.value),
                    placeholder: "YYYY-MM-DD",
                    className: "px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-32 sm:w-40",
                    disabled: isHistoryVisible }
                ),
                React.createElement('button', { onClick: () => setIsHistoryVisible(!isHistoryVisible), className: "px-3 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors text-sm dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500" },
                    isHistoryVisible ? 'Go to Entry' : 'View History'
                ),
                !isHistoryVisible && (
                    React.createElement('button', 
                        { onClick: handleSubmit,
                        disabled: balanceDifference !== 0 || isReadOnly,
                        className: "px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm shadow disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600" },
                        isReadOnly ? 'Submitted' : 'Finalize & Submit'
                    )
                )
                )
            ),
            
            !isHistoryVisible && currentHisab && (
                React.createElement(React.Fragment, null,
                    React.createElement(StockTable, 
                        { items: currentHisab.stockItems,
                        onItemsChange: handleStockItemsChange,
                        isReadOnly: isReadOnly }
                    ),
                    React.createElement(CashBalanceSheet,
                        { balanceData: currentHisab.balance,
                        onBalanceChange: handleBalanceChange,
                        totalSales: totalSales,
                        accounts: hisabAccounts,
                        onAddNewCustomer: onSaveHisabAccount,
                        isReadOnly: isReadOnly,
                        balanceDifference: balanceDifference }
                    )
                )
            ),
            isHistoryVisible && (
                React.createElement(HisabHistory, { 
                    hisabs: hisabs, 
                    onSelectHisab: handleSelectHisabFromHistory,
                    onEditHisab: handleEditHisabFromHistory
                })
            )
        )
      ),

      activeTab === 'reports' && (
        React.createElement(SalesReports, { hisabs: hisabs })
      ),

      activeTab === 'accounts' && (
          React.createElement(HisabAccountsLedger,
            { accounts: hisabAccountsWithBalance,
            transactions: hisabTransactions,
            onSaveAccount: onSaveHisabAccount }
          )
      )
    )
  );
};

export default StockManager;