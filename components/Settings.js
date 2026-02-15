import React, { useRef, useState, useEffect } from 'react';
import { getSyncError } from '../services/firebase.js';

const ActionButton = ({ onClick, label, icon, color = 'blue', disabled = false }) => {
    const colors = {
        blue: 'bg-blue-600 hover:bg-blue-700 text-white',
        red: 'bg-red-600 hover:bg-red-700 text-white',
        gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
        green: 'bg-green-600 hover:bg-green-700 text-white',
        orange: 'bg-orange-600 hover:bg-orange-700 text-white'
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

    return (
        React.createElement('div', { className: "max-w-2xl mx-auto pb-24 space-y-8" },
            React.createElement('div', { className: "text-center" },
                React.createElement('h1', { className: "text-4xl font-black text-gray-900 dark:text-white" }, "System Admin"),
                React.createElement('p', { className: "text-gray-500 mt-2" }, "Terminal Commands & Deployment")
            ),

            // URGENT TERMINAL FIX
            React.createElement('div', { className: "bg-orange-600 text-white p-6 rounded-2xl shadow-xl border-2 border-orange-400" },
                React.createElement('h2', { className: "text-xl font-bold mb-4 flex items-center gap-2" }, 
                    React.createElement('svg', { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" })),
                    "Terminal: Force Update"
                ),
                React.createElement('p', { className: "text-sm mb-4 opacity-90" }, 
                    "To fix the 'Welcome' page and bypass the 'Invalid Value' error, follow these exact steps in your terminal:"
                ),
                React.createElement('div', { className: "space-y-4" },
                    React.createElement('div', { className: "flex gap-3" }, 
                        React.createElement('div', { className: "flex-shrink-0 w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold" }, "1"),
                        React.createElement('div', { className: "flex-1" },
                             React.createElement('p', { className: "text-sm mb-1 font-bold" }, "Stop current command"),
                             React.createElement('p', { className: "text-xs opacity-80" }, "Press Ctrl + C to stop the stuck GitHub setup.")
                        )
                    ),
                    React.createElement('div', { className: "flex gap-3" }, 
                        React.createElement('div', { className: "flex-shrink-0 w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold" }, "2"),
                        React.createElement('div', { className: "flex-1" },
                             React.createElement('p', { className: "text-sm mb-1 font-bold" }, "Run Deployment"),
                             React.createElement('div', { className: "p-3 bg-black/30 rounded-lg font-mono text-sm border border-white/10" }, "firebase deploy")
                        )
                    ),
                    React.createElement('div', { className: "flex gap-3" }, 
                        React.createElement('div', { className: "flex-shrink-0 w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold" }, "3"),
                        React.createElement('div', { className: "flex-1" },
                             React.createElement('p', { className: "text-sm font-bold" }, "Refresh Browser"),
                             React.createElement('p', { className: "text-xs opacity-80" }, "Once it says 'Deploy complete!', refresh jitpur-kirana.web.app")
                        )
                    )
                )
            ),

            // SECURITY ALERTS
            React.createElement('div', { className: "bg-red-50 dark:bg-red-900/10 border-2 border-red-500 rounded-2xl p-6 shadow-sm" },
                React.createElement('h2', { className: "text-lg font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2" }, 
                    React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })),
                    "Fix GitHub Security Alert"
                ),
                React.createElement('p', { className: "text-sm text-gray-700 dark:text-gray-300 mb-4" }, 
                    "Google sent an email because the API key is in the code. To stop the emails and secure the data:"
                ),
                React.createElement('div', { className: "bg-white dark:bg-gray-900 p-4 rounded-xl text-sm space-y-2 border border-red-200 dark:border-red-900" },
                    React.createElement('p', null, "1. Go to ", React.createElement('a', { href: "https://console.cloud.google.com/apis/credentials", target: "_blank", className: "text-blue-600 font-bold underline" }, "Google Cloud Credentials")),
                    React.createElement('p', null, "2. Edit the API Key (starts with AIzaSyAO)."),
                    React.createElement('p', null, "3. Set restriction to 'Website'."),
                    React.createElement('p', null, "4. Add: ", React.createElement('code', { className: "bg-gray-100 dark:bg-gray-800 px-1 rounded" }, "jitpur-kirana.web.app/*")),
                    React.createElement('p', null, "5. Click Save. This 'locks' the key to your site.")
                )
            ),

            // CLOUD STATUS
            React.createElement('div', { className: `p-6 rounded-2xl border-2 shadow-sm transition-all ${syncError ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900' : 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900'}` },
                React.createElement('div', { className: "flex items-center justify-between" },
                    React.createElement('div', null,
                        React.createElement('h2', { className: "text-lg font-bold" }, "Live Sync Engine"),
                        React.createElement('p', { className: "text-sm text-gray-500" }, syncError ? "Connection Error" : "Synchronized with Firebase")
                    ),
                    React.createElement('div', { className: `h-3 w-3 rounded-full ${syncError ? 'bg-red-500' : 'bg-green-500'} animate-pulse` })
                )
            ),

            // SYSTEM ACTIONS
            React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                deferredPrompt && React.createElement(ActionButton, {
                    label: "Install Mobile App",
                    color: "green",
                    icon: React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" })),
                    onClick: handleInstallClick
                }),
                React.createElement(ActionButton, {
                    label: "Download Database",
                    color: "gray",
                    icon: React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" })),
                    onClick: handleBackup
                })
            )
        )
    );
};

export default Settings;