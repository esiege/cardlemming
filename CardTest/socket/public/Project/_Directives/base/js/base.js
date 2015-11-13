'use strict';

app.directive('baseDirective', function () {
    return {
        restrict: 'E',
        templateUrl: 'Project/_Directives/base/html/base.html',
        replace: true,
        scope: {
            attr: '=',
            label: '@'
        }
    };
});
