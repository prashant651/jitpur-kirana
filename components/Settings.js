import React, { useRef } from 'react';

const SettingsCard = ({ title, description, children }) => (
    React.createElement('div', { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
        React.createElement('h2', { className: "text-xl font-bold text-gray-900 dark:text-white" }, title),
        React.createElement('p', { className: "mt-1 text-gray-500 dark:text-gray-400" }, description),
        React.createElement('div', { className: "mt-6" }, children)
    )
);

const Settings = () => {
    const fileInputRef = useRef(null);
    const DATA_KEYS = [
        'jitpur_kirana_accounts',
        'jitpur_kirana_transactions',
        'jitpur_kirana_cheques',
        'jitpur_kirana_daily_hisabs',
        'jitpur_kirana_hisab_accounts',
        'jitpur_kirana_hisab_transactions',
        'data_version'
    ];

    const handleBackup = () => {
        try {
            const backupData = {};
            DATA_KEYS.forEach(key => {
                backupData[key] = localStorage.getItem(key);
            });

            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const today = new Date().toISOString().slice(0, 10);
            link.href = url;
            link.download = `jitpur_kirana_backup_${today}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            alert('Backup downloaded successfully!');
        } catch (error) {
            console.error("Backup failed:", error);
            alert('An error occurred during backup. Please check the console.');
        }
    };

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text !== 'string') {
                alert('Could not read file.');
                return;
            }

            if (!window.confirm('Are you sure you want to restore? This will overwrite all current data in the app. This action cannot be undone.')) {
                 if(fileInputRef.current) fileInputRef.current.value = "";
                return;
            }

            try {
                const restoredData = JSON.parse(text);
                
                if (!restoredData || typeof restoredData.jitpur_kirana_accounts === 'undefined') {
                    throw new Error('Invalid or corrupted backup file. Missing essential data.');
                }

                DATA_KEYS.forEach(key => localStorage.removeItem(key));
                
                Object.keys(restoredData).forEach(key => {
                    if (DATA_KEYS.includes(key) && restoredData[key] !== null) {
                        localStorage.setItem(key, restoredData[key]);
                    }
                });

                alert('Data restored successfully! The application will now reload.');
                window.location.reload();

            } catch (error) {
                console.error("Restore failed:", error);
                alert(`Restore failed. The backup file might be invalid or corrupted. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
                if(fileInputRef.current) fileInputRef.current.value = "";
            }
        };

        reader.readAsText(file);
    };

    return (
        React.createElement('div', null,
            React.createElement('h1', { className: "text-3xl font-bold mb-6" }, "Settings"),
            React.createElement('div', { className: "space-y-6 max-w-2xl mx-auto" },
                React.createElement(SettingsCard,
                    { title: "Data Backup",
                    description: "Download all your application data (accounts, transactions, cheques, etc.) into a single JSON file. Keep this file in a safe place." },
                    React.createElement('button',
                        {
                            onClick: handleBackup,
                            className: "w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow flex items-center justify-center gap-2"
                        },
                        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z", clipRule: "evenodd" })),
                        "Backup All Data"
                    )
                ),
                
                React.createElement(SettingsCard,
                    { title: "Data Restore",
                    description: "Restore your data from a previously downloaded backup file. WARNING: This will permanently overwrite all existing data in the application." },
                     React.createElement('input',
                        {
                            type: "file",
                            ref: fileInputRef,
                            onChange: handleFileChange,
                            accept: ".json",
                            className: "hidden"
                        }
                    ),
                    React.createElement('button',
                        {
                            onClick: handleRestoreClick,
                            className: "w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow flex items-center justify-center gap-2"
                        },
                       React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z", clipRule: "evenodd" })),
                        "Restore from Backup"
                    )
                )
            )
        )
    );
};

export default Settings;
