/**
 * 瓦片地形的掩码计算 用于自动选择合适地形
 * @author Kanon
 * 根据各个方位上的占据的地形计算掩码值。
 */
var TileBitmasking = (function () {
    /**
     * 创建地图
     * @param rows      行数
     * @param columns   列数
     */
    function TileBitmasking(rows, columns) {
        //是否是计算4位方向值
        this.is4bit = true;
        this.rows = rows;
        this.columns = columns;
        this.tileList = [];
        for (var i = 0; i < rows; i++) {
            this.tileList[i] = [];
            for (var j = 0; j < columns; j++) {
                var tile = new Tile(i, j);
                this.tileList[i][j] = tile;
            }
        }
    }
    var d = __define,c=TileBitmasking,p=c.prototype;
    /**
     * 根据方向判断是否有地形
     * @param row       行数
     * @param columns   列数
     * @param dir       方向
     */
    p.hasTerrainByDir = function (row, columns, dir) {
        var tile = this.tileList[row][columns];
        if (!tile)
            return false;
        switch (dir) {
            case TileBitmasking.UP:
                tile = this.tileList[row - 1][columns];
                break;
            case TileBitmasking.DOWN:
                tile = this.tileList[row + 1][columns];
                break;
            case TileBitmasking.LEFT:
                tile = this.tileList[row][columns - 1];
                break;
            case TileBitmasking.RIGHT:
                tile = this.tileList[row][columns + 1];
                break;
            default:
                return false;
                break;
        }
        if (!tile)
            return false;
        return tile.isTerrain;
    };
    /**
     * 根据位置获取格子
     * @param posX          x位置
     * @param posY          y位置
     * @param gridWidth     格子宽度
     * @param gridHeight    格子高度
     */
    p.getTileByPos = function (posX, posY, tileWidth, tileHeight) {
        var c = Math.floor(posX / tileWidth);
        var r = Math.floor(posY / tileHeight);
        var tile = this.tileList[r][c];
        return tile;
    };
    /**
     * 4位 方向值
     * UP    = 2^0 = 1
     * LEFT  = 2^1 = 2
     * RIGHT = 2^2 = 4
     * DOWN  = 2^3 = 8
     *
     * 8位 方向值
     * LEFT_UP      = 2^0 = 1
     * UP           = 2^1 = 2
     * RIGHT_UP     = 2^2 = 4
     * LEFT         = 2^3 = 8
     * RIGHT        = 2^4 = 16
     * LEFT_DOWN    = 2^5 = 32
     * DOWN         = 2^6 = 64
     * RIGHT_DOWN   = 2^7 = 128
     *
     * @param row       行
     * @param columns   列
     */
    p.math4BitDirValues = function (row, columns) {
        var dirValue = 0;
        for (var i = 0; i < 4; i++) {
            if (this.hasTerrainByDir(row, columns, i))
                dirValue += Math.pow(2, i);
        }
        return dirValue;
    };
    //4位方向码
    TileBitmasking.UP = 0;
    TileBitmasking.LEFT = 1;
    TileBitmasking.RIGHT = 2;
    TileBitmasking.DOWN = 3;
    return TileBitmasking;
})();
egret.registerClass(TileBitmasking,'TileBitmasking');
//# sourceMappingURL=TileBitmasking.js.map