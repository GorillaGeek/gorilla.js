(function ($u, $) {
    "use strict";

    $.fn.serializeObject = function (reg) {
        var o = {}, a = this.serializeArray();

        $.each(a, function () {
            if (reg !== undefined) {
                this.name = this.name.replace(new RegExp(reg), "");
            }

            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || "");
            } else {
                o[this.name] = this.value || "";
            }
        });

        return o;
    };

    //#region String Prototype

    String.prototype.contains = function (value) {
        return this.indexOf(value) !== -1;
    };

    String.prototype.onlyNumbers = function () {
        return this.replace(/\D/g, "");
    };

    String.prototype.replaceLast = function (find, replace) {
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

    String.prototype.toDate = function() {
        return moment(this);
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

        $.each(json, function(key, value) {
            if (encodeUrl) {
                value = encodeURIComponent(value);
            }

            var reg = new RegExp("\{\{" + key + "\}\}", "g");
            result = result.replace(reg, value);
        });

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

    //#endregion

    //#region Array Prototype

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

    //#endregion

})(window.gorilla = window.gorilla || {}, jQuery);