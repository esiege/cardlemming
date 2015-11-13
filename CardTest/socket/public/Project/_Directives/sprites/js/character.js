'use strict';

app.directive('character', function () {
    return {
        restrict: 'E',
        templateUrl: 'Project/_Directives/sprites/html/character.html',
        replace: true,
        controller: function ( $scope, $rootScope )
        {
            $scope.charStyle = {
                position: 'absolute',
                left: $scope.model.position.x + 'px',
                top: (100-$scope.model.position.y) + 'px'

            };

        },
        scope: {
            model: '=',
            classtype: '@'
        }
    };
});
