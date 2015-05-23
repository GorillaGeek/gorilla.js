(function ($u, $) {
    "use strict";

    $u.registerModule("masks", ["constants", "validator"]);
    var self = $u.mask = {};

    $u.formats.mask = {
        phone: '(99)9999-9999?9',
        zipCode: '99999-999',
        date: '99/99/9999',
        monthYear: '99/99',
        hour: '99:99',
        creditcard: "9999-9999-9999-9999",
        creditcardcsv: '999',
        cpf: '999.999.999-99',
        cnpj: "99.999.999/9999-99"
    };

    self.dictionary = {
        "credit-card-ccv": $u.formats.mask.creditcardcsv,
        "credit-card-expiration-date": $u.formats.mask.monthYear,
        "decimal": function (element) {
            element.applyMaskMoney();
        },
        "alpha": function (element) {
            element
                .keypress(function (e) {
                    var code = (e.keyCode ? e.keyCode : e.which);
                    return $u.validator.isAlpha(String.fromCharCode(code));
                })
                .change(function () {
                    if ($u.validator.isAlpha(element.val()) === false) {
                        element.val('');
                    }
                });
        },
        "alphanumeric": function (element) {
            element.keypress(function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                return $u.validator.isAlphaNumeric(String.fromCharCode(code));
            });
        },
        "number": function (element) {
            element
                .keypress(function (e) {
                    var code = (e.keyCode ? e.keyCode : e.which);
                    return $u.validator.isNumber(String.fromCharCode(code));
                })
                .change(function () {
                    if (!element.val().match('^[0-9]+$')) {
                        element.val('');
                    }
                });
        }

    };

    self.bind = function (elem, format, options) {
        elem = $(elem);
        var maskFormat = self.dictionary[format] || $u.formats.mask[format];

        if (typeof maskFormat === "function") {
            maskFormat(elem, format, options);
            return;
        }

        elem.mask(maskFormat || format);
    };

    $.fn.bindMaskMoney = function () {
        var elem = $(this);

        elem.maskMoney({
            thousands: $u.formats.money.thousand,
            decimal: $u.formats.money.decimal,
            allowZero: true,
            allowNegative: true,
            defaultZero: true
        });

        elem.formatCurrency({
            roundToDecimalPlace: 2,
            negativeFormat: "-%s%n",
            symbol: '',
            digitGroupSymbol: ','
        });
    }

})(window.$u = window.$u || {}, jQuery);