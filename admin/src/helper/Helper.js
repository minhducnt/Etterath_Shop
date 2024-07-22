import CryptoJS from 'crypto-js';

import dayjs from 'dayjs';

import { jwtDecode } from 'jwt-decode';

import moment from 'moment';

//* Checks if a JWT token is expired
const isTokenExpired = expiryTime => {
  if (expiryTime) {
    const expiryDate = new Date(jwtDecode(expiryTime).ExpiresAt);
    const currentTime = new Date();
    if (currentTime > expiryDate) {
      return true;
    } else {
      return false;
    }
  }
  return true;
};

//* Checks if a value is odd
const isOdd = value => value % 2 === 0;

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

//* Converts a date from ISO format to YYYY-MM-DD format
const convertDateISOToYYYYMMDD = dateISO => {
  const dateObj = new Date(dateISO);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString();
  return `${year}-${month}-${day}`;
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

//* Decodes the access token stored in local storage
const getUseDecodeInfo = () => {
  const accessTokenJSON = localStorage.getItem('accessToken');
  if (!accessTokenJSON) return null;
  const accessToken = JSON.parse(accessTokenJSON);
  var decoded = jwtDecode(accessToken);
  return decoded;
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

//* Finds the most duplicated value in an array
function findMostDuplicatedValue(array) {
  let counts = {};
  let maxCount = 0;
  let mostDuplicatedValue;
  for (let i = 0, length = array.length; i < length; ++i) {
    let value = array[i];
    counts[value] = (counts[value] || 0) + 1;
    if (counts[value] > maxCount) {
      maxCount = counts[value];
      mostDuplicatedValue = value;
    }
  }
  return maxCount > 1 ? mostDuplicatedValue : 'unknown';
}

//* Splits a URL path into an array of segments
const splitUrlPath = path => {
  const pathArr = path.split('/');
  pathArr.shift();
  return pathArr;
};

//* Splits a string into an array by underscore
const splitUnderscoreStringToArray = string => {
  const parts = string.split('_');
  return parts;
};

//* Matches a value to a color code
const matchingCodeColor = (value, codeColorObj) => {
  const match = codeColorObj.find(item => item.code.toLowerCase() === value.toLowerCase());
  return match ? match.color : null;
};

//* Decodes a message using Cipher
const decodeWithCipher = encodedMessage => {
  console.log(encodedMessage);
  var decodedData = CryptoJS.enc.Base64.parse(encodedMessage).toString(CryptoJS.enc.Utf8);
  console.log(decodedData);
  return decodedData;
};

//* Converts an array to a selection array with label and value properties
const convertToArraySelection = (array, labelName, valueName) => {
  if (array && array.length > 0) {
    let tempArray = [];
    array.map(item => {
      return tempArray.push({
        value: item[valueName],
        label: item[labelName]
      });
    });
    return tempArray;
  }
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

//* Converts a base64 string to a file
const convertBase64ToFile = async (base64Data, fileName) => {
  return fetch(base64Data)
    .then(response => response.blob())
    .then(blob => new File([blob], fileName, { type: 'image/jpeg' }));
};

//* Generates a random number between 1 and 10
const randomNumber = () => Math.floor(Math.random() * 10) + 1;

//* Function to get the secret key
async function getKey(secretKey) {
  const encoder = new TextEncoder();

  const secretKeyBuffer = encoder.encode(secretKey);
  const importedKey = await window.crypto.subtle.importKey(
    'raw',
    secretKeyBuffer,
    {
      name: 'RSA-OAEP'
    },
    false,
    ['encrypt', 'decrypt']
  );
  return importedKey;
}

//* Function to convert file to base64 format
const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

//* Function to encode the array to an encrypted string
async function encodeArrayToString(array, secretKey) {
  const arrayString = JSON.stringify(array);
  const encoder = new TextEncoder();
  const data = encoder.encode(arrayString);
  const secretKeyBuffer = await getKey(secretKey);
  return await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    secretKeyBuffer,
    data
  );
}

//* Function to decode the encrypted string back to the original array
async function decodeStringToArray(encryptedString, secretKey) {
  const secretKeyBuffer = await getKey(secretKey);
  return window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, secretKeyBuffer, encryptedString);
}

//* Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//* Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export const Helper = {
  convertToArraySelection,
  convertBase64ToFile,
  convertDateISOToYYYYMMDD,
  convertDateISOToDDMMyyyy,
  convertDateISOToHHmm,
  convertDateISOToYYYY_MM_DD,
  decodeStringToArray,
  decodeWithCipher,
  encodeArrayToString,
  findMostDuplicatedValue,
  getMomentDateFormat,
  getMonth,
  getUseDecodeInfo,
  isInSameMonth,
  isOdd,
  isTokenExpired,
  matchingCodeColor,
  randomNumber,
  splitUnderscoreStringToArray,
  splitUrlPath,
  toSentence: capitalizeFirstLetter,
  toBase64,
  formatCurrency
};
