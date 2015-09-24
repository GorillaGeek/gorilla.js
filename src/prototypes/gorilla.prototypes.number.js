(function() {
    "use strict";

    Number.prototype.pad = function(size, caracter) {
        var result = this + "";
        caracter = caracter || "0";

        if (size <= result.length) {
            return result;
        }

        while (result.length < size) result = caracter + result;
        return result.substr(-size);
    };

})();