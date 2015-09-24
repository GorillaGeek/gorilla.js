(function($u) {
    "use strict";

    var self = $u.guid = {};

    self.empty = "00000000-0000-0000-0000-000000000000";

    self.new = function() {
        var S4 = function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };

        return (S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4());
    };

})(window.gorilla = window.gorilla || {});