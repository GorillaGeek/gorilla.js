(function ($u) {
    "use strict";

    var self = $u.url = {};

    self.youtube = function(url) {
    	var code = url.match($u.regexp.youtube);
		if(!code){
			return null;
		}

		return code[1];
	};

    self.vimeo = function(url) {
    	var code = url.match($u.regexp.vimeo);
		if(!code){
			return null;
		}

		return code[1];
    };

    self.videoInfo = function(url){
    	var site = "youtube";
    	var code = self.youtube(url);

    	if(!code){
    		site = "vimeo";
    		code = self.vimeo(url);
    	}

    	if(!code){
    		return false;
    	}

    	return {
    		provider: site,
    		code: code
    	};
    };

})(window.gorilla = window.gorilla || {});