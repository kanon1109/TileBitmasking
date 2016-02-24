/**
 * 4位码测试文件
 * @author kanon
 */
var TileBitmaskingTest = (function (_super) {
    __extends(TileBitmaskingTest, _super);
    function TileBitmaskingTest() {
        _super.call(this);
        //瓦片大小
        this.tileWidth = 36;
        //瓦片大小
        this.tileHeight = 36;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=TileBitmaskingTest,p=c.prototype;
    p.onAddToStage = function (event) {
        this.init();
        this.init4BitTerrainTextures();
        this.init8BitTerrainTextures();
        this.initTile();
    };
    /**
     * 初始化
     */
    p.init = function () {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveHandler, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
        this.terrainAry = [];
        this.tileTexture = RES.getRes("tile");
        this.terrain0Texture = RES.getRes("tile0");
    };
    /**
     * 初始化瓦片
     * Create a game scene
     */
    p.initTile = function () {
        this.tileBitmasking = new TileBitmasking(100, 100);
        var rows = this.tileBitmasking.rows;
        var columns = this.tileBitmasking.columns;
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                var tileBmp = new egret.Bitmap();
                tileBmp.texture = this.tileTexture;
                tileBmp.x = j * this.tileWidth;
                tileBmp.y = i * this.tileHeight;
                this.addChild(tileBmp);
            }
        }
    };
    /**
     * 初始化地形纹理列表
     */
    p.init4BitTerrainTextures = function () {
        this.terrain4BitTextureAry = [];
        for (var i = 0; i < 16; i++) {
            var texture = RES.getRes("terrain" + i);
            this.terrain4BitTextureAry.push(texture);
        }
    };
    /**
     * 初始化地形纹理列表
     */
    p.init8BitTerrainTextures = function () {
        this.terrain8BitTextureAry = [];
        for (var i = 1; i <= 48; i++) {
            var texture = RES.getRes("terrain8bit" + i);
            this.terrain8BitTextureAry.push(texture);
        }
    };
    p.touchBeginHandler = function (event) {
        this.isTouched = true;
        var tile = this.tileBitmasking.getTileByPos(event.stageX, event.stageY, this.tileWidth, this.tileHeight);
        this.isErase = tile.isTerrain;
        this.createTileBmpByMousePos(event.stageX, event.stageY, this.terrain0Texture);
    };
    p.touchEndHandler = function (event) {
        this.isTouched = false;
        this.createDynamicTile(false);
        //this.createDynamicTile(true);
    };
    p.touchMoveHandler = function (event) {
        if (this.isTouched)
            this.createTileBmpByMousePos(event.stageX, event.stageY, this.terrain0Texture);
    };
    /**
     * 根据点击移动的位置创建瓦片
     * @param mouseX        移动位置
     * @param mouseY        移动位置
     * @param texture       瓦片纹理
     */
    p.createTileBmpByMousePos = function (mouseX, mouseY, texture) {
        var tile = this.tileBitmasking.getTileByPos(mouseX, mouseY, this.tileWidth, this.tileHeight);
        var tileBmp;
        if (!tile.isTerrain && !this.isErase) {
            tile.isTerrain = true;
            tileBmp = new egret.Bitmap();
            tileBmp.texture = texture;
            tileBmp.x = tile.column * this.tileWidth;
            tileBmp.y = tile.row * this.tileHeight;
            this.addChild(tileBmp);
            tile.userData = tileBmp;
            this.terrainAry.push(tile);
        }
        if (tile.isTerrain && this.isErase) {
            tile.isTerrain = false;
            tileBmp = tile.userData;
            if (tileBmp.parent)
                tileBmp.parent.removeChild(tileBmp);
            tile.userData = null;
            this.terrainAry.splice(this.terrainAry.indexOf(tile), 1);
        }
    };
    /**
     * 创建动态地形
     */
    p.createDynamicTile = function (is4Bit) {
        var count = this.terrainAry.length;
        for (var i = 0; i < count; ++i) {
            var tile = this.terrainAry[i];
            var tileBmp = tile.userData;
            if (tileBmp.parent)
                tileBmp.parent.removeChild(tileBmp);
            var index;
            var terrainTexture;
            if (is4Bit) {
                index = this.tileBitmasking.math4BitDirValues(tile.row, tile.column);
                terrainTexture = this.terrain4BitTextureAry[index];
            }
            else {
                index = this.tileBitmasking.math8BitDirValues(tile.row, tile.column);
                terrainTexture = this.terrain8BitTextureAry[index];
            }
            tileBmp = new egret.Bitmap();
            tileBmp.texture = terrainTexture;
            tileBmp.width = this.tileWidth;
            tileBmp.height = this.tileHeight;
            tileBmp.x = tile.column * this.tileWidth;
            tileBmp.y = tile.row * this.tileHeight;
            this.addChild(tileBmp);
            tile.userData = tileBmp;
        }
    };
    return TileBitmaskingTest;
})(egret.DisplayObjectContainer);
egret.registerClass(TileBitmaskingTest,'TileBitmaskingTest');
//# sourceMappingURL=TileBitmaskingTest.js.map