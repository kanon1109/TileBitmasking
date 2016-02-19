/**
 * 4位码测试文件
 * @author kanon
 */
class TileBitmaskingTest  extends egret.DisplayObjectContainer
{
	//地形掩码计算
	private tileBitmasking:TileBitmasking;
	//瓦片纹理
	private tileTexture:egret.Texture;
	//地形0的纹理
	private terrain0Texture:egret.Texture;
	//是否点击
	private isTouched:boolean;
	//瓦片大小
	private tileWidth:number = 36;
	//瓦片大小
	private tileHeight:number = 36;
	//是否擦除状态
	private isErase:boolean;
	//存放有地形瓦片的字典
	private terrainAry:any[];
	//地形纹理列表
	private terrainTextureAry:any[];
	public constructor()
	{
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}


    private onAddToStage(event:egret.Event)
    {
        this.init();
        this.initTerrainTextures();
        this.initTile();
    }

    /**
     * 初始化
     */
    private init():void
    {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveHandler, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
        this.terrainAry = [];
        this.tileTexture = RES.getRes("tile");
        this.terrain0Texture = RES.getRes("tile0");
    }

    /**
     * 初始化瓦片
     * Create a game scene
     */
    private initTile():void
    {
        this.tileBitmasking = new TileBitmasking(100, 100);
        var rows:number = this.tileBitmasking.rows;
        var columns:number = this.tileBitmasking.columns;
        for(var i:number = 0; i < rows; i++)
        {
            for(var j:number = 0; j < columns; j++)
            {
                var tileBmp:egret.Bitmap = new egret.Bitmap();
                tileBmp.texture = this.tileTexture;
                tileBmp.x = j * this.tileWidth;
                tileBmp.y = i * this.tileHeight;
                this.addChild(tileBmp);
            }
        }
    }

    /**
     * 初始化地形纹理列表
     */
    private initTerrainTextures():void
    {
        this.terrainTextureAry = [];
        for(var i:number = 0; i < 16; i++)
        {
            var texture:egret.Texture = RES.getRes("terrain" + i);
            this.terrainTextureAry.push(texture);
        }
    }

    private touchBeginHandler(event:egret.TouchEvent):void
    {
        this.isTouched = true;
        var tile:Tile = this.tileBitmasking.getTileByPos(event.stageX,
            event.stageY,
            this.tileWidth,
            this.tileHeight);
        this.isErase = tile.isTerrain;
        this.createTileBmpByMousePos(event.stageX, event.stageY, this.terrain0Texture);
    }

    private touchEndHandler(event:egret.TouchEvent):void
    {
        this.isTouched = false;
        this.createDynamicTile();
    }

    private touchMoveHandler(event:egret.TouchEvent):void
    {
        if(this.isTouched)
            this.createTileBmpByMousePos(event.stageX, event.stageY, this.terrain0Texture);
    }

    /**
     * 根据点击移动的位置创建瓦片
     * @param mouseX        移动位置
     * @param mouseY        移动位置
     * @param texture       瓦片纹理
     */
    private createTileBmpByMousePos(mouseX:number, mouseY:number, texture:egret.Texture):void
    {
        var tile:Tile = this.tileBitmasking.getTileByPos(mouseX,
            mouseY,
            this.tileWidth,
            this.tileHeight);
        var tileBmp:egret.Bitmap;
        if(!tile.isTerrain && !this.isErase)
        {
            tile.isTerrain = true;
            tileBmp = new egret.Bitmap();
            tileBmp.texture = texture;
            tileBmp.x = tile.column * this.tileWidth;
            tileBmp.y = tile.row * this.tileHeight;
            this.addChild(tileBmp);
            tile.userData = tileBmp;
            this.terrainAry.push(tile);
        }
        if(tile.isTerrain && this.isErase)
        {
            tile.isTerrain = false;
            tileBmp = tile.userData as egret.Bitmap;
            if(tileBmp.parent)
                tileBmp.parent.removeChild(tileBmp);
            tile.userData = null;
            this.terrainAry.splice(this.terrainAry.indexOf(tile), 1);
        }
    }


    /**
     * 创建动态地形
     */
    private createDynamicTile():void
    {
        var count:number = this.terrainAry.length;
        for(var i:number = 0; i < count; ++i)
        {
            var tile:Tile = this.terrainAry[i];
            var tileBmp:egret.Bitmap = tile.userData as egret.Bitmap;
            if(tileBmp.parent)
                tileBmp.parent.removeChild(tileBmp);
            var index:number = this.tileBitmasking.math4BitDirValues(tile.row, tile.column);
            var terrainTexture:egret.Texture = this.terrainTextureAry[index];
            tileBmp = new egret.Bitmap();
            tileBmp.texture = terrainTexture;
            tileBmp.x = tile.column * this.tileWidth;
            tileBmp.y = tile.row * this.tileHeight;
            this.addChild(tileBmp);
            tile.userData = tileBmp;
        }
    }
}
