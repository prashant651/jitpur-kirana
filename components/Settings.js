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

    return (
        React.createElement('div', { className: "max-w-2xl mx-auto pb-24 space-y-8" },
            React.createElement('div', { className: "text-center" },
                React.createElement('h1', { className: "text-4xl font-black text-gray-900 dark:text-white" }, "Settings"),
                React.createElement('p', { className: "text-gray-500 mt-2" }, "Deployment & Cloud Sync")
            ),

            // BRUTE FORCE MANUAL FIX
            React.createElement('div', { className: "bg-orange-600 text-white p-6 rounded-2xl shadow-lg border-2 border-orange-400" },
                React.createElement('h2', { className: "text-xl font-bold mb-4 flex items-center gap-2" }, 
                    React.createElement('svg', { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" })),
                    "Brute Force: Terminal Fix"
                ),
                React.createElement('p', { className: "text-sm mb-4 opacity-90" }, 
                    "If 'Invalid Value' persists, follow these exact steps to reset the CLI state:"
                ),
                React.createElement('div', { className: "space-y-4" },
                    React.createElement('div', { className: "flex gap-3" }, 
                        React.createElement('div', { className: "flex-shrink-0 w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold" }, "1"),
                        React.createElement('div', { className: "flex-1" },
                             React.createElement('p', { className: "text-sm mb-1" }, "Press ", React.createElement('span', { className: "font-mono bg-black/30 px-1 rounded" }, "Ctrl + C"), " to stop the current stuck command.")
                        )
                    ),
                    React.createElement('div', { className: "flex gap-3" }, 
                        React.createElement('div', { className: "flex-shrink-0 w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold" }, "2"),
                        React.createElement('div', { className: "flex-1" },
                             React.createElement('p', { className: "text-sm mb-2 font-bold" }, "Re-authenticate Firebase:"),
                             React.createElement('div', { className: "p-3 bg-black/30 rounded-lg font-mono text-xs border border-white/20" }, "firebase login --reauth")
                        )
                    ),
                    React.createElement('div', { className: "flex gap-3" }, 
                        React.createElement('div', { className: "flex-shrink-0 w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold" }, "3"),
                        React.createElement('div', { className: "flex-1" },
                             React.createElement('p', { className: "text-sm mb-2 font-bold" }, "Reset Git Connection:"),
                             React.createElement('div', { className: "p-3 bg-black/30 rounded-lg font-mono text-xs border border-white/20" }, "git remote set-url origin https://github.com/prashant651/jitpur-kirana.git")
                        )
                    ),
                    React.createElement('div', { className: "flex gap-3" }, 
                        React.createElement('div', { className: "flex-shrink-0 w-6 h-6 rounded-full bg-white text-orange-600 flex items-center justify-center text-xs font-bold" }, "4"),
                        React.createElement('p', { className: "text-sm font-bold" }, "Try 'firebase init hosting' again and use prashant651/jitpur-kirana")
                    ),
                    React.createElement('div', { className: "mt-4 p-4 bg-orange-700/50 rounded-xl border border-orange-400/30" },
                        React.createElement('p', { className: "text-xs italic" }, "Pro Tip: If GitHub Actions still fail, just say 'No' to that specific question and run 'firebase deploy' manually to go live!")
                    )
                )
            ),

            // Cloud Status
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
                    label: "Add to Home Screen",
                    color: "green",
                    icon: React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" })),
                    onClick: handleInstallClick
                }),
                React.createElement(ActionButton, {
                    label: "Download All Data",
                    color: "gray",
                    icon: React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" })),
                    onClick: handleBackup
                })
            ),

            // Footer
            React.createElement('div', { className: "text-center space-y-2" },
                React.createElement('p', { className: "text-xs text-gray-400" }, "Project ID: jitpur-kirana"),
                React.createElement('a', { 
                    href: "https://jitpur-kirana.web.app", 
                    target: "_blank",
                    className: "inline-block text-sm font-bold text-blue-600 hover:underline"
                }, "jitpur-kirana.web.app")
            )
        )
    );
};

export default Settings;