'use strict';

if (console == undefined || console.log == undefined) {
    console = {
        log: function () {
            //evita crash em navegadores que nao suportao console
        }
    }
}

var $u;
(function ($) {

    $u = new function () {
        var self = this;

        this.constant = {
            emptyGuid: '00000000-0000-0000-0000-000000000000',
            alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        };

        this.formats = {
            mask: {
                phone: '(99)9999-9999?9',
                zipCode: '99999-999',
                date: '99/99/9999',
                monthYear: '99/99',
                hour: '99:99',
                creditcard: "9999-9999-9999-9999",
                creditcardcsv: '999',
                cpf: '999.999.999-99',
                cnpj: "99.999.999/9999-99"
            },

            dateTime: {
                shortDate: 'DD/MM/YYYY',
                shortTime: 'HH:mm',
                dateAndHours: 'DD/MM/YYYY HH:mm',
                dateAndHoursSeconds: 'DD/MM/YYYY HH:mm:ss'
            },

            money: {
                symbol: 'R$',
                thousand: '.',
                decimal: ','
            },
        };

        this.regexp = {
            integer: /\d+/,
            decimal: /\d+.{1}\d+/,
            email: /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            date: /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/i,
            time24: /(2[0-23]|[1-9]):[0-5][0-9]/i,
            timeAMPM: /(1[012]|[1-9]):[0-5][0-9](\s?)(am|pm)/i
        }

        this.helpers = {
            scrollTo: function (position) {
                console.log(position);
                $('html, body').animate({ scrollTop: position }, 300);
            },

            toggleFullscreen: function () {
                /// <summary>Open or close fullscreen</summary>

                if (document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitIsFullScreen) {
                    if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                } else {
                    var elem = $('body')[0];

                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.msRequestFullscreen) {
                        elem.msRequestFullscreen();
                    } else if (elem.mozRequestFullScreen) {
                        elem.mozRequestFullScreen();
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                    }
                }
            },

            urlRouteTemplate: function (url, params) {
                $.each(params, function (key, value) {
                    var reg = new RegExp("\{\{" + key + "\}\}");
                    url = url.replace(reg, encodeURIComponent(value));

                    reg = new RegExp("\\\$\\\{" + key + "\\\}");
                    url = url.replace(reg, encodeURIComponent(value));
                });

                return url;
            },

            JSON: {
                isJSONDate: function (date) {
                    /// <summary>Check if the string is a MVC JSONDate ex: /Date(154889455)/</summary>
                    /// <param name="date">string</param>
                    var reg = /\/Date\(.+\)\//;
                    return reg.test(date);
                },

                parseJSONDate: function (date) {
                    /// <summary>Parse a JSONDate to a Date</summary>
                    /// <param name="date">MVC JSONDate ex: /Date(154889455)/</param>
                    if (self.helpers.JSON.isJSONDate(date)) {
                        date = new Date(parseInt(/\d+/.exec(date)));
                    }

                    return date;
                },

                undefinedPropToEmpty: function (arrayJson, char) {
                    /// <summary>Change a undefined value to a empty string or a specfic char</summary>
                    /// <param name="arrayJson">A json array or a simple json</param>
                    /// <param name="char">NOT REQUIRED, char to replace ex: '-'</param>

                    if ($.isArray(arrayJson) == false) {
                        arrayJson = [arrayJson];
                    }

                    $.each(arrayJson, function (index, json) {
                        $.each(json, function (prop, val) {
                            if (json[prop] == undefined || json[prop].length == 0) {
                                json[prop] = char || "";
                            }
                        });
                    });
                },
            },

            ajax: self.ajax
        },

        this.ajax = {
            setDefaultError: function () {
                $.ajaxSetup({
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus + ': ' + jqXHR.status + ' ' + errorThrown);
                        console.log(jqXHR);
                    }
                });
            },

            disableCache: function () {
                $.ajaxSetup({ cache: false });
            },

            form: {
                onBegin: function () {
                    self.helpers.loading.show();
                },

                onFailure: function (data) {
                    self.helpers.loading.hide();
                    //Modal error

                    console.log(data);
                }
            }
        }

        this.nextTabKey = function (form, current) {
            setTimeout(function () {
                var inputs = $(form).find("input:not(:hidden,:button),select");
                var idx = inputs.index($(current)[0]);

                if (idx == inputs.length - 1) {
                    inputs[0].select()
                } else {
                    inputs[idx + 1].focus(); //  handles submit buttons
                }
            }, 100);
        }

        this.setupGlobalize = function (culture) {
            /// <summary>
            /// Faz a substituição dos validadores jquery.validation para o formato da cultura desejada. Caso contrário, 
            /// mesmo com o site em pt-BR o jquery continua validando datas e formatos em inglês.
            /// Referencia em http://icanmakethiswork.blogspot.com.br/2012/09/globalize-and-jquery-validate.html
            /// </summary>

            //Troca o culture do validate
            Globalize.culture(culture);

            // Clone original methods we want to call into
            var originalMethods = {
                min: $.validator.methods.min,
                max: $.validator.methods.max,
                range: $.validator.methods.range
            };

            // Tell the validator that we want numbers parsed using Globalize

            $.validator.methods.number = function (value, element) {
                var val = Globalize.parseFloat(value || "0");
                return value == null || value == undefined || value.length == 0 || ($.isNumeric(val));
            };

            // Tell the validator that we want dates parsed using Globalize

            $.validator.methods.date = function (value, element) {
                var val = Globalize.parseDate(value);
                return value == null || value == undefined || value.length == 0 || (val);
            };

            // Tell the validator that we want numbers parsed using Globalize, 
            // then call into original implementation with parsed value

            $.validator.methods.min = function (value, element, param) {
                var val = Globalize.parseFloat(value || "0");
                return originalMethods.min.call(this, val, element, param);
            };

            $.validator.methods.max = function (value, element, param) {
                var val = Globalize.parseFloat(value || "0");
                return originalMethods.max.call(this, val, element, param);
            };

            $.validator.methods.range = function (value, element, param) {
                var val = Globalize.parseFloat(value || "0");
                return originalMethods.range.call(this, val, element, param);
            };

            //#region Métodos personalizados para a validação de data

            /// dategreaterthan ////// 
            $.validator.addMethod("dategreaterthan", function (value, element, params) {
                return Globalize.parseDate(value) > Globalize.parseDate($(params).val());
            });
            $.validator.unobtrusive.adapters.add("dategreaterthan", ["otherpropertyname"], function (options) {
                options.rules["dategreaterthan"] = "#" + options.params.otherpropertyname;
                options.messages["dategreaterthan"] = options.message;
            });

            /// datelessthan ////// 
            $.validator.addMethod("datelessthan", function (value, element, params) {
                return Globalize.parseDate(value) < Globalize.parseDate($(params).val());
            });
            $.validator.unobtrusive.adapters.add("datelessthan", ["otherpropertyname"], function (options) {
                options.rules["datelessthan"] = "#" + options.params.otherpropertyname;
                options.messages["datelessthan"] = options.message;
            });

            /// dategreaterthanorequalto ////// 
            $.validator.addMethod("dategreaterthanorequalto", function (value, element, params) {
                return Globalize.parseDate(value) >= Globalize.parseDate($(params).val());
            });
            $.validator.unobtrusive.adapters.add("dategreaterthanorequalto", ["otherpropertyname"], function (options) {
                options.rules["dategreaterthanorequalto"] = "#" + options.params.otherpropertyname;
                options.messages["dategreaterthanorequalto"] = options.message;
            });

            /// datelessthanorequalto ////// 
            $.validator.addMethod("datelessthanorequalto", function (value, element, params) {
                return Globalize.parseDate(value) <= Globalize.parseDate($(params).val());
            });
            $.validator.unobtrusive.adapters.add("datelessthanorequalto", ["otherpropertyname"], function (options) {
                options.rules["datelessthanorequalto"] = "#" + options.params.otherpropertyname;
                options.messages["datelessthanorequalto"] = options.message;
            });

            //#endregion 
        }

        this.validator = {
            //TODO: rever esses caras
            isNumber: function (n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            },

            isAlpha: function (cc) {
                return cc == 32 || (cc > 64 && cc < 91) || (cc > 96 && cc < 123);
            },

            isAlphaNumeric: function (cc) {
                return this.isNumber(cc) || this.isAlpha(String.fromCharCode(cc));
            },
        },

        this.isNullOrUndefined = function (v) {
            return v == undefined || v == null;
        }

        this.modal = {
            open: function (header, content, callbackOpen, callbackClose) {
                throw "Not Implemented";
            },

            close: function () {
                throw "Not Implemented";
            }
        },

        this.newGuid = function () {
            /// <summary>
            /// Generate new Guid
            /// </summary>
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };

            return (S4() + S4() + "-" +
                    S4() + "-" +
                    S4() + "-" +
                    S4() + "-" +
                    S4() + S4() + S4());
        };

        this.getOrdinalAlphabetCharacter = function (index) {
            return self.constant.alphabet[index];
        };

        this.getOrdinalNumberCharacter = function (carac) {
            var number = null;

            $.each(self.constant.alphabet, function (key, value) {
                if (value == (carac + '').toUpperCase()) {
                    number = key;
                    return;
                }
            })

            return number;
        };

        this.masks = {
            "decimal": function (element, format, options) {
                element.applyMaskMoney();
            },
            "credit-card-ccv": self.formats.mask.creditcardcsv,
            "credit-card-expiration-date": self.formats.mask.monthYear,
            "only-alpha": function (element, format, options) {
                element
                    .keypress(function (e) {
                        var code = (e.keyCode ? e.keyCode : e.which);
                        return self.functions.isAlpha(String.fromCharCode(code));
                    })
                    .change(function () {
                        if (self.validator.isAlpha(element.val()) == false) {
                            element.val('');
                        }
                    });
            },
            "only-alphanumeric": function (element, format, options) {
                element.keypress(function (e) {
                    var code = (e.keyCode ? e.keyCode : e.which);
                    return self.functions.isAlphaNumeric(String.fromCharCode(code));
                });
            },
            "number": function (element, format, options) {
                element
                    .keypress(function (e) {
                        var code = (e.keyCode ? e.keyCode : e.which);
                        return self.validator.isNumber(String.fromCharCode(code));
                    })
                    .change(function () {
                        if (!element.val().match('^[0-9]+$')) {
                            element.val('');
                        }
                    });
            }

        };

        this.applyMask = function (element, format, options) {
            /// <summary>applies the mask for all the masks</summary>
            element = $(element);

            if (self.masks[format] != undefined || self.formats.mask[format]) {
                var maskFormat = self.masks[format] || self.formats.mask[format];

                if (typeof maskFormat === "function") {
                    maskFormat(element, format, options);
                } else {
                    element.mask(maskFormat);
                }
            } else {

                element.mask(format);
            }
        };

        this.rebuildValidation = function (selector) {
            /// <summary>Rebuilds the form validation</summary>
            /// <param name="selector" type="Object">Form Selector.</param>

            if (selector == undefined || selector == null || selector == '') {
                selector = "form";
            }

            setTimeout(function () {
                $(selector).removeData("validator");
                $(selector).removeData("unobtrusiveValidation");
                $.validator.unobtrusive.parse(selector);
            }, 300);

        };


        this.uploadFile = function (element, options) {
            /// <summary>Verify and upload a file</summary>
            /// <param name="options" type="Object">
            /// JSON
            /// url = string : 'url to upload the file'
            /// exts: string array: extensions
            /// maxsize: int in bytes,
            /// onBegin: function
            /// onSuccess: function
            /// onCancel: function
            /// onInvalidExtension
            /// onInvalidSize
            /// </param>

            console.log(element)

            if (element.is(':file') == false)
                throw "The element must be a input file";

            var element = $(element);
            var parent = element.parent();

            var activeThread = null;
            element.change(function () {
                if (element[0].files.length == 0) {
                    activeThread = null;
                    options.onCancel();
                    return false;
                }

                var file = element[0].files[0];

                var checkFileExtension = function (fileName, extensions) {
                    var result = false;

                    $.each(extensions, function (key, ext) {
                        if (ext.indexOf('.') != 0)
                            ext = '.' + ext;

                        var reg = new RegExp('[\\s\\S]+\\' + ext + '\\b');

                        if (reg.test(fileName)) {
                            result = true;
                            return false;
                        }
                    });

                    return result;
                }

                if (!checkFileExtension(file.name, options.exts)) {
                    options.onInvalidExtension(file);
                    return false;
                }

                if (file.size > options.maxsize) {
                    options.onInvalidSize(file);
                    return false;
                }

                var data = new FormData();
                data.append('file', file);

                options.onBegin();

                var currentThread = activeThread = $u.newGuid();

                $.ajax({
                    url: options.url,
                    type: 'POST',
                    data: data,
                    cache: false,
                    dataType: 'json',
                    processData: false, // Don't process the files
                    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                    success: function (data) {
                        if (currentThread == activeThread)
                            options.onSuccess(data);
                    }
                });
            });
        };

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
                if (reg != undefined) {
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


        $.fn.applyDefaultFormatCurrency = function () {
            ///<summary>
            ///Applies the default currency format to the value of an input text field.
            ///</summary>
            ///<Author>Daniel Prado</Author>
            $(this).formatCurrency({ roundToDecimalPlace: 2, negativeFormat: "-%s%n" });
        }

        $.fn.applyDefaultFormatDecimal = function () {
            ///<summary>
            ///Applies the default decimal format to the value of an input text field.
            ///</summary>
            ///<Author>Daniel Prado/Felipe Esteves</Author>
            $(this).formatCurrency({ roundToDecimalPlace: 2, negativeFormat: "-%s%n", symbol: '', digitGroupSymbol: ',' });
        }

        $.fn.applyMaskMoney = function () {
            ///<summary>
            ///Applies a type mask in the input text field.
            ///</summary>
            ///<Author>Felipe Esteves</Author>

            if ($(this).attr('data-current-mask') == null || $(this).attr('data-current-mask') == undefined) {
                $(this).maskMoney({
                    thousands: self.formats.money.thousand,
                    decimal: self.formats.money.decimal,
                    allowZero: true,
                    allowNegative: true,
                    defaultZero: true
                });

                $(this).applyDefaultFormatDecimal();

                /// Prevent to add the mask twice
                $(this).attr('data-current-mask', 'money');
            }
        }

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
        }

        String.prototype.toBool = function () {
            /// <summary>Convert a string to a valid boolean value</summary>
            return this.toLowerCase() == "true" || this == "1";
        }

        String.prototype.contains = function (value) {
            /// <summary>Returns true if the string contains the value</summary>
            return this.indexOf(value) != -1;
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
            for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
                result = result.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
            }
            return result;
        }

        String.prototype.isEqual = function (comparer) {
            /// <summary>
            /// Compara as strings removendo os acentos, espaços e diz se são identicas
            /// </summary>
            var regex = new RegExp(' ', 'g');
            return this.replace(regex, '').toASCII().toLocaleLowerCase() == comparer.replace(regex, '').toASCII().toLocaleLowerCase();
        }

        String.prototype.replaceAll = function (find, replace) {
            return this.replace(new RegExp(find, 'g'), replace);
        };

        String.prototype.toDate = function () {
            /// <summary>
            /// 
            /// </summary>
            return moment(this);
        }

        String.prototype.toDateBR = function () {
            /// <summary>
            /// 
            /// </summary>
            return this.toDate().format('DD/MM/YYYY');
        }

        String.prototype.md5 = function () {
            return $u.md5(this);
        }

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
        }

        Array.prototype.contains = function (value) {
            /// <summary>Returns true if the array contains the value</summary>
            return this.indexOf(value) != -1;
        };

        Array.prototype.remove = function (v) {
            /// <summary>Removes an item from the array</summary>
            /// <param name="v" type="Object">Item to be removed</param>
            this.splice(this.indexOf(v) == -1 ? this.length : this.indexOf(v), 1);
        }

        Array.prototype.removeAll = function () {
            /// <summary>Removes all the items from the array. Clears the array</summary>
            this.length = 0;
        }

        Array.prototype.count = function (callback) {
            return this.reduce(function (c, item) {
                callback(item) && c++;
                return c;
            }, 0);
        }

        //#endregion

        this.md5 = (function (string) {

            /* this function is much faster,
            so if possible we use it. Some IEs
            are the only ones I know of that
            need the idiotic second function,
            generated by an if clause.  */

            var add32 = function (a, b) {
                return (a + b) & 0xFFFFFFFF;
            }

            var cmn = function (q, a, b, x, s, t) {
                a = add32(add32(a, q), add32(x, t));
                return add32((a << s) | (a >>> (32 - s)), b);
            }

            var ff = function (a, b, c, d, x, s, t) {
                return cmn((b & c) | ((~b) & d), a, b, x, s, t);
            }

            var gg = function (a, b, c, d, x, s, t) {
                return cmn((b & d) | (c & (~d)), a, b, x, s, t);
            }

            var hh = function (a, b, c, d, x, s, t) {
                return cmn(b ^ c ^ d, a, b, x, s, t);
            }

            var ii = function (a, b, c, d, x, s, t) {
                return cmn(c ^ (b | (~d)), a, b, x, s, t);
            }

            var md5Cycle = function (x, k) {
                var a = x[0], b = x[1], c = x[2], d = x[3];

                a = ff(a, b, c, d, k[0], 7, -680876936);
                d = ff(d, a, b, c, k[1], 12, -389564586);
                c = ff(c, d, a, b, k[2], 17, 606105819);
                b = ff(b, c, d, a, k[3], 22, -1044525330);
                a = ff(a, b, c, d, k[4], 7, -176418897);
                d = ff(d, a, b, c, k[5], 12, 1200080426);
                c = ff(c, d, a, b, k[6], 17, -1473231341);
                b = ff(b, c, d, a, k[7], 22, -45705983);
                a = ff(a, b, c, d, k[8], 7, 1770035416);
                d = ff(d, a, b, c, k[9], 12, -1958414417);
                c = ff(c, d, a, b, k[10], 17, -42063);
                b = ff(b, c, d, a, k[11], 22, -1990404162);
                a = ff(a, b, c, d, k[12], 7, 1804603682);
                d = ff(d, a, b, c, k[13], 12, -40341101);
                c = ff(c, d, a, b, k[14], 17, -1502002290);
                b = ff(b, c, d, a, k[15], 22, 1236535329);

                a = gg(a, b, c, d, k[1], 5, -165796510);
                d = gg(d, a, b, c, k[6], 9, -1069501632);
                c = gg(c, d, a, b, k[11], 14, 643717713);
                b = gg(b, c, d, a, k[0], 20, -373897302);
                a = gg(a, b, c, d, k[5], 5, -701558691);
                d = gg(d, a, b, c, k[10], 9, 38016083);
                c = gg(c, d, a, b, k[15], 14, -660478335);
                b = gg(b, c, d, a, k[4], 20, -405537848);
                a = gg(a, b, c, d, k[9], 5, 568446438);
                d = gg(d, a, b, c, k[14], 9, -1019803690);
                c = gg(c, d, a, b, k[3], 14, -187363961);
                b = gg(b, c, d, a, k[8], 20, 1163531501);
                a = gg(a, b, c, d, k[13], 5, -1444681467);
                d = gg(d, a, b, c, k[2], 9, -51403784);
                c = gg(c, d, a, b, k[7], 14, 1735328473);
                b = gg(b, c, d, a, k[12], 20, -1926607734);

                a = hh(a, b, c, d, k[5], 4, -378558);
                d = hh(d, a, b, c, k[8], 11, -2022574463);
                c = hh(c, d, a, b, k[11], 16, 1839030562);
                b = hh(b, c, d, a, k[14], 23, -35309556);
                a = hh(a, b, c, d, k[1], 4, -1530992060);
                d = hh(d, a, b, c, k[4], 11, 1272893353);
                c = hh(c, d, a, b, k[7], 16, -155497632);
                b = hh(b, c, d, a, k[10], 23, -1094730640);
                a = hh(a, b, c, d, k[13], 4, 681279174);
                d = hh(d, a, b, c, k[0], 11, -358537222);
                c = hh(c, d, a, b, k[3], 16, -722521979);
                b = hh(b, c, d, a, k[6], 23, 76029189);
                a = hh(a, b, c, d, k[9], 4, -640364487);
                d = hh(d, a, b, c, k[12], 11, -421815835);
                c = hh(c, d, a, b, k[15], 16, 530742520);
                b = hh(b, c, d, a, k[2], 23, -995338651);

                a = ii(a, b, c, d, k[0], 6, -198630844);
                d = ii(d, a, b, c, k[7], 10, 1126891415);
                c = ii(c, d, a, b, k[14], 15, -1416354905);
                b = ii(b, c, d, a, k[5], 21, -57434055);
                a = ii(a, b, c, d, k[12], 6, 1700485571);
                d = ii(d, a, b, c, k[3], 10, -1894986606);
                c = ii(c, d, a, b, k[10], 15, -1051523);
                b = ii(b, c, d, a, k[1], 21, -2054922799);
                a = ii(a, b, c, d, k[8], 6, 1873313359);
                d = ii(d, a, b, c, k[15], 10, -30611744);
                c = ii(c, d, a, b, k[6], 15, -1560198380);
                b = ii(b, c, d, a, k[13], 21, 1309151649);
                a = ii(a, b, c, d, k[4], 6, -145523070);
                d = ii(d, a, b, c, k[11], 10, -1120210379);
                c = ii(c, d, a, b, k[2], 15, 718787259);
                b = ii(b, c, d, a, k[9], 21, -343485551);

                x[0] = add32(a, x[0]);
                x[1] = add32(b, x[1]);
                x[2] = add32(c, x[2]);
                x[3] = add32(d, x[3]);

            }

            var md51 = function (s) {
                var n = s.length,
                state = [1732584193, -271733879, -1732584194, 271733878], i;
                for (i = 64; i <= s.length; i += 64) {
                    md5Cycle(state, md5Blk(s.substring(i - 64, i)));
                }
                s = s.substring(i - 64);
                var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (i = 0; i < s.length; i++)
                    tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
                tail[i >> 2] |= 0x80 << ((i % 4) << 3);
                if (i > 55) {
                    md5Cycle(state, tail);
                    for (i = 0; i < 16; i++) tail[i] = 0;
                }
                tail[14] = n * 8;
                md5Cycle(state, tail);
                return state;
            }

            var md5Blk = function (s) {
                var md5Blks = [], i;
                for (i = 0; i < 64; i += 4) {
                    md5Blks[i >> 2] = s.charCodeAt(i)
                    + (s.charCodeAt(i + 1) << 8)
                    + (s.charCodeAt(i + 2) << 16)
                    + (s.charCodeAt(i + 3) << 24);
                }
                return md5Blks;
            }

            var hex_chr = '0123456789abcdef'.split('');

            var rhex = function (n) {
                var s = '', j = 0;
                for (; j < 4; j++)
                    s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
                    + hex_chr[(n >> (j * 8)) & 0x0F];
                return s;
            }

            var hex = function (x) {
                for (var i = 0; i < x.length; i++)
                    x[i] = rhex(x[i]);
                return x.join('');
            }

            var md5 = function (s) {
                return hex(md51(s));
            }

            if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
                add32 = function (x, y) {
                    var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                    return (msw << 16) | (lsw & 0xFFFF);
                }
            }

            return md5;

        })();
    };



    var defaultDiacriticsRemovalMap = [
    { 'base': 'A', 'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g },
    { 'base': 'AA', 'letters': /[\uA732]/g },
    { 'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g },
    { 'base': 'AO', 'letters': /[\uA734]/g },
    { 'base': 'AU', 'letters': /[\uA736]/g },
    { 'base': 'AV', 'letters': /[\uA738\uA73A]/g },
    { 'base': 'AY', 'letters': /[\uA73C]/g },
    { 'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g },
    { 'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g },
    { 'base': 'D', 'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g },
    { 'base': 'DZ', 'letters': /[\u01F1\u01C4]/g },
    { 'base': 'Dz', 'letters': /[\u01F2\u01C5]/g },
    { 'base': 'E', 'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g },
    { 'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g },
    { 'base': 'G', 'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g },
    { 'base': 'H', 'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g },
    { 'base': 'I', 'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g },
    { 'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g },
    { 'base': 'K', 'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g },
    { 'base': 'L', 'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g },
    { 'base': 'LJ', 'letters': /[\u01C7]/g },
    { 'base': 'Lj', 'letters': /[\u01C8]/g },
    { 'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g },
    { 'base': 'N', 'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g },
    { 'base': 'NJ', 'letters': /[\u01CA]/g },
    { 'base': 'Nj', 'letters': /[\u01CB]/g },
    { 'base': 'O', 'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g },
    { 'base': 'OI', 'letters': /[\u01A2]/g },
    { 'base': 'OO', 'letters': /[\uA74E]/g },
    { 'base': 'OU', 'letters': /[\u0222]/g },
    { 'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g },
    { 'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g },
    { 'base': 'R', 'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g },
    { 'base': 'S', 'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g },
    { 'base': 'T', 'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g },
    { 'base': 'TZ', 'letters': /[\uA728]/g },
    { 'base': 'U', 'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g },
    { 'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g },
    { 'base': 'VY', 'letters': /[\uA760]/g },
    { 'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g },
    { 'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g },
    { 'base': 'Y', 'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g },
    { 'base': 'Z', 'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g },
    { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g },
    { 'base': 'aa', 'letters': /[\uA733]/g },
    { 'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g },
    { 'base': 'ao', 'letters': /[\uA735]/g },
    { 'base': 'au', 'letters': /[\uA737]/g },
    { 'base': 'av', 'letters': /[\uA739\uA73B]/g },
    { 'base': 'ay', 'letters': /[\uA73D]/g },
    { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
    { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g },
    { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g },
    { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g },
    { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g },
    { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
    { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g },
    { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g },
    { 'base': 'hv', 'letters': /[\u0195]/g },
    { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g },
    { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
    { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g },
    { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g },
    { 'base': 'lj', 'letters': /[\u01C9]/g },
    { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
    { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g },
    { 'base': 'nj', 'letters': /[\u01CC]/g },
    { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g },
    { 'base': 'oi', 'letters': /[\u01A3]/g },
    { 'base': 'ou', 'letters': /[\u0223]/g },
    { 'base': 'oo', 'letters': /[\uA74F]/g },
    { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
    { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
    { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g },
    { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g },
    { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g },
    { 'base': 'tz', 'letters': /[\uA729]/g },
    { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g },
    { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
    { 'base': 'vy', 'letters': /[\uA761]/g },
    { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g },
    { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
    { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g },
    { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }
    ];

})(jQuery);