(function($u, $) {
    "use strict";

    var self = $u.validator = {};

    self.rebuildJqueryValidate = function(selector) {
        selector = selector || "form";
        var form = $(selector);

        setTimeout(function() {
            form.removeData("validator");
            form.removeData("unobtrusiveValidation");
            $.validator.unobtrusive.parse(selector);
        }, 300);

    };

})(window.gorilla = window.gorilla || {}, jQuery);