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

    const forceRefresh = async () => {
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let registration of registrations) {
                await registration.unregister();
            }
        }
        const cacheNames = await caches.keys();
        for (let name of cacheNames) {
            await caches.delete(name);
        }
        window.location.reload(true);
    };

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
                React.createElement('p', { className: "text-gray-500 mt-2" }, "Security & Maintenance")
            ),

            // EMERGENCY CACHE BUSTER
            React.createElement('div', { className: "bg-red-600 text-white p-6 rounded-2xl shadow-xl border-b-4 border-red-800" },
                React.createElement('h2', { className: "text-xl font-bold flex items-center gap-2 mb-2" }, 
                    React.createElement('svg', { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" })),
                    "Force App Update"
                ),
                React.createElement('p', { className: "text-sm opacity-90 mb-4" }, 
                    "If you still see the Firebase 'Welcome' page, this will clear all local memory and force the app to reload from the cloud."
                ),
                React.createElement('button', { 
                    onClick: forceRefresh,
                    className: "w-full bg-white text-red-600 py-3 rounded-xl font-bold shadow-md hover:bg-gray-100 transition-all active:scale-95" 
                }, "Reset & Force Reload")
            ),

            // SECURITY LOCKDOWN (API KEY)
            React.createElement('div', { className: "bg-white dark:bg-gray-800 border-2 border-amber-500 rounded-2xl p-6 shadow-sm overflow-hidden relative" },
                React.createElement('div', { className: "absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest" }, "Security Alert"),
                React.createElement('h2', { className: "text-lg font-bold text-amber-600 mb-2 flex items-center gap-2" }, 
                    React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" })),
                    "API Key Protection"
                ),
                React.createElement('p', { className: "text-sm text-gray-600 dark:text-gray-400 mb-4" }, 
                    "To stop security emails, restrict your key to the domain below in Google Cloud Console."
                ),
                React.createElement('div', { className: "bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl text-sm border border-gray-100 dark:border-gray-700" },
                    React.createElement('div', { className: "mt-2 flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border font-mono text-xs" },
                        "jitpur-kirana.web.app/*",
                        React.createElement('button', { 
                            onClick: () => { navigator.clipboard.writeText('jitpur-kirana.web.app/*'); alert('Copied!'); },
                            className: "text-blue-600 font-bold uppercase text-[10px]" 
                        }, "Copy")
                    )
                )
            ),

            // SYSTEM UTILITIES
            React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                React.createElement(ActionButton, {
                    label: "Download Backup",
                    color: "indigo",
                    icon: React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" })),
                    onClick: handleBackup
                }),
                React.createElement(ActionButton, {
                    label: syncError ? "Sync Error" : "Cloud Active",
                    color: syncError ? "red" : "gray",
                    icon: React.createElement('div', { className: `h-3 w-3 rounded-full ${syncError ? 'bg-red-500' : 'bg-green-500'} animate-pulse` }),
                    disabled: true
                })
            )
        )
    );
};

export default Settings;