
import React, { useRef, useState, useEffect } from 'react';
import { getSyncError } from '../services/firebase.js';

const ActionButton = ({ onClick, label, icon, color = 'blue', disabled = false }) => {
    const colors = {
        blue: 'bg-blue-600 hover:bg-blue-700 text-white',
        red: 'bg-red-600 hover:bg-red-700 text-white',
        gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
        green: 'bg-green-600 hover:bg-green-700 text-white',
        amber: 'bg-amber-500 hover:bg-amber-600 text-white',
        indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white'
    };

    return React.createElement('button',
        {
            onClick,
            disabled,
            className: `flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${colors[color]}`
        },
        icon,
        label
    );
};

const Settings = () => {
    const [syncError, setSyncError] = useState(null);

    useEffect(() => {
        const errorInterval = setInterval(() => {
            setSyncError(getSyncError());
        }, 1000);
        return () => clearInterval(errorInterval);
    }, []);

    const handleBackup = () => {
        const DATA_KEYS = [
            'jitpur_kirana_accounts',
            'jitpur_kirana_transactions',
            'jitpur_kirana_cheques',
            'jitpur_kirana_daily_hisabs',
            'jitpur_kirana_hisab_accounts',
            'jitpur_kirana_hisab_transactions'
        ];
        try {
            const backupData = {};
            DATA_KEYS.forEach(key => { backupData[key] = localStorage.getItem(key); });
            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `jitpur_backup_${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
        } catch (error) {
            alert('Backup failed.');
        }
    };

    return (
        React.createElement('div', { className: "max-w-2xl mx-auto pb-24 space-y-8" },
            React.createElement('div', { className: "text-center" },
                React.createElement('h1', { className: "text-4xl font-black text-gray-900 dark:text-white" }, "Settings"),
                React.createElement('p', { className: "text-gray-500 mt-2" }, "Manage your business data and security")
            ),

            React.createElement('div', { className: "bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-6 shadow-sm" },
                React.createElement('h2', { className: "text-lg font-bold mb-4" }, "Data Management"),
                React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                    React.createElement(ActionButton, {
                        label: "Export Backup",
                        color: "indigo",
                        icon: React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" })),
                        onClick: handleBackup
                    }),
                    React.createElement(ActionButton, {
                        label: syncError ? "Sync Error" : "Cloud Sync Active",
                        color: syncError ? "red" : "green",
                        icon: React.createElement('div', { className: `h-3 w-3 rounded-full bg-white ${syncError ? '' : 'animate-pulse'}` }),
                        disabled: true
                    })
                )
            ),

            React.createElement('div', { className: "bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900 rounded-2xl p-6" },
                React.createElement('h2', { className: "text-lg font-bold text-amber-700 dark:text-amber-400 mb-2" }, "Security Note"),
                React.createElement('p', { className: "text-sm text-gray-600 dark:text-gray-400" }, 
                    "To protect your data and stop security emails, please go to the Google Cloud Console and restrict your API Key to only work on 'jitpur-kirana.web.app'."
                )
            ),

            React.createElement('div', { className: "text-center opacity-20 pt-8" },
                React.createElement('p', { className: "text-[10px] font-mono" }, "app_v2.1.2_production")
            )
        )
    );
};

export default Settings;
