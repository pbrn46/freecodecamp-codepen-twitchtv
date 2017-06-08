var app = angular.module('twitchApp', []);

app.factory('twitchService', function ($http, $sce) {
  return {
    getFromTwitch: function (type, name) {
      var url = 'https://wind-bow.gomix.me/twitch-api/' + type + '/' + name;
      url = $sce.trustAsResourceUrl(url);
      var config = {};
      return $http.jsonp(url, config);
    }
  };
});

app.controller('twitchList', function ($scope, twitchService) {
  var getList = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"];
  $scope.tList = [];
  $scope.listFilter = 'all';
  for (var i = 0; i < getList.length; i++) {
    var listItem = getList[i];
    twitchService.getFromTwitch('channels', listItem).then((function (listItem) {
      return function(response) {
        var channelResponse = response.data;
        twitchService.getFromTwitch('streams', listItem).then((function (listItem) {
          return function(response) {
            var streamResponse = response.data;
            var pushObj = {};

            $.extend(pushObj, {
              logo: channelResponse.logo ? channelResponse.logo : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
            });
            if (channelResponse.error) {
              $.extend(pushObj, {
                channel_name: listItem,
                online: false,
                error: true
              });
            } else {
              $.extend(pushObj, {
                channel_name: listItem,
                online: streamResponse.stream === null ? false : true,
                display_name: channelResponse.display_name,
                url: channelResponse.url,
                game: channelResponse.game,
                status: channelResponse.status
              });
            }

            console.log(channelResponse);
            console.log(streamResponse);
            $scope.tList.push(pushObj);
          };
        })(listItem));
      };
    })(listItem));
  }
});
