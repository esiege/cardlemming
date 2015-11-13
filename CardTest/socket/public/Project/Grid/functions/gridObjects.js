'use strict';

app.service('grid_objects', function (grid_staticSprite) {

    var template = {
        shape: 0,
        color: 0,
        image: 0,
        name: 0,
        height: 0,
        width: 0,
        radius: 0,
        x: 0,
        y: 0,
        rotation: 'N',
        maskBits: 0x0001,
        controllable: 0,
        groupIndex: 0,
        layer: 0,
        update: 0,
        getUserRotVars: 0,
        actionChain: 0,
        tags: 0,
        stats: 0
    };

    var obj = {
        name: "land",
        height: 10,
        width: 10,
        radius: 20,
        x: -10,
        y: 220,
        rotation: 'E',
        maskBits: 0x0014,
        controllable: false,
        layer:8,
    };

    //obj.imgData = {};
    //for (var x = 1; x <= 300; x++) {
    //    for (var y = 1; y <= 300; y++) {
    //        if (!obj.imgData[x])
    //            obj.imgData[x] = {};

    //        obj.imgData[x][y] = { r: 1, g: 222, b: 0, a: 1 };
    //    }
    //}
    //obj.image = { width: 300, height: 300 };

    //grid_staticSprite.cr_object(obj);


























    function monster(rot, pos) {
        grid_staticSprite.cr_object(
        {
            image: "images/misc/testSprite/monsterHead.png",
            name: "monsterHead" + "_x-" + pos.x + "_y-" + pos.y,
            height: 20,
            width: 20,
            radius: 20,
            x: pos.x,
            y: pos.y,
            rotation: rot,
            maskBits: 0x0014,
            controllable: false,
            layer: 3,
        });
        grid_staticSprite.cr_object(
        {
            image: "images/misc/testSprite/monsterTop.png",
            name: "monsterTop" + "_x-" + pos.x + "_y-" + pos.y,
            height: 20,
            width: 20,
            radius: 20,
            x: pos.x,
            y: pos.y,
            rotation: rot,
            controllable: false,
            layer: 2,
        });
        grid_staticSprite.cr_object(
        {
            image: "images/misc/testSprite/monsterBottom.png",
            name: "monsterBottom" + "_x-" + pos.x + "_y-" + pos.y,
            height: 20,
            width: 20,
            radius: 20,
            x: pos.x,
            y: pos.y,
            rotation: rot,
            maskBits: 0x0014,
            controllable: false,
            layer: 1,
        });

    }
    //monster( 'N', { x: 600, y: 200 } );
    //monster( 'S', { x: 200, y: 200 } );

});