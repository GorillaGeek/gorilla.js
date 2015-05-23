(function ($u, $) {
    "use strict";

    $u.registerModule("prototypes", []);




    /*=====================================
           Prototype
       =====================================*/

    $.fn.serializeObject = function (reg) {
        /// <summary>
        /// Parse a serializeArray to Json, REG replace the name
        /// Ex:
        ///    <div id="divInputs">
        ///        <input type="text" name="input1" value="1" />
        ///        <input type="text" name="input2" value="2" />
        ///    </div>
        /// $('#divInputs').serializeObject() //Return: {'input1':'1', 'input2':'2'}
        /// $('#divInputs').serializeObject(/inpu/g) //Return: {'t1':'1', 't2':'2'}
        /// </summary>
        /// <param name="selector" type="Object">Form Selector.</param>

        var o = {};
        var a = this.serializeArray();

        $.each(a, function () {
            if (reg !== undefined) {
                this.name = this.name.replace(new RegExp(reg), '');
            }

            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });

        return o;
    };

    //#region String Prototype

    String.prototype.parseNumeric = function () {
        /// <summary>
        /// Converts a string to numeric removing currency characteres
        ///     Ex:
        ///         '0'.libParseNumeric()           // 0
        ///         '$12.00'.libParseNumeric()      // 12
        ///         '$12,500.00'.libParseNumeric()  // 12500
        ///         '$0.10'.libParseNumeric()       // 0.1
        ///         'a'.libParseNumeric()           // 0
        /// </summary>
        var value = this;

        if (value == undefined) {
            return 0;
        }

        //Remove the money symbol
        value = value.replace(self.formats.money.symbol, '').replace(/\,/g, '.');

        if ($.isNumeric(value)) {
            value = parseFloat(value)

            return isNaN(value) ? 0 : value;
        }

        return 0;
    };

    String.prototype.toBool = function () {
        /// <summary>Convert a string to a valid boolean value</summary>
        return this.toLowerCase() === "true" || this === "1";
    };

    String.prototype.contains = function (value) {
        /// <summary>Returns true if the string contains the value</summary>
        return this.indexOf(value) !== -1;
    };

    String.prototype.onlyNumbers = function () {
        ///// <summary>
        ///// Extract the numbers from the string
        ///// </summary>

        return this.replace(/\D/g, '');
    };

    String.prototype.replaceLast = function (find, replace) {
        /// <summary>
        /// Replances the last occourence in the string
        /// </summary>
        var index = this.lastIndexOf(find);
        if (index >= 0) {
            return this.substring(0, index) + replace + this.substring(index + find.length);
        }
        return this.toString();
    };

    String.prototype.toASCII = function () {
        /// <summary>
        /// Converte os caracteres para ASCII ( Remove todos os acentos )
        /// </summary>
        var result = this;
        for (var i = 0; i < $u.defaultDiacriticsRemovalMap.length; i++) {
            result = result.replace($u.defaultDiacriticsRemovalMap[i].letters, $u.defaultDiacriticsRemovalMap[i].base);
        }
        return result;
    };

    String.prototype.isEqual = function (comparer) {
        /// <summary>
        /// Compara as strings removendo os acentos, espaços e diz se são identicas
        /// </summary>
        var regex = new RegExp(' ', 'g');
        return this.replace(regex, '').toASCII().toLocaleLowerCase() === comparer.replace(regex, '').toASCII().toLocaleLowerCase();
    };

    String.prototype.replaceAll = function (find, replace) {
        return this.replace(new RegExp(find, 'g'), replace);
    };

    String.prototype.toDate = function () {
        /// <summary>
        /// 
        /// </summary>
        return moment(this);
    };

    String.prototype.toDateBR = function () {
        /// <summary>
        /// 
        /// </summary>
        return this.toDate().format('DD/MM/YYYY');
    };

    String.prototype.md5 = function () {
        return $u.md5(this);
    };

    //#endregion

    //#region Number Prototype

    Number.prototype.formatDecimal = function () {
        //TODO: arrumar para um globalize de acordo com o formats

        /// <summary>
        /// Converts a number to a decimal formate string.
        ///     NaN results are converted to zero.
        ///     E.g. 10000 is converted as "10,000.00"
        /// </summary>
        var value = this;
        if (isNaN(this)) {
            value = 0;
        }
        return value.toFixed(2).replace(/(\d)(?=(\d{3})+\,)/g, "$1.").replace(".", self.formats.money.decimal);
    };

    Number.prototype.formatCurrency = function () {
        //TODO: arrumar para um globalize de acordo com o formats

        /// <summary>
        /// Converts a number to a currency formated string.
        ///     NaN results are converted to zero.
        ///     E.g. 10000 is converted as "$ 10,000.00"
        /// </summary>
        var value = this;
        if (isNaN(this)) {
            value = 0;
        }

        return self.formats.money.symbol + " " + value.toFixed(2).replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
    };

    //#endregion

    //#region Array Prototype

    Array.prototype.any = function () {
        /// <summary>Returns true if the array lenght is greater than zero</summary>
        return this.length > 0;
    };

    Array.prototype.contains = function (value) {
        /// <summary>Returns true if the array contains the value</summary>
        return this.indexOf(value) !== -1;
    };

    Array.prototype.remove = function (v) {
        /// <summary>Removes an item from the array</summary>
        /// <param name="v" type="Object">Item to be removed</param>
        this.splice(this.indexOf(v) === -1 ? this.length : this.indexOf(v), 1);
    };

    Array.prototype.removeAll = function () {
        /// <summary>Removes all the items from the array. Clears the array</summary>
        this.length = 0;
    };

    Array.prototype.count = function (callback) {
        return this.reduce(function (c, item) {
            callback(item) && c++;
            return c;
        }, 0);
    };

    //#endregion

})(window.$u = window.$u || {}, jQuery);