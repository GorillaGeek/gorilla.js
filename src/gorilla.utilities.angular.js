'use strict';

(function ($) {

    angular.module("utilities", [])
        .directive("ngMask", function () {
            return {
                /// <summary>
                /// Aplica a mascara no input
                /// </summary>

                restrict: 'A',
                link: function ($scope, elem, attrs) {
                    switch (attrs.ngMask) {
                        default:
                            $u.applyMask(elem, attrs.ngMask);
                            break;
                    }
                }
            }
        })
        .directive("ngDatepicker", ['$compile', function ($compile) {
            /// <summary>
            /// Cria toda a estrutra base para o datepicker
            /// </summary>
            return {
                restrict: 'A',
                replace: false,
                terminal: true,
                priority: 1000,
                compile: function (element, attrs) {

                    var modelName = attrs.ngDatepicker;

                    //Atributos necessarios para o datepicker
                    element.attr({
                        "datepicker-popup": "dd/MM/yyyy",
                        "is-open": modelName + "_open",
                        "ng-focus": modelName + "_open = true",
                        "readonly": "readonly",
                        "current-text": "Hoje",
                        "clear-text": "Limpar",
                        "ng-model": modelName
                    });

                    //Impede crash na pagina
                    element.removeAttr("ng-datepicker");


                    return {
                        pre: function preLink(scope, iElement, iAttrs, controller) { },
                        post: function postLink(scope, iElement, iAttrs, controller) {
                            $compile(iElement)(scope);

                            //seta o valor padrão do input na model
                            var value = element.val()
                            if (value) {
                                //por se datetime a hora pode ter vindo entao remove ela
                                if (value.contains(" ")) {
                                    value = value.split(" ")[0];
                                }

                                scope[modelName] = value;
                            }

                            scope.$watch(modelName, function (newValue) {
                                element.blur();
                            });
                        }
                    };
                },

            }
        }])
        .factory('utilities.frontendManager', [function () {
            $u.loading.hide();

            var loaderCount = 0;
            return new function () {
                var self = this;

                var timeout = 500;

                this.updateUI = function (selector, callback, showLoader, hideLoader) {
                    if (showLoader == undefined || showLoader) {
                        self.showLoader();
                    }

                    setTimeout(function () {
                        timeout = 0;
                        $u.rebuildValidation(selector);

                        if (hideLoader == undefined || hideLoader) {
                            self.hideLoader();
                        }

                        if (callback) {
                            callback();
                        }
                    }, timeout); // o timeout é necessário para que o foundation funcione

                };

                this.showLoader = function () {
                    loaderCount++;
                    $u.loading.show();
                };

                this.hideLoader = function () {
                    if (--loaderCount == 0) {
                        $u.loading.hide();
                    }
                };
            }
        }]);

})(jQuery);