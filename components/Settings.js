import React, { useRef, useState, useEffect } from 'react';
import { initFirebase, getSyncError } from '../services/firebase.js';

const ActionButton = ({ onClick, label, icon, color = 'blue', disabled = false }) => {
    const colors = {
        blue: 'bg-blue-600 hover:bg-blue-700 text-white',
        red: 'bg-red-600 hover:bg-red-700 text-white',
        gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
        green: 'bg-green-600 hover:bg-green-700 text-white'
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

    const DATA_KEYS = [
        'jitpur_kirana_accounts',
        'jitpur_kirana_transactions',
        'jitpur_kirana_cheques',
        'jitpur_kirana_daily_hisabs',
        'jitpur_kirana_hisab_accounts',
        'jitpur_kirana_hisab_transactions',
        'data_version'
    ];

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        setDeferredPrompt(null);
    };

    const handleBackup = () => {
        try {
            const backupData = {};
            DATA_KEYS.forEach(key => { backupData[key] = localStorage.getItem(key); });
            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `backup_${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
        } catch (error) {
            alert('Backup failed.');
        }
    };

    const isFirestoreDisabled = syncError && syncError.includes('permission-denied');

    return (
        React.createElement('div', { className: "max-w-xl mx-auto pb-20 space-y-8" },
            React.createElement('div', { className: "text-center" },
                React.createElement('h1', { className: "text-4xl font-black text-gray-900 dark:text-white" }, "Settings"),
                React.createElement('p', { className: "text-gray-500 mt-2" }, "Cloud Sync & GitHub Deployment")
            ),

            // 1. Cloud Status
            React.createElement('div', { className: `p-6 rounded-2xl border-2 shadow-sm transition-all ${syncError ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900' : 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900'}` },
                React.createElement('div', { className: "flex items-center justify-between" },
                    React.createElement('div', null,
                        React.createElement('h2', { className: "text-lg font-bold" }, "Live Sync Status"),
                        React.createElement('p', { className: "text-sm text-gray-500" }, syncError ? "Permission Error" : "Cloud Connected")
                    ),
                    React.createElement('div', { className: `h-3 w-3 rounded-full ${syncError ? 'bg-red-500' : 'bg-green-500'} animate-pulse` })
                ),
                isFirestoreDisabled && React.createElement('div', { className: "mt-4" },
                    React.createElement('p', { className: "text-xs text-red-600 mb-2" }, "You need to update your Security Rules in Firebase."),
                    React.createElement('button', {
                        onClick: () => window.open("https://console.firebase.google.com/project/jitpur-kirana/firestore/rules", "_blank"),
                        className: "text-xs font-bold text-blue-600 underline"
                    }, "Open Security Rules Tab")
                )
            ),

            // 2. GitHub Deployment Guide (No terminal version)
            React.createElement('div', { className: "bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700" },
                React.createElement('h2', { className: "text-xl font-bold mb-4 flex items-center gap-2" }, 
                    React.createElement('svg', { className: "h-6 w-6 text-gray-900 dark:text-white", fill: "currentColor", viewBox: "0 0 24 24" }, React.createElement('path', { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" })),
                    "GitHub Auto-Deploy"
                ),
                React.createElement('p', { className: "text-sm text-gray-500 mb-6" }, 
                    "Since you are using GitHub, you can make your app live without a terminal:"
                ),
                React.createElement('div', { className: "space-y-6" },
                    React.createElement('div', { className: "flex gap-4" },
                        React.createElement('div', { className: "h-8 w-8 shrink-0 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-bold" }, "1"),
                        React.createElement('div', null,
                            React.createElement('p', { className: "font-bold" }, "Connect Firebase to GitHub"),
                            React.createElement('p', { className: "text-xs text-gray-500 mt-1" }, "Go to Firebase Console > Hosting > Set up GitHub Action. Log in and select your repo.")
                        )
                    ),
                    React.createElement('div', { className: "flex gap-4" },
                        React.createElement('div', { className: "h-8 w-8 shrink-0 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-bold" }, "2"),
                        React.createElement('div', null,
                            React.createElement('p', { className: "font-bold" }, "Commit to GitHub"),
                            React.createElement('p', { className: "text-xs text-gray-500 mt-1" }, "Every time you save your code in GitHub, Firebase will automatically update your live website.")
                        )
                    )
                ),
                React.createElement('div', { className: "mt-6 pt-6 border-t dark:border-gray-700" },
                    React.createElement('a', { 
                        href: "https://console.firebase.google.com/project/jitpur-kirana/hosting", 
                        target: "_blank",
                        className: "block text-center py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                    }, "Open Firebase Hosting Setup")
                )
            ),

            // 3. Quick Actions
            React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                deferredPrompt && React.createElement(ActionButton, {
                    label: "Install as Mobile App",
                    color: "green",
                    icon: React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" })),
                    onClick: handleInstallClick
                }),
                React.createElement(ActionButton, {
                    label: "Manual Data Backup",
                    color: "gray",
                    icon: React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" })),
                    onClick: handleBackup
                })
            ),

            // 4. Footer
            React.createElement('div', { className: "p-4 text-center" },
                React.createElement('p', { className: "text-xs text-gray-400 mb-2" }, "Target URL:"),
                React.createElement('a', { 
                    href: "https://jitpur-kirana.web.app", 
                    target: "_blank",
                    className: "text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                }, "jitpur-kirana.web.app")
            )
        )
    );
};

export default Settings;