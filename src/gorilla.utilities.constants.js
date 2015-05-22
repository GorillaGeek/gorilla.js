(function ($u) {
    "use strict";

    $u.constant = {
        emptyGuid: '00000000-0000-0000-0000-000000000000',
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    };

    $u.formats = {
        mask: {
            phone: '(99)9999-9999?9',
            zipCode: '99999-999',
            date: '99/99/9999',
            monthYear: '99/99',
            hour: '99:99',
            creditcard: "9999-9999-9999-9999",
            creditcardcsv: '999',
            cpf: '999.999.999-99',
            cnpj: "99.999.999/9999-99"
        },

        dateTime: {
            shortDate: 'DD/MM/YYYY',
            shortTime: 'HH:mm',
            dateAndHours: 'DD/MM/YYYY HH:mm',
            dateAndHoursSeconds: 'DD/MM/YYYY HH:mm:ss'
        },

        money: {
            symbol: 'R$',
            thousand: '.',
            decimal: ','
        },
    };

    $u.regexp = {
        integer: /\d+/,
        decimal: /\d+.{1}\d+/,
        email: /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
        date: /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/i,
        time24: /(2[0-23]|[1-9]):[0-5][0-9]/i,
        timeAMPM: /(1[012]|[1-9]):[0-5][0-9](\s?)(am|pm)/i
    };

 })(window.$u = window.$u || {});