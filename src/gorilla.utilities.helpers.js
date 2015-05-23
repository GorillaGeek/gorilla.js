(function ($u, $) {
    "use strict";

    $u.registerModule("helpers", []);
    var self = $u.helpers = {};

    self.scrollTo = function (position) {
        $('html, body').animate({ scrollTop: position }, 300);
    };

    self.urlRouteTemplate = function (url, params) {
        $.each(params, function (key, value) {
            var reg = new RegExp("\{\{" + key + "\}\}");
            url = url.replace(reg, encodeURIComponent(value));

            reg = new RegExp("\\\$\\\{" + key + "\\\}");
            url = url.replace(reg, encodeURIComponent(value));
        });

        return url;
    };

})(window.$u = window.$u || {}, jQuery);