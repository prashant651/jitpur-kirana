// A utility for Bikram Sambat (BS) date calculations for the calendar view.

const bsCalendarData = {
    2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2081: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2082: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
};

export const bsMonthNames = [
    'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

// Reference date mapping: Gregorian Sept 15, 2024 corresponds to BS Bhadra 30, 2081
const REFERENCE_GREGORIAN_DATE = new Date('2024-09-15T00:00:00Z');
const REFERENCE_BS_DATE = { year: 2081, month: 5, day: 30 };

const addDaysToBS = (bsDate, daysToAdd) => {
    let { year, month, day } = bsDate;

    day += daysToAdd;

    while (true) {
        const daysInCurrentMonth = bsCalendarData[year]?.[month - 1];
        if (!daysInCurrentMonth) {
            console.error(`Calendar data for ${year} is missing.`);
            return { year, month, day }; // Return best guess
        }
        
        if (day > daysInCurrentMonth) {
            day -= daysInCurrentMonth;
            month++;
            if (month > 12) {
                month = 1;
                year++;
            }
        } else {
            break;
        }
    }
    
    return { year, month, day };
};

export const getTodayBS = () => {
    const todayGregorian = new Date();
    todayGregorian.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const diffInMs = todayGregorian - REFERENCE_GREGORIAN_DATE;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    return addDaysToBS(REFERENCE_BS_DATE, diffInDays);
};


export const getTodayBSString = () => {
    const today = getTodayBS();
    return `${today.year}-${String(today.month).padStart(2, '0')}-${String(today.day).padStart(2, '0')}`;
};

export const getPreviousDateString = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);

    if (day > 1) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day - 1).padStart(2, '0')}`;
    }
    
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth < 1) {
        prevMonth = 12;
        prevYear = year - 1;
    }

    const yearData = bsCalendarData[prevYear];
    if (!yearData) {
        return dateString;
    }
    const daysInPrevMonth = yearData[prevMonth - 1];

    return `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(daysInPrevMonth).padStart(2, '0')}`;
};


export const getNextDateString = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    
    const daysInCurrentMonth = bsCalendarData[year]?.[month - 1];
    
    if (!daysInCurrentMonth) {
        return dateString; // Safety return
    }

    if (day < daysInCurrentMonth) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`;
    }

    let nextMonth = month + 1;
    let nextYear = year;
    if (nextMonth > 12) {
        nextMonth = 1;
        nextYear = year + 1;
    }
    
    return `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;
};

// --- Calendar View Specific Logic ---

const REFERENCE_BS_YEAR_FOR_CALENDAR = 2081;
const REFERENCE_BS_MONTH_FOR_CALENDAR = 1;
const REFERENCE_GREGORIAN_DATE_FOR_CALENDAR = new Date('2024-04-13');
const REFERENCE_WEEK_DAY = REFERENCE_GREGORIAN_DATE_FOR_CALENDAR.getDay();

export const getBSMonthData = (year, month) => {
    const yearData = bsCalendarData[year];
    if (!yearData) {
        console.warn(`BS calendar data for year ${year} is not available. Falling back to 2081.`);
        return getBSMonthData(2081, month);
    }
    
    const daysInMonth = yearData[month - 1];

    let totalDaysOffset = 0;
    
    if (year > REFERENCE_BS_YEAR_FOR_CALENDAR || (year === REFERENCE_BS_YEAR_FOR_CALENDAR && month > REFERENCE_BS_MONTH_FOR_CALENDAR)) {
        for (let y = REFERENCE_BS_YEAR_FOR_CALENDAR; y <= year; y++) {
            const startM = (y === REFERENCE_BS_YEAR_FOR_CALENDAR) ? REFERENCE_BS_MONTH_FOR_CALENDAR : 1;
            const endM = (y === year) ? month -1 : 12;
            for (let m = startM; m <= endM; m++) {
                totalDaysOffset += bsCalendarData[y][m - 1];
            }
        }
    } else if (year < REFERENCE_BS_YEAR_FOR_CALENDAR || (year === REFERENCE_BS_YEAR_FOR_CALENDAR && month < REFERENCE_BS_MONTH_FOR_CALENDAR)) {
        for (let y = REFERENCE_BS_YEAR_FOR_CALENDAR; y >= year; y--) {
            const startM = (y === REFERENCE_BS_YEAR_FOR_CALENDAR) ? REFERENCE_BS_MONTH_FOR_CALENDAR - 1 : 12;
            const endM = (y === year) ? month : 1;
            for (let m = startM; m >= endM; m--) {
                 totalDaysOffset -= bsCalendarData[y][m - 1];
            }
        }
    }

    const startDayOfWeek = (REFERENCE_WEEK_DAY + totalDaysOffset) % 7;
    return {
        daysInMonth,
        startDayOfWeek: (startDayOfWeek + 7) % 7
    };
};
