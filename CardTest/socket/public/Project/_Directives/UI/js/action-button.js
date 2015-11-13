'use strict';

app.directive('actionButton', function () {
    return {
        restrict: 'E',
        templateUrl: 'Project/_Directives/UI/html/action-button.html',
        replace: false,
        link: function(scope, element, attrs, controller) {},
        scope: {
            key: '=',
            temptype: '@',
            button: '@'
        }
    };
});
