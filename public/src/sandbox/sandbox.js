angular.module('sandboxApp', [])
    .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.status = {
            "frontend" : "Online"
        };
        $http.get('/api').then(function (response) {
            $scope.status.backend = response.data.status;
        });
    }]);
