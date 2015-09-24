(function($u, $, Globalize) {
    "use strict";

    var self = $u.globalize = {};

    self.setCulture = function(culture) {
        Globalize.culture(culture);

        if (!$.validator) {
            return;
        }

        var originalMethods = {
            min: $.validator.methods.min,
            max: $.validator.methods.max,
            range: $.validator.methods.range
        };

        $.validator.methods.number = function(value) {
            var val = Globalize.parseFloat(value || "0");
            return value === null || value === undefined || value.length === 0 || ($.isNumeric(val));
        };

        $.validator.methods.date = function(value) {
            var val = Globalize.parseDate(value);
            return value === null || value === undefined || value.length === 0 || (val);
        };

        $.validator.methods.min = function(value, element, param) {
            var val = Globalize.parseFloat(value || "0");
            return originalMethods.min.call(this, val, element, param);
        };

        $.validator.methods.max = function(value, element, param) {
            var val = Globalize.parseFloat(value || "0");
            return originalMethods.max.call(this, val, element, param);
        };

        $.validator.methods.range = function(value, element, param) {
            var val = Globalize.parseFloat(value || "0");
            return originalMethods.range.call(this, val, element, param);
        };
    };

})(window.gorilla = window.gorilla || {}, jQuery, window.Globalize || {});