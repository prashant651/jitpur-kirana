import React, { useRef, useState, useEffect } from 'react';
import { initFirebase, getSyncError } from '../services/firebase.js';

const ActionButton = ({ onClick, label, icon, color = 'blue', disabled = false }) => {
    const colors = {
        blue: 'bg-blue-600 hover:bg-blue-700 text-white',
        red: 'bg-red-600 hover:bg-red-700 text-white',
        gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
        green: 'bg-green-600 hover:bg-green-700 text-white',
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
                React.createElement('p', { className: "text-gray-500 mt-2" }, "Deployment Control Center")
            ),

            // LIVE NOW: MANUAL DEPLOY
            React.createElement('div', { className: "bg-indigo-600 text-white p-6 rounded-2xl shadow-xl border-b-4 border-indigo-800" },
                React.createElement('div', { className: "flex items-center gap-3 mb-4" },
                    React.createElement('div', { className: "bg-white/20 p-2 rounded-lg" },
                        React.createElement('svg', { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 11l7-7 7 7M5 19l7-7 7 7" }))
                    ),
                    React.createElement('h2', { className: "text-xl font-bold" }, "Go Live Immediately")
                ),
                React.createElement('p', { className: "text-sm mb-4 opacity-90" }, 
                    "Don't wait for GitHub! Run this single command to put your app on the internet right now:"
                ),
                React.createElement('div', { className: "bg-black/30 p-4 rounded-xl font-mono text-sm border border-white/20 mb-4 flex justify-between items-center" },
                    React.createElement('code', null, "firebase deploy"),
                    React.createElement('span', { className: "text-[10px] bg-white/20 px-2 py-1 rounded uppercase font-bold" }, "Copy to terminal")
                ),
                React.createElement('p', { className: "text-xs text-indigo-200" }, 
                    "After this command finishes, visit jitpur-kirana.web.app"
                )
            ),

            // FIXING GITHUB "INVALID VALUE"
            React.createElement('div', { className: "bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700" },
                React.createElement('h2', { className: "text-lg font-bold mb-4 text-red-600 flex items-center gap-2" }, 
                    React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })),
                    "Troubleshoot: 'Invalid Value' Error"
                ),
                React.createElement('div', { className: "space-y-4" },
                    React.createElement('div', { className: "flex gap-4" },
                        React.createElement('div', { className: "w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 font-bold" }, "1"),
                        React.createElement('div', null,
                            React.createElement('p', { className: "text-sm font-bold" }, "Refresh Firebase Login"),
                            React.createElement('p', { className: "text-xs text-gray-500" }, "Run: ", React.createElement('code', { className: "bg-gray-100 dark:bg-gray-900 px-1 rounded" }, "firebase login --reauth"))
                        )
                    ),
                    React.createElement('div', { className: "flex gap-4" },
                        React.createElement('div', { className: "w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 font-bold" }, "2"),
                        React.createElement('div', null,
                            React.createElement('p', { className: "text-sm font-bold" }, "Enter Repo manually"),
                            React.createElement('p', { className: "text-xs text-gray-500 mb-2" }, "Type this exactly (no spaces):"),
                            React.createElement('div', { className: "p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-mono text-sm rounded border border-blue-100 dark:border-blue-900/50" }, 
                                "prashant651/jitpur-kirana"
                            )
                        )
                    ),
                    React.createElement('div', { className: "flex gap-4" },
                        React.createElement('div', { className: "w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 font-bold" }, "3"),
                        React.createElement('div', null,
                            React.createElement('p', { className: "text-sm font-bold" }, "Last Resort"),
                            React.createElement('p', { className: "text-xs text-gray-500" }, "Say NO to 'Set up automatic builds' during init. Just use manual deploy for now.")
                        )
                    )
                )
            ),

            // DATA SYNC STATUS
            React.createElement('div', { className: `p-6 rounded-2xl border-2 shadow-sm transition-all ${syncError ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900' : 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900'}` },
                React.createElement('div', { className: "flex items-center justify-between" },
                    React.createElement('div', null,
                        React.createElement('h2', { className: "text-lg font-bold" }, "Live Sync Engine"),
                        React.createElement('p', { className: "text-sm text-gray-500" }, syncError ? "Disconnected" : "Running Smoothly")
                    ),
                    React.createElement('div', { className: `h-3 w-3 rounded-full ${syncError ? 'bg-red-500' : 'bg-green-500'} animate-pulse` })
                )
            ),

            // Quick Actions
            React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                deferredPrompt && React.createElement(ActionButton, {
                    label: "Install App (PWA)",
                    color: "green",
                    icon: React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" })),
                    onClick: handleInstallClick
                }),
                React.createElement(ActionButton, {
                    label: "Local Backup (JSON)",
                    color: "gray",
                    icon: React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" })),
                    onClick: handleBackup
                })
            ),

            // Footer
            React.createElement('div', { className: "text-center space-y-2 pt-8" },
                React.createElement('p', { className: "text-xs text-gray-400" }, "Project ID: jitpur-kirana"),
                React.createElement('a', { 
                    href: "https://jitpur-kirana.web.app", 
                    target: "_blank",
                    className: "inline-block text-sm font-bold text-blue-600 hover:underline"
                }, "Open live website")
            )
        )
    );
};

export default Settings;