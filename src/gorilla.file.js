(function ($u, $) {
    "use strict";

    var self = $u.file = {};

    self.getExtension = function(filename) {
        var pos = filename.lastIndexOf(".");
        return filename.substr(pos, filename.length - pos);
    };

    self.hasExtension = function(filename, extensions) {
        var result = false;
        $.each(extensions, function(key, ext) {
            var reg = new RegExp("[\\s\\S]+\\" + ext + "\\b");

            if (reg.test(filename)) {
                result = true;
                return false;
            }
        });

        return result;
    };

})(window.gorilla = window.gorilla || {}, jQuery);