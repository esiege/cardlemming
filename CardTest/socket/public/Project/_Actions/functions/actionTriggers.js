'use strict';

var keyedActions = new Array(9);
var active = 0;

var keyPress = function (keyCode) {


    if (keyCode == keycode_1 && active != 1) { if (keyedActions[1]) { keyedActions[1](); active = 1; } }
    else if (keyCode == keycode_2 && active != 2) { if (keyedActions[2]) { keyedActions[2](); active = 2; } }
    else if (keyCode == keycode_3 && active != 3) { if (keyedActions[3]) { keyedActions[3](); active = 3; } }
    else if (keyCode == keycode_4 && active != 4) { if (keyedActions[4]) { keyedActions[4](); active = 4; } }
    else if (keyCode == keycode_5 && active != 5) { if (keyedActions[5]) { keyedActions[5](); active = 5; } }
    else if (keyCode == keycode_6 && active != 6) { if (keyedActions[6]) { keyedActions[6](); active = 6; } }
    else if (keyCode == keycode_7 && active != 7) { if (keyedActions[7]) { keyedActions[7](); active = 7; } }
    else if (keyCode == keycode_8 && active != 8) { if (keyedActions[8]) { keyedActions[8](); active = 8; } }
    else
    {
        active = 0;
        actionReadied.targetLine = null;
        actionReadied.action = null;
    }

}



