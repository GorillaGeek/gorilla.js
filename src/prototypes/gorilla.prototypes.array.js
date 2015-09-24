(function() {
    "use strict";

    Array.prototype.any = function() {
        return this.length > 0;
    };

    Array.prototype.contains = function(value) {
        return this.indexOf(value) !== -1;
    };

    Array.prototype.remove = function(v) {
        this.splice(this.indexOf(v) === -1 ? this.length : this.indexOf(v), 1);
    };

    Array.prototype.removeAll = function() {
        this.length = 0;
    };

    Array.prototype.count = function(callback) {
        return this.reduce(function(c, item) {
            if (callback(item))
                c++;

            return c;
        }, 0);
    };

})();