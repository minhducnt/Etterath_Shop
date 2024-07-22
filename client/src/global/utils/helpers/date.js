import dayjs from 'dayjs';

import moment from 'moment';

//* Returns a matrix representing the days of a specific month
const getMonth = (month = dayjs().month()) => {
    month = Math.floor(month);
    const year = dayjs().year();
    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
    let currentMonthCount = 0 - firstDayOfTheMonth;
    const daysMatrix = new Array(5).fill([]).map(() => {
        return new Array(7).fill(null).map(() => {
            currentMonthCount++;
            return dayjs(new Date(year, month, currentMonthCount));
        });
    });
    return daysMatrix;
};

//* Converts a date from ISO format to DD-MM-YY format
const convertDateISOToDDMMYYY = dateISO => {
    const dateObj = new Date(dateISO);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString().substring(2);
    return `${day}-${month}-${year}`;
};

//* Converts a date from ISO format to HH:mm format
const convertDateISOToHHmm = dateISO => {
    if (dateISO) {
        if (moment.utc(dateISO).format('HH:mm') !== 'Invalid date') {
            return moment.utc(dateISO).format('HH:mm');
        }
    }
    return '--:--';
};

//* Converts a date from ISO format to DD/MM/yyyy format
const convertDateISOToDDMMyyyy = dateISO => {
    if (dateISO) {
        if (moment.utc(dateISO).format('DD/MM/yyyy') !== 'Invalid date') {
            return moment.utc(dateISO).format('DD/MM/yyyy');
        }
    }
    return '--/--/----';
};

//* Converts a date to the format YYYY-MM-DD
const getMomentDateFormat = dateInput => {
    const date = new Date(dateInput).toUTCString();
    const formatDate = moment.utc(date).format('YYYY-MM-DD');
    return formatDate;
};

//* Converts a date from ISO format to YYYY-MM-DD format
const convertDateISOToYYYY_MM_DD = dateISO => {
    return dateISO.split('T')[0];
};

//* Checks if a date is in the same month as the current date
function isInSameMonth(value) {
    if (value) {
        const currentMonth = new Date().getMonth();
        const selectedMonth = new Date(value).getMonth();
        return currentMonth === selectedMonth;
    }
    return true;
}

function convertDateToYYYYMMDD(date) {
    if (date) {
        return moment(date).format('YYYY-MM-DD');
    }
    return '';
}

function convertToISOString(dateString) {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }

    return date.toISOString();
}

export const DateHelper = {
    getMonth,
    convertDateISOToDDMMYYY,
    convertDateISOToHHmm,
    convertDateToYYYYMMDD,
    convertDateISOToDDMMyyyy,
    convertDateISOToYYYY_MM_DD,
    getMomentDateFormat,
    convertToISOString,
    isInSameMonth
};
