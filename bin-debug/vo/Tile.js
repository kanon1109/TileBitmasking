/**
 * 地形格子
 * @author Kanon
 * 格子基础数据类型
 * 包含方向 权值 索引
 */
var Tile = (function () {
    function Tile(row, column) {
        this.row = row;
        this.column = column;
    }
    var d = __define,c=Tile,p=c.prototype;
    return Tile;
})();
egret.registerClass(Tile,'Tile');
//# sourceMappingURL=Tile.js.map