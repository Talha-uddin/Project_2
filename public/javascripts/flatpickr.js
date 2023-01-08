const flatpickr = require('flatpickr');

config = {
    altInput: true,
    dateFormat: "YYYY-MM-DD",
    altFormat: "DD-MM-YYYY",
    allowInput: true,
    parseDate: (datestr, format) => {
        return moment(datestr, format, true).toDate();
    },
    formatDate: (date, format, locale) => {
        // locale can also be used
        return moment(date).format(format);
    }
}
flatpickr(".flatpickr");