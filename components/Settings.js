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
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [syncError, setSyncError] = useState(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        const errorInterval = setInterval(() => {
            setSyncError(getSyncError());
        }, 1000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            clearInterval(errorInterval);
        };
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
                React.createElement('h1', { className: "text-4xl font-black text-gray-900 dark:text-white" }, "Admin Center"),
                React.createElement('p', { className: "text-gray-500 mt-2" }, "Troubleshooting & Security")
            ),

            // TROUBLESHOOTING GHOST PAGE
            React.createElement('div', { className: "bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-500 rounded-2xl p-6 shadow-sm" },
                React.createElement('h2', { className: "text-lg font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2" }, 
                    React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
                    "Seeing the 'Welcome' placeholder?"
                ),
                React.createElement('p', { className: "text-sm text-gray-600 dark:text-gray-400 mb-4" }, 
                    "If your site still shows the 'Firebase Hosting Setup Complete' screen, your browser is showing a cached version. Try these steps:"
                ),
                React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" },
                    React.createElement('div', { className: "bg-white dark:bg-gray-800 p-3 rounded-xl border dark:border-gray-700 text-xs" },
                        React.createElement('p', { className: "font-bold mb-1" }, "On Windows/Linux:"),
                        React.createElement('p', null, "Press ", React.createElement('kbd', { className: "px-1 bg-gray-100 rounded border" }, "Ctrl"), " + ", React.createElement('kbd', { className: "px-1 bg-gray-100 rounded border" }, "F5"))
                    ),
                    React.createElement('div', { className: "bg-white dark:bg-gray-800 p-3 rounded-xl border dark:border-gray-700 text-xs" },
                        React.createElement('p', { className: "font-bold mb-1" }, "On Mac:"),
                        React.createElement('p', null, "Press ", React.createElement('kbd', { className: "px-1 bg-gray-100 rounded border" }, "Cmd"), " + ", React.createElement('kbd', { className: "px-1 bg-gray-100 rounded border" }, "Shift"), " + ", React.createElement('kbd', { className: "px-1 bg-gray-100 rounded border" }, "R"))
                    )
                )
            ),

            // GITHUB CLARIFICATION
            React.createElement('div', { className: "bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-900 rounded-2xl p-6" },
                React.createElement('h2', { className: "text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2" }, 
                    React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" })),
                    "GitHub is Optional"
                ),
                React.createElement('p', { className: "text-sm text-gray-600 dark:text-gray-400" }, 
                    "You do not need GitHub to run your business. Manual deployment via ", 
                    React.createElement('code', { className: "bg-gray-100 dark:bg-gray-800 px-1 rounded" }, "firebase deploy"), 
                    " is the easiest and most reliable way to update."
                )
            ),

            // SECURITY LOCKDOWN (API KEY)
            React.createElement('div', { className: "bg-white dark:bg-gray-800 border-2 border-red-500 rounded-2xl p-6 shadow-sm overflow-hidden relative" },
                React.createElement('div', { className: "absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest" }, "Urgent Action"),
                React.createElement('h2', { className: "text-lg font-bold text-red-600 mb-2 flex items-center gap-2" }, 
                    React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" })),
                    "Stop Security Warning Emails"
                ),
                React.createElement('p', { className: "text-sm text-gray-600 dark:text-gray-400 mb-4" }, 
                    "GitHub/Google will send alerts because the API key is in the code. To secure it:"
                ),
                React.createElement('div', { className: "space-y-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl text-sm border border-gray-100 dark:border-gray-700" },
                    React.createElement('p', null, "1. Open ", React.createElement('a', { href: "https://console.cloud.google.com/apis/credentials", target: "_blank", className: "text-blue-600 font-bold underline" }, "Google Cloud Credentials")),
                    React.createElement('p', null, "2. Click API Key starting with ", React.createElement('span', { className: "font-mono font-bold" }, "AIzaSyAO...")),
                    React.createElement('p', null, "3. Set restriction to ", React.createElement('b', null, "'Websites'"), " and add ", React.createElement('code', { className: "bg-white dark:bg-gray-800 px-1" }, "jitpur-kirana.web.app/*"))
                )
            ),

            // SYSTEM UTILITIES
            React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                React.createElement(ActionButton, {
                    label: "Download Data Backup",
                    color: "indigo",
                    icon: React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" })),
                    onClick: handleBackup
                }),
                React.createElement(ActionButton, {
                    label: syncError ? "Sync Error" : "Cloud Active",
                    color: syncError ? "red" : "green",
                    icon: React.createElement('div', { className: `h-3 w-3 rounded-full ${syncError ? 'bg-white' : 'bg-white'} animate-pulse` }),
                    disabled: true
                })
            ),

            React.createElement('div', { className: "text-center opacity-30 pt-8" },
                React.createElement('p', { className: "text-[10px] font-mono" }, "build_id: 2024-05-29-rev2")
            )
        )
    );
};

export default Settings;