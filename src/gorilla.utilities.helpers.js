(function ($u, $) {
    "use strict";

    var self = $u.helpers = {};

    self.scrollTo = function (position) {
        $("html, body").animate({ scrollTop: position }, 300);
    };


})(window.gorilla = window.gorilla || {}, jQuery);