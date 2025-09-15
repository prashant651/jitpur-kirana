import React, { useState, useMemo } from 'react';
import { getBSMonthData, bsMonthNames, DEMO_TODAY, getTodayBSString } from '../services/bs-date-utils.js';

const AgendaChequeItem = ({ cheque }) => {
    const amountColor = cheque.type === 'payable' ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500';
    return (
        React.createElement('div', { className: "p-3 rounded-md bg-gray-50 dark:bg-gray-700/50 border-l-4 border-gray-300 dark:border-gray-600" },
            React.createElement('p', { className: "font-bold text-gray-900 dark:text-white" }, cheque.partyName),
            React.createElement('p', { className: `text-lg font-semibold ${amountColor}` }, `Rs ${cheque.amount.toLocaleString()}`),
            React.createElement('div', { className: "text-xs text-gray-500 dark:text-gray-400 mt-1" },
                React.createElement('span', null, cheque.bankName),
                React.createElement('span', { className: "mx-1" }, "|"),
                React.createElement('span', null, `#${cheque.chequeNumber}`)
            )
        )
    );
};

const CalendarView = ({ cheques }) => {
    const [currentBSYear, setCurrentBSYear] = useState(DEMO_TODAY.year);
    const [currentBSMonth, setCurrentBSMonth] = useState(DEMO_TODAY.month);
    const [selectedDate, setSelectedDate] = useState(DEMO_TODAY);

    const { daysInMonth, startDayOfWeek } = useMemo(() => getBSMonthData(currentBSYear, currentBSMonth), [currentBSYear, currentBSMonth]);

    const eventsByDate = useMemo(() => {
        const events = new Map();
        cheques.forEach(cheque => {
            if (cheque.date) {
                if (!events.has(cheque.date)) events.set(cheque.date, { chequeDate: [], reminderDate: [] });
                events.get(cheque.date).chequeDate.push(cheque);
            }
            if (cheque.reminderDate) {
                 if (!events.has(cheque.reminderDate)) events.set(cheque.reminderDate, { chequeDate: [], reminderDate: [] });
                 events.get(cheque.reminderDate).reminderDate.push(cheque);
            }
        });
        return events;
    }, [cheques]);

    const selectedDateEvents = useMemo(() => {
        if (!selectedDate) return null;
        const dateString = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
        const events = eventsByDate.get(dateString);
        if (!events) return null;

        const payableDue = events.chequeDate.filter(c => c.type === 'payable');
        const receivableDue = events.chequeDate.filter(c => c.type === 'receivable');
        const reminders = events.reminderDate;

        if (payableDue.length === 0 && receivableDue.length === 0 && reminders.length === 0) return null;
        return { payableDue, receivableDue, reminders };
    }, [selectedDate, eventsByDate]);

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startDayOfWeek }, (_, i) => i);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const changeMonth = (offset) => {
        let newMonth = currentBSMonth + offset;
        let newYear = currentBSYear;
        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }
        setCurrentBSMonth(newMonth);
        setCurrentBSYear(newYear);
        setSelectedDate(null);
    };

    const handleDayClick = (day) => {
        setSelectedDate({ year: currentBSYear, month: currentBSMonth, day });
    };

    const todayString = getTodayBSString();

    return (
        React.createElement('div', { className: "flex flex-col lg:flex-row gap-6" },
            React.createElement('div', { className: "w-full lg:w-2/3 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700" },
                React.createElement('div', { className: "flex justify-between items-center mb-4" },
                    React.createElement('button', { onClick: () => changeMonth(-1), className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700", "aria-label": "Previous month" }, React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }))),
                    React.createElement('h2', { className: "text-xl font-bold text-center" }, `${bsMonthNames[currentBSMonth-1]} ${currentBSYear}`),
                    React.createElement('button', { onClick: () => changeMonth(1), className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700", "aria-label": "Next month" }, React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })))
                ),
                React.createElement('div', { className: "grid grid-cols-7 gap-1 text-center text-sm text-gray-500 dark:text-gray-400 mb-2" },
                    weekDays.map(day => React.createElement('div', { key: day, className: "font-semibold" }, day))
                ),
                React.createElement('div', { className: "grid grid-cols-7 gap-1" },
                    blanks.map(blank => React.createElement('div', { key: `blank-${blank}` })),
                    days.map(day => {
                        const dateString = `${currentBSYear}-${String(currentBSMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const events = eventsByDate.get(dateString);
                        const hasPayableDue = events?.chequeDate.some(c => c.type === 'payable');
                        const hasReceivableDue = events?.chequeDate.some(c => c.type === 'receivable');
                        const hasReminder = events && events.reminderDate.length > 0;
                        const isSelected = selectedDate?.day === day && selectedDate?.month === currentBSMonth && selectedDate?.year === currentBSYear;
                        const isToday = dateString === todayString;

                        let dayClasses = "p-2 h-12 flex items-center justify-center rounded-lg cursor-pointer transition-colors relative";
                        if (isSelected) dayClasses += " bg-blue-600 text-white font-semibold";
                        else if (isToday) dayClasses += " bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold";
                        else dayClasses += " hover:bg-gray-200 dark:hover:bg-gray-700";

                        return (
                            React.createElement('div', { key: day, onClick: () => handleDayClick(day), className: dayClasses, role: "button", tabIndex: 0 },
                                React.createElement('span', null, day),
                                React.createElement('div', { className: "absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1" },
                                    hasPayableDue && React.createElement('div', { className: "w-1.5 h-1.5 bg-red-500 rounded-full", title: "Payable Due" }),
                                    hasReceivableDue && React.createElement('div', { className: "w-1.5 h-1.5 bg-green-500 rounded-full", title: "Receivable Due" }),
                                    hasReminder && React.createElement('div', { className: "w-1.5 h-1.5 bg-yellow-400 rounded-full", title: "Reminder" })
                                )
                            )
                        );
                    })
                )
            ),
            React.createElement('div', { className: "w-full lg:w-1/3" },
                React.createElement('div', { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 min-h-[20rem]" },
                    React.createElement('h3', { className: "text-lg font-bold mb-4" },
                        selectedDate ? `Agenda for ${bsMonthNames[selectedDate.month-1]} ${selectedDate.day}, ${selectedDate.year}` : 'Select a date'
                    ),
                    React.createElement('div', { className: "space-y-4" },
                        !selectedDate && React.createElement('p', { className: "text-gray-500 dark:text-gray-400 pt-4 text-center" }, "Click on a day to see its agenda."),
                        selectedDate && !selectedDateEvents && React.createElement('p', { className: "text-gray-500 dark:text-gray-400 pt-4 text-center" }, "No events for this day."),
                        
                        selectedDateEvents?.payableDue.length > 0 && (
                            React.createElement('div', null,
                                React.createElement('h4', { className: "text-sm font-semibold text-red-600 dark:text-red-500 mb-2 border-b-2 border-red-200 dark:border-red-800 pb-1" }, "Payable Due"),
                                React.createElement('div', { className: "space-y-2" }, selectedDateEvents.payableDue.map(c => React.createElement(AgendaChequeItem, { key: `pd-${c.id}`, cheque: c })))
                            )
                        ),
                        selectedDateEvents?.receivableDue.length > 0 && (
                             React.createElement('div', null,
                                React.createElement('h4', { className: "text-sm font-semibold text-green-600 dark:text-green-500 mb-2 border-b-2 border-green-200 dark:border-green-800 pb-1" }, "Receivable Due"),
                                React.createElement('div', { className: "space-y-2" }, selectedDateEvents.receivableDue.map(c => React.createElement(AgendaChequeItem, { key: `rd-${c.id}`, cheque: c })))
                            )
                        ),
                        selectedDateEvents?.reminders.length > 0 && (
                            React.createElement('div', null,
                                React.createElement('h4', { className: "text-sm font-semibold text-yellow-600 dark:text-yellow-500 mb-2 border-b-2 border-yellow-200 dark:border-yellow-800 pb-1" }, "Reminders"),
                                React.createElement('div', { className: "space-y-2" }, selectedDateEvents.reminders.map(c => React.createElement(AgendaChequeItem, { key: `rem-${c.id}`, cheque: c })))
                            )
                        )
                    )
                )
            )
        )
    );
};

export default CalendarView;
