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

            // FIXED WALKTHROUGH FOR THE ERROR
            React.createElement('div', { className: "bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border-2 border-red-100 dark:border-red-900/30" },
                React.createElement('h2', { className: "text-xl font-bold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400" }, 
                    React.createElement('svg', { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
                    "Fix: 'Didn't find Hosting config'"
                ),
                React.createElement('p', { className: "text-sm text-gray-600 dark:text-gray-400 mb-4" }, 
                    "You saw that error because the CLI needs to initialize Hosting first. Follow these exact steps in order:"
                ),
                React.createElement('div', { className: "space-y-4" },
                    React.createElement('div', { className: "p-4 bg-gray-900 text-green-400 rounded-xl font-mono text-sm overflow-x-auto select-all shadow-inner" }, 
                        "firebase init hosting"
                    ),
                    React.createElement('div', { className: "space-y-3 text-sm" },
                        React.createElement('div', { className: "flex gap-2" }, 
                            React.createElement('span', { className: "text-red-500 font-bold" }, "1."),
                            React.createElement('p', null, "Select: ", React.createElement('span', { className: "font-mono text-blue-500" }, "Use an existing project"), " -> ", React.createElement('span', { className: "font-mono text-blue-500" }, "jitpur-kirana"))
                        ),
                        React.createElement('div', { className: "flex gap-2" }, 
                            React.createElement('span', { className: "text-red-500 font-bold" }, "2."),
                            React.createElement('div', null,
                                React.createElement('p', null, "It will ask for public directory. Type: ", React.createElement('span', { className: "font-mono font-bold" }, ".")),
                                React.createElement('p', { className: "text-xs text-gray-400" }, "(Yes, just a single dot/period)")
                            )
                        ),
                        React.createElement('div', { className: "flex gap-2" }, 
                            React.createElement('span', { className: "text-red-500 font-bold" }, "3."),
                            React.createElement('p', null, "Configure as single-page app? Type ", React.createElement('span', { className: "font-bold" }, "y"))
                        ),
                        React.createElement('div', { className: "flex gap-2" }, 
                            React.createElement('span', { className: "text-red-500 font-bold" }, "4."),
                            React.createElement('p', null, "Set up automatic builds with GitHub? Type ", React.createElement('span', { className: "font-bold text-green-500" }, "y"))
                        ),
                        React.createElement('div', { className: "flex gap-2" }, 
                            React.createElement('span', { className: "text-red-500 font-bold" }, "5."),
                            React.createElement('p', null, "It will then give you a link to log into GitHub. Follow that and you are done!")
                        )
                    )
                )
            ),

            // 2. Cloud Status
            React.createElement('div', { className: `p-6 rounded-2xl border-2 shadow-sm transition-all ${syncError ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900' : 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900'}` },
                React.createElement('div', { className: "flex items-center justify-between" },
                    React.createElement('div', null,
                        React.createElement('h2', { className: "text-lg font-bold" }, "Live Sync Engine"),
                        React.createElement('p', { className: "text-sm text-gray-500" }, syncError ? "Disconnected" : "Running Smoothly")
                    ),
                    React.createElement('div', { className: `h-3 w-3 rounded-full ${syncError ? 'bg-red-500' : 'bg-green-500'} animate-pulse` })
                )
            ),

            // 3. Quick Actions
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

            // 4. Footer
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