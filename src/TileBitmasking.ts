/**
 * 瓦片地形的掩码计算 用于自动选择合适地形
 * @author Kanon
 * 根据各个方位上的占据的地形计算掩码值。
 */
class TileBitmasking 
{
    //4位方向码
    public static UP_4BIT:number = 0;
    public static LEFT_4BIT:number = 1;
    public static RIGHT_4BIT:number = 2;
    public static DOWN_4BIT:number = 3;

    //8位方向码
    public static LEFT_UP_8BIT:number = 0;
    public static UP_8BIT:number = 1;
    public static RIGHT_UP_8BIT:number = 2;
    public static LEFT_8BIT:number = 3;
    public static RIGHT_8BIT:number = 4;
    public static LEFT_DOWN_8BIT:number = 5;
    public static DOWN_8BIT:number = 6;
    public static RIGHT_DOWN_8BIT:number = 7;

    //行数
    public rows:number;
    //列数
    public columns:number;
    //存放瓦片的二维列表
    private tileList:any[];
    /**
     * 创建地图
     * @param rows      行数
     * @param columns   列数
     */
	public constructor(rows:number, columns:number)
	{
        this.rows = rows;
        this.columns = columns;
        this.tileList = [];
        for(var i:number = 0; i < rows; i++)
        {
            this.tileList[i] = [];
            for(var j:number = 0; j < columns; j++)
            {
                var tile:Tile = new Tile(i, j);
                this.tileList[i][j] = tile;
            }
        }
	}

    /**
     * 根据4位方向判断是否有地形
     * @param row       行数
     * @param columns   列数
     * @param dir       方向
     */
    public hasTerrainBy4bitDir(row:number, columns:number, dir:number):boolean
    {
        var tile:Tile = this.tileList[row][columns];
        if(!tile) return false;
        switch (dir)
        {
            case TileBitmasking.UP_4BIT:
                tile = this.tileList[row - 1][columns];
                break;
            case TileBitmasking.DOWN_4BIT:
                tile = this.tileList[row + 1][columns];
                break;
            case TileBitmasking.LEFT_4BIT:
                tile = this.tileList[row][columns - 1];
                break;
            case TileBitmasking.RIGHT_4BIT:
                tile = this.tileList[row][columns + 1];
                break;
            default:
                return false;
                break;
        }
        if(!tile) return false;
        return tile.isTerrain;
    }

    /**
     * 根据位置获取格子
     * @param posX          x位置
     * @param posY          y位置
     * @param gridWidth     格子宽度
     * @param gridHeight    格子高度
     */
    public getTileByPos(posX:number,
                        posY:number,
                        tileWidth:number,
                        tileHeight:number):Tile
    {
        var c:number = Math.floor(posX / tileWidth);
        var r:number = Math.floor(posY / tileHeight);
        var tile:Tile = this.tileList[r][c];
        return tile;
    }


    /**
     * 4位 方向值
     * UP_4BIT    = 2^0 = 1
     * LEFT_4BIT  = 2^1 = 2
     * RIGHT_4BIT = 2^2 = 4
     * DOWN_4BIT  = 2^3 = 8
     *
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
    public math4BitDirValues(row:number, columns:number):number
    {
        var dirValue:number = 0;
        for(var i:number = 0; i < 4; i++)
        {
            if(this.hasTerrainBy4bitDir(row, columns, i))
               dirValue += Math.pow(2, i);
        }
        return dirValue;
    }
}
