(function ($u, $) {
    "use strict";

    var self = $u.globalize = {};

    self.setCulture = function (culture) {
        Globalize.culture(culture);

        // Clone original methods we want to call into
        var originalMethods = {
            min: $.validator.methods.min,
            max: $.validator.methods.max,
            range: $.validator.methods.range
        };

        // Tell the validator that we want numbers parsed using Globalize
        $.validator.methods.number = function (value) {
            var val = Globalize.parseFloat(value || "0");
            return value === null || value === undefined || value.length === 0 || ($.isNumeric(val));
        };

        // Tell the validator that we want dates parsed using Globalize
        $.validator.methods.date = function (value) {
            var val = Globalize.parseDate(value);
            return value === null || value === undefined || value.length === 0 || (val);
        };

        // Tell the validator that we want numbers parsed using Globalize, 
        // then call into original implementation with parsed value
        $.validator.methods.min = function (value, element, param) {
            var val = Globalize.parseFloat(value || "0");
            return originalMethods.min.call(this, val, element, param);
        };

        $.validator.methods.max = function (value, element, param) {
            var val = Globalize.parseFloat(value || "0");
            return originalMethods.max.call(this, val, element, param);
        };

        $.validator.methods.range = function (value, element, param) {
            var val = Globalize.parseFloat(value || "0");
            return originalMethods.range.call(this, val, element, param);
        };

        //#region Métodos personalizados para a validação de data

        /// dategreaterthan ////// 
        $.validator.addMethod("dategreaterthan", function (value, element, params) {
            return Globalize.parseDate(value) > Globalize.parseDate($(params).val());
        });
        $.validator.unobtrusive.adapters.add("dategreaterthan", ["otherpropertyname"], function (options) {
            options.rules["dategreaterthan"] = "#" + options.params.otherpropertyname;
            options.messages["dategreaterthan"] = options.message;
        });

        /// datelessthan ////// 
        $.validator.addMethod("datelessthan", function (value, element, params) {
            return Globalize.parseDate(value) < Globalize.parseDate($(params).val());
        });
        $.validator.unobtrusive.adapters.add("datelessthan", ["otherpropertyname"], function (options) {
            options.rules["datelessthan"] = "#" + options.params.otherpropertyname;
            options.messages["datelessthan"] = options.message;
        });

        /// dategreaterthanorequalto ////// 
        $.validator.addMethod("dategreaterthanorequalto", function (value, element, params) {
            return Globalize.parseDate(value) >= Globalize.parseDate($(params).val());
        });
        $.validator.unobtrusive.adapters.add("dategreaterthanorequalto", ["otherpropertyname"], function (options) {
            options.rules["dategreaterthanorequalto"] = "#" + options.params.otherpropertyname;
            options.messages["dategreaterthanorequalto"] = options.message;
        });

        /// datelessthanorequalto ////// 
        $.validator.addMethod("datelessthanorequalto", function (value, element, params) {
            return Globalize.parseDate(value) <= Globalize.parseDate($(params).val());
        });
        $.validator.unobtrusive.adapters.add("datelessthanorequalto", ["otherpropertyname"], function (options) {
            options.rules["datelessthanorequalto"] = "#" + options.params.otherpropertyname;
            options.messages["datelessthanorequalto"] = options.message;
        });

        //#endregion 
    };

 })(window.gorilla = window.gorilla || {}, jQuery);
