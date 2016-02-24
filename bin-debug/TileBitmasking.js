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
        //8为方向码表
        this.dirValue8BitObj = {};
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
        this.init8BitDirValue();
    }
    var d = __define,c=TileBitmasking,p=c.prototype;
    /**
     * 初始化8位方向码
     */
    p.init8BitDirValue = function () {
        this.dirValue8BitObj[0] = 47;
        this.dirValue8BitObj[2] = 1;
        this.dirValue8BitObj[8] = 2;
        this.dirValue8BitObj[10] = 3;
        this.dirValue8BitObj[11] = 4;
        this.dirValue8BitObj[16] = 5;
        this.dirValue8BitObj[18] = 6;
        this.dirValue8BitObj[22] = 7;
        this.dirValue8BitObj[24] = 8;
        this.dirValue8BitObj[26] = 9;
        this.dirValue8BitObj[27] = 10;
        this.dirValue8BitObj[30] = 11;
        this.dirValue8BitObj[31] = 12;
        this.dirValue8BitObj[64] = 13;
        this.dirValue8BitObj[66] = 14;
        this.dirValue8BitObj[72] = 15;
        this.dirValue8BitObj[74] = 16;
        this.dirValue8BitObj[75] = 17;
        this.dirValue8BitObj[80] = 18;
        this.dirValue8BitObj[82] = 19;
        this.dirValue8BitObj[86] = 20;
        this.dirValue8BitObj[88] = 21;
        this.dirValue8BitObj[90] = 22;
        this.dirValue8BitObj[91] = 23;
        this.dirValue8BitObj[94] = 24;
        this.dirValue8BitObj[95] = 25;
        this.dirValue8BitObj[104] = 26;
        this.dirValue8BitObj[106] = 27;
        this.dirValue8BitObj[107] = 28;
        this.dirValue8BitObj[120] = 29;
        this.dirValue8BitObj[122] = 30;
        this.dirValue8BitObj[123] = 31;
        this.dirValue8BitObj[126] = 32;
        this.dirValue8BitObj[127] = 33;
        this.dirValue8BitObj[208] = 34;
        this.dirValue8BitObj[210] = 35;
        this.dirValue8BitObj[214] = 36;
        this.dirValue8BitObj[216] = 37;
        this.dirValue8BitObj[218] = 38;
        this.dirValue8BitObj[219] = 39;
        this.dirValue8BitObj[222] = 40;
        this.dirValue8BitObj[223] = 41;
        this.dirValue8BitObj[248] = 42;
        this.dirValue8BitObj[250] = 43;
        this.dirValue8BitObj[251] = 44;
        this.dirValue8BitObj[254] = 45;
        this.dirValue8BitObj[255] = 46;
    };
    /**
     * 根据4位方向判断是否有地形
     * @param row       行数
     * @param columns   列数
     * @param dir       方向
     */
    p.hasTerrainBy4bitDir = function (row, column, dir) {
        var tile = this.tileList[row][column];
        if (!tile)
            return false;
        switch (dir) {
            case TileBitmasking.UP_4BIT:
                if (row - 1 < 0)
                    break;
                tile = this.tileList[row - 1][column];
                break;
            case TileBitmasking.DOWN_4BIT:
                if (row + 1 > this.rows)
                    break;
                tile = this.tileList[row + 1][column];
                break;
            case TileBitmasking.LEFT_4BIT:
                if (column - 1 < 0)
                    break;
                tile = this.tileList[row][column - 1];
                break;
            case TileBitmasking.RIGHT_4BIT:
                if (column + 1 > this.columns)
                    break;
                tile = this.tileList[row][column + 1];
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
     * 根据8位方向判断是否有地形
     * @param row       行数
     * @param column   列数
     * @param dir       方向
     */
    p.hasTerrainBy8bitDir = function (row, column, dir) {
        var tile = this.tileList[row][column];
        if (!tile)
            return false;
        switch (dir) {
            case TileBitmasking.UP_8BIT:
                if (row - 1 < 0)
                    break;
                tile = this.tileList[row - 1][column];
                break;
            case TileBitmasking.DOWN_8BIT:
                if (row + 1 > this.rows)
                    break;
                tile = this.tileList[row + 1][column];
                break;
            case TileBitmasking.LEFT_8BIT:
                if (column - 1 < 0)
                    break;
                tile = this.tileList[row][column - 1];
                break;
            case TileBitmasking.RIGHT_8BIT:
                if (column + 1 > this.columns)
                    break;
                tile = this.tileList[row][column + 1];
                break;
            case TileBitmasking.LEFT_UP_8BIT:
                if (row - 1 < 0 || column - 1 < 0)
                    break;
                tile = this.tileList[row - 1][column - 1];
                break;
            case TileBitmasking.LEFT_DOWN_8BIT:
                if (row + 1 > this.rows || column - 1 < 0)
                    break;
                tile = this.tileList[row + 1][column - 1];
                break;
            case TileBitmasking.RIGHT_UP_8BIT:
                if (row - 1 < 0 || column + 1 > this.columns)
                    break;
                tile = this.tileList[row - 1][column + 1];
                break;
            case TileBitmasking.RIGHT_DOWN_8BIT:
                if (row + 1 > this.rows || column + 1 > this.columns)
                    break;
                tile = this.tileList[row + 1][column + 1];
                break;
            default:
                return false;
                break;
        }
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
     * UP_4BIT    = 2^0 = 1
     * LEFT_4BIT  = 2^1 = 2
     * RIGHT_4BIT = 2^2 = 4
     * DOWN_4BIT  = 2^3 = 8
     *
     * @param row       行
     * @param columns   列
     */
    p.math4BitDirValues = function (row, columns) {
        var dirValue = 0;
        for (var i = 0; i < 4; i++) {
            if (this.hasTerrainBy4bitDir(row, columns, i))
                dirValue += Math.pow(2, i);
        }
        return dirValue;
    };
    /**
     * 8位 方向值
     * LEFT_UP_8BIT      = 2^0 = 1
     * UP_8BIT           = 2^1 = 2
     * RIGHT_UP_8BIT     = 2^2 = 4
     * LEFT_8BIT         = 2^3 = 8
     * RIGHT_8BIT        = 2^4 = 16
     * LEFT_DOWN_8BIT    = 2^5 = 32
     * DOWN_8BIT         = 2^6 = 64
     * RIGHT_DOWN_8BIT   = 2^7 = 128
     *
     * @param row       行
     * @param columns   列
     */
    p.math8BitDirValues = function (row, columns) {
        var up = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.UP_8BIT);
        var left = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.LEFT_8BIT);
        var right = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.RIGHT_8BIT);
        var down = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.DOWN_8BIT);
        var upLeft = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.LEFT_UP_8BIT) && up && left;
        var upRight = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.RIGHT_UP_8BIT) && up && right;
        var downLeft = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.LEFT_DOWN_8BIT) && down && left;
        var downRight = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.RIGHT_DOWN_8BIT) && down && right;
        var upVal = up ? 1 : 0;
        var leftVal = left ? 1 : 0;
        var rightVal = right ? 1 : 0;
        var downVal = down ? 1 : 0;
        var upLeftVal = upLeft ? 1 : 0;
        var upRightVal = upRight ? 1 : 0;
        var downLeftVal = downLeft ? 1 : 0;
        var downRightVal = downRight ? 1 : 0;
        var index = upLeftVal + 2 * upVal +
            4 * upRightVal + 8 * leftVal + 16 * rightVal +
            32 * downLeftVal + 64 * downVal + 128 * downRightVal;
        var dirValue = this.dirValue8BitObj[index];
        return dirValue;
    };
    //4位方向码
    TileBitmasking.UP_4BIT = 0;
    TileBitmasking.LEFT_4BIT = 1;
    TileBitmasking.RIGHT_4BIT = 2;
    TileBitmasking.DOWN_4BIT = 3;
    //8位方向码
    TileBitmasking.LEFT_UP_8BIT = 0;
    TileBitmasking.UP_8BIT = 1;
    TileBitmasking.RIGHT_UP_8BIT = 2;
    TileBitmasking.LEFT_8BIT = 3;
    TileBitmasking.RIGHT_8BIT = 4;
    TileBitmasking.LEFT_DOWN_8BIT = 5;
    TileBitmasking.DOWN_8BIT = 6;
    TileBitmasking.RIGHT_DOWN_8BIT = 7;
    return TileBitmasking;
})();
egret.registerClass(TileBitmasking,'TileBitmasking');
//# sourceMappingURL=TileBitmasking.js.map