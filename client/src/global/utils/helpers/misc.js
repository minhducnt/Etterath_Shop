//* Checks if a JWT token is expired
const isTokenExpired = expiryTime => {
    if (expiryTime) {
        const expiryDate = new Date(expiryTime.ExpiresAt);
        const currentTime = new Date();
        return currentTime > expiryDate;
    }
    return true;
};

//* Capitalizes the first letter of a string
function toSentenceCase(string) {
    if (string == null) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//* Capitalized the first letter of each word in a string
function toTitleCase(string) {
    if (string == null) return '';
    return string.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

//* Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export const Helper = {
    isTokenExpired,
    toSentenceCase,
    toTitleCase,
    formatCurrency
};
