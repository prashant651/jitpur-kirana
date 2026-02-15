import React, { useRef, useState, useEffect } from 'react';
import { getSyncError } from '../services/firebase.js';

const ActionButton = ({ onClick, label, icon, color = 'blue', disabled = false }) => {
    const colors = {
        blue: 'bg-blue-600 hover:bg-blue-700 text-white',
        red: 'bg-red-600 hover:bg-red-700 text-white',
        gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
        green: 'bg-green-600 hover:bg-green-700 text-white',
        indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        amber: 'bg-amber-500 hover:bg-amber-600 text-white'
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
                React.createElement('h1', { className: "text-4xl font-black text-gray-900 dark:text-white" }, "Settings"),
                React.createElement('p', { className: "text-gray-500 mt-2" }, "System Health & Security Control")
            ),

            // SECTION 1: RESOLVING THE "WELCOME PAGE"
            React.createElement('div', { className: "bg-indigo-600 text-white p-6 rounded-2xl shadow-xl border-b-4 border-indigo-800" },
                React.createElement('div', { className: "flex items-center gap-3 mb-4" },
                    React.createElement('div', { className: "bg-white/20 p-2 rounded-lg" },
                        React.createElement('svg', { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }))
                    ),
                    React.createElement('h2', { className: "text-xl font-bold" }, "Replace the 'Welcome' Page")
                ),
                React.createElement('p', { className: "text-sm mb-4 opacity-90" }, 
                    "You see the placeholder page because you need to run the final deploy command. In your terminal, type:"
                ),
                React.createElement('div', { className: "bg-black/30 p-4 rounded-xl font-mono text-sm border border-white/20 mb-4 flex justify-between items-center" },
                    React.createElement('code', null, "firebase deploy"),
                    React.createElement('button', { 
                        onClick: () => { navigator.clipboard.writeText('firebase deploy'); alert('Command copied!'); },
                        className: "text-[10px] bg-white/20 px-2 py-1 rounded uppercase font-bold hover:bg-white/40" 
                    }, "Copy")
                ),
                React.createElement('p', { className: "text-xs text-indigo-200" }, 
                    "Tip: If it asks for a project, choose 'jitpur-kirana'. If it asks for a directory, ensure it is the root '.'"
                )
            ),

            // SECTION 2: RESOLVING THE GITHUB SECURITY EMAIL
            React.createElement('div', { className: "bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-500 rounded-2xl p-6 shadow-lg" },
                React.createElement('div', { className: "flex items-start gap-4" },
                    React.createElement('div', { className: "bg-amber-500 p-2 rounded-lg text-white" },
                        React.createElement('svg', { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }))
                    ),
                    React.createElement('div', { className: "flex-1" },
                        React.createElement('h2', { className: "text-xl font-bold text-amber-700 dark:text-amber-400 mb-2" }, "Fix GitHub Security Alert"),
                        React.createElement('p', { className: "text-sm text-amber-800 dark:text-amber-300 mb-4" }, 
                            "The email you received is a standard warning. To resolve it permanently:"
                        ),
                        React.createElement('div', { className: "bg-white dark:bg-gray-900 p-4 rounded-xl space-y-3 text-sm border border-amber-200 dark:border-amber-800" },
                            React.createElement('ol', { className: "list-decimal ml-4 space-y-2 text-gray-700 dark:text-gray-300" },
                                React.createElement('li', null, React.createElement('a', { href: "https://console.cloud.google.com/apis/credentials", target: "_blank", className: "text-blue-600 underline font-bold" }, "Click here to open Google Credentials")),
                                React.createElement('li', null, "Find 'API Key 1' (starts with AIzaSyAO)."),
                                React.createElement('li', null, "Change 'Key restrictions' to 'Website'."),
                                React.createElement('li', null, "Add: ", React.createElement('span', { className: "font-mono font-bold bg-gray-100 dark:bg-gray-800 px-1" }, "jitpur-kirana.web.app/*")),
                                React.createElement('li', null, "Save. This 'locks' the key so only your app can use it.")
                            )
                        )
                    )
                )
            ),

            // CLOUD ENGINE STATUS
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
                    label: "Install as Mobile App",
                    color: "green",
                    icon: React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" })),
                    onClick: handleInstallClick
                }),
                React.createElement(ActionButton, {
                    label: "Download Full Database",
                    color: "gray",
                    icon: React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" })),
                    onClick: handleBackup
                })
            ),

            // FOOTER INFO
            React.createElement('div', { className: "text-center space-y-2 opacity-50 pt-8" },
                React.createElement('p', { className: "text-xs" }, "Instance ID: jitpur-kirana-v1.0.4"),
                React.createElement('p', { className: "text-[10px] font-mono" }, "firebase.google.com/docs/hosting")
            )
        )
    );
};

export default Settings;