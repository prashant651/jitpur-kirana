// A simple utility for Bikram Sambat (BS) date calculations for the calendar view.
// This is not a full-fledged date conversion library but is sufficient for this application's needs.

const bsCalendarData = {
    2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2081: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // Current year data needed for date logic
    2082: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
};

export const bsMonthNames = [
    'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

const REFERENCE_BS_YEAR = 2081;
const REFERENCE_BS_MONTH = 1;
const REFERENCE_GREGORIAN_DATE = new Date('2024-04-13');
const REFERENCE_WEEK_DAY = REFERENCE_GREGORIAN_DATE.getDay();

export const getBSMonthData = (year, month) => {
    const yearData = bsCalendarData[year];
    if (!yearData) {
        console.warn(`BS calendar data for year ${year} is not available. Falling back to 2081.`);
        return getBSMonthData(2081, month);
    }
    
    const daysInMonth = yearData[month - 1];

    let totalDaysOffset = 0;
    
    if (year > REFERENCE_BS_YEAR || (year === REFERENCE_BS_YEAR && month > REFERENCE_BS_MONTH)) {
        for (let y = REFERENCE_BS_YEAR; y <= year; y++) {
            const startM = (y === REFERENCE_BS_YEAR) ? REFERENCE_BS_MONTH : 1;
            const endM = (y === year) ? month -1 : 12;
            for (let m = startM; m <= endM; m++) {
                totalDaysOffset += bsCalendarData[y][m - 1];
            }
        }
    } else if (year < REFERENCE_BS_YEAR || (year === REFERENCE_BS_YEAR && month < REFERENCE_BS_MONTH)) {
        for (let y = REFERENCE_BS_YEAR; y >= year; y--) {
            const startM = (y === REFERENCE_BS_YEAR) ? REFERENCE_BS_MONTH - 1 : 12;
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

export const DEMO_TODAY = {
    year: 2081,
    month: 5, // Bhadra
    day: 29
};

export const getTodayBSString = () => {
    return `${DEMO_TODAY.year}-${String(DEMO_TODAY.month).padStart(2, '0')}-${String(DEMO_TODAY.day).padStart(2, '0')}`;
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
