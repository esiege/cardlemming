'use strict';

var grid = [];
app.service('grid_def', function ($rootScope) {

    var gridPiece = function (pts, gridCoord) {
        //$rootScope.spriteList.push(new Body({
        //    shape: "polygon",
        //    line: {
        //        lineWidth: "2",
        //        strokeStyle: "rgba(100,100,100,.5)"
        //    },
        //    type: "static",
        //    tag: "grid",
        //    points: pts,
        //    groupIndex: -1,
        //    gridCoord: gridCoord
        //}));
    };

    this.getTileByCoords = function (posX, posY) {

    }

    this.getCenterOfTile = function (tileX, tileY) {
        var tile = grid[tileY][tileX];

        return {
            x: ((tile[0].x + tile[2].x) / 2),
            y: ((tile[1].y + tile[3].y) / 2)
        }
    }


    this.createGrid = function (details) {
        var len = details.length;
        var hei = details.height;
        var size = details.size;
        var skew = details.skew;
        var offset = {x:50, y:50};

        for (var j = 0; j <= hei; j++) {
            var row = [];
            for (var i = 0; i <= len; i++) {
                var ind = row.push({ x: i * size + offset.x - (len * skew * j / 2) + (i * skew * j), y: size * j + offset.y }) - 1;
            }
            grid.push(row);
        }

        for (var j = 0; j < grid.length - 1; j++) {
            if (grid[j + 1]) {
                var topRow = grid[j];
                var bottomRow = grid[j + 1];

                for (var i = 0; i < grid[j].length - 1; i++) {
                    var coords = [
                        { x: topRow[i].x, y: topRow[i].y },
                        { x: topRow[i + 1].x, y: topRow[i + 1].y },
                        { x: bottomRow[i + 1].x, y: bottomRow[i + 1].y },
                        { x: bottomRow[i].x, y: bottomRow[i].y }
                    ];

                    gridPiece(coords);
                    grid[j][i] = coords;
                }
            }
        }
        return grid;
    }


});