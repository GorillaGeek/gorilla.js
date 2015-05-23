(function ($, window) {
    "use strict";

    window.$u = new function () {
        var self = this;
        var modules = ["core"];

        self.registerModule = function (module, dependencies) {

            if (dependencies.length > 0) {
                for (var x = 0; x < dependencies.length; x++) {
                    var lib = dependencies[x];
                    if (modules.indexOf(lib) == -1) {
                        throw "$u: [" + module + "] requires [" + lib + "]";
                    }
                }
            }

            modules.push(module);
        }

        
    };



    

})(jQuery, window);