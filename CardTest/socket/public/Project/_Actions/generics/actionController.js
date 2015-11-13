'use strict';

//non-instanced global containers
var actions = [];
var activeActionList = [];
var actionReadied = {};

//controller exists as an instance for each action button
function ActionCtrl($scope, $rootScope, queryFactory) {
    $rootScope.activeActions = [];

    //called from button press/key input
    $scope.action = function () {
        actions[$scope.temptype].setActiveAction();
    };
    keyedActions[$scope.key] = $scope.action;

    //on click event - if exists send to server
    mouseLeftClickEvents[0] = function () {
        if (actionReadied && actionReadied.name)
            sendActionToServer();
    }

    //send to server and perform on response
    var sendActionToServer = function () {
        queryFactory.query('action:begin', { sid: $rootScope.user.sid, actionName: actionReadied.name, variableDetails: actionReadied.variableDetails, currentStep: update_steps }, function (results) {

            var stepExecuted;

            if (results.slot == 1)
            {
                //remote action
                stepExecuted = results.currentStep;
                console.log("remote step: " + stepExecuted + " | " + "local step: " + update_steps);

                stepSyncDifference = update_steps - results.currentStep;

            }
            else
            {
                //local action
                stepExecuted = update_steps;
                console.log("local step: " + stepExecuted);

            }



            var i = runProcAtStep.push({}) - 1;
            runProcAtStep[i].func = function (stepSyncDifference) { actions[results.actionName].performAction(results.variableDetails, stepSyncDifference); };
            runProcAtStep[i].step = ( results.currentStep - update_steps % 10 ) + 10;
            console.log(runProcAtStep[i].step);

        });
    }


}
