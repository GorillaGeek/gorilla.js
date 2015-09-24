(function($u, $, Globalize) {
    "use strict";

    String.prototype.contains = function(value) {
        return this.indexOf(value) !== -1;
    };

    String.prototype.onlyNumbers = function() {
        return this.replace(/\D/g, "");
    };

    String.prototype.replaceLast = function(find, replace) {
        var index = this.lastIndexOf(find);
        if (index >= 0) {
            return this.substring(0, index) + replace + this.substring(index + find.length);
        }
        return this.toString();
    };

    String.prototype.toSlug = function() {
        var result = this;
        for (var i = 0; i < $u.defaultDiacriticsRemovalMap.length; i++) {
            result = result.replace($u.defaultDiacriticsRemovalMap[i].letters, $u.defaultDiacriticsRemovalMap[i].base);
        }

        result = result.replace(/\s+/gi, "-");
        result = result.trim("-");
        result = result.toLocaleLowerCase();

        return result;
    };

    String.prototype.isEqual = function(comparer) {
        return this.toSlug() === (comparer + "").toSlug();
    };

    String.prototype.replaceAll = function(find, replace) {
        return this.replace(new RegExp(find, "g"), replace);
    };

    String.prototype.toNumber = function() {
        var value = this;
        var result = 0;

        if (Globalize) {
            result = Globalize.parseFloat(value);
        }

        if ($.isNumeric(value)) {
            result = parseFloat(value);
        }

        return isNaN(result) ? 0 : result;
    };

    String.prototype.md5 = function() {
        return $u.cripto.md5(this);
    };

    String.prototype.tmpl = function(json, encodeUrl) {
        var result = this;
        encodeUrl = encodeUrl || false;

        var reg = /\{\{([^\}]*)\}\}/gm;
        var match = null;

        while ((match = reg.exec(this))) {
            var value = json[match[1]] || "";

            if (encodeUrl) {
                value = encodeURIComponent(value);
            }

            result = result.replace(match[0], value);
        }

        return result;
    };

    String.prototype.format = function() {
        var result = this;

        $.each(arguments, function(key, value) {
            var reg = new RegExp("\{[" + key + "]\}", "g");
            result = result.replace(reg, value);
        });

        return result;
    };

})(window.gorilla = window.gorilla || {}, jQuery, window.Globalize, window.moment);