(function($u) {
  "use strict";

  var self = $u.url = {};

  self.youtube = function(url) {
    var code = url.match($u.regexp.youtube);
    if (!code) {
      return null;
    }

    return code.pop();
  };

  self.vimeo = function(url) {
    var code = url.match($u.regexp.vimeo);
    if (!code) {
      return null;
    }

    return code.pop();
  };

  self.videoInfo = function(videoUrl) {
    var site = "youtube";
    var code = self.youtube(videoUrl);
    var url = 'https://www.youtube.com/embed/' + code;

    if (!code) {
      site = "vimeo";
      code = self.vimeo(videoUrl);
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
