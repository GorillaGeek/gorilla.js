(function($u) {
    "use strict";

    var self = $u.video = {};

    self.youtubeCode = function(url) {
        var code = url.match($u.regexp.youtube);
        if (!code) {
            return null;
        }

        return code.pop();
    };

    self.vimeoCode = function(url) {
        var code = url.match($u.regexp.vimeo);
        if (!code) {
            return null;
        }

        return code.pop();
    };

    self.info = function(videoUrl) {
        var site = "youtube";
        var code = self.youtubeCode(videoUrl);
        var url = 'https://www.youtube.com/embed/' + code;

        if (!code) {
            site = "vimeo";
            code = self.vimeoCode(videoUrl);
            url = 'https://player.vimeo.com/video/' + code;
        }

        if (!code) {
            return false;
        }

        return {
            provider: site,
            code: code,
            iframeUrl: url
        };
    };

})(window.gorilla = window.gorilla || {});