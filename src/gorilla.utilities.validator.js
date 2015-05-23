(function ($u, $) {
    "use strict";

    $u.registerModule("validator", ["constants"]);
    var self = $u.validator = {};    

    self.isNumber= function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    self.isAlpha= function (cc) {
        return cc === 32 || (cc > 64 && cc < 91) || (cc > 96 && cc < 123);
    };

    self.isAlphaNumeric = function (cc) {
        return self.isNumber(cc) || self.isAlpha(String.fromCharCode(cc));
    };

    self.rebuildValidation = function (selector) {
        /// <summary>Rebuilds the form validation</summary>
        /// <param name="selector" type="Object">Form Selector.</param>

        var form = $(selector || "form");

        setTimeout(function () {
            form.removeData("validator");
            form.removeData("unobtrusiveValidation");
            $.validator.unobtrusive.parse(selector);
        }, 300);

    };

 })(window.$u = window.$u || {}, jQuery);