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
    //8为方向码表
    private dirValue8BitObj = {};

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
        this.init8BitDirValue();
	}

    /**
     * 初始化8位方向码
     */
    private init8BitDirValue():void
    {
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
    }

    /**
     * 根据4位方向判断是否有地形
     * @param row       行数
     * @param columns   列数
     * @param dir       方向
     */
    public hasTerrainBy4bitDir(row:number, column:number, dir:number):boolean
    {
        var tile:Tile = this.tileList[row][column];
        if(!tile) return false;
        switch (dir)
        {
            case TileBitmasking.UP_4BIT:
                if(row - 1 < 0) break;
                tile = this.tileList[row - 1][column];
                break;
            case TileBitmasking.DOWN_4BIT:
                if(row + 1 > this.rows) break;
                tile = this.tileList[row + 1][column];
                break;
            case TileBitmasking.LEFT_4BIT:
                if(column - 1 < 0) break;
                tile = this.tileList[row][column - 1];
                break;
            case TileBitmasking.RIGHT_4BIT:
                if(column + 1 > this.columns) break;
                tile = this.tileList[row][column + 1];
                break;
            default:
                return false;
                break;
        }
        if(!tile) return false;
        return tile.isTerrain;
    }

    /**
     * 根据8位方向判断是否有地形
     * @param row       行数
     * @param column   列数
     * @param dir       方向
     */
    public hasTerrainBy8bitDir(row:number, column:number, dir:number):boolean
    {
        var tile:Tile = this.tileList[row][column];
        if(!tile) return false;
        switch (dir)
        {
            case TileBitmasking.UP_8BIT:
                if(row - 1 < 0) break;
                tile = this.tileList[row - 1][column];
                break;
            case TileBitmasking.DOWN_8BIT:
                if(row + 1 > this.rows) break;
                tile = this.tileList[row + 1][column];
                break;
            case TileBitmasking.LEFT_8BIT:
                if(column - 1 < 0) break;
                tile = this.tileList[row][column - 1];
                break;
            case TileBitmasking.RIGHT_8BIT:
                if(column + 1 > this.columns) break;
                tile = this.tileList[row][column + 1];
                break;
            case TileBitmasking.LEFT_UP_8BIT:
                if(row - 1 < 0 || column - 1 < 0) break;
                tile = this.tileList[row - 1][column - 1];
                break;
            case TileBitmasking.LEFT_DOWN_8BIT:
                if(row + 1 > this.rows || column - 1 < 0) break;
                tile = this.tileList[row + 1][column - 1];
                break;
            case TileBitmasking.RIGHT_UP_8BIT:
                if(row - 1 < 0 || column + 1 > this.columns) break;
                tile = this.tileList[row - 1][column + 1];
                break;
            case TileBitmasking.RIGHT_DOWN_8BIT:
                if(row + 1 > this.rows || column + 1 > this.columns) break;
                tile = this.tileList[row + 1][column + 1];
                break;
            default:
                return false;
                break;
        }
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
    public math8BitDirValues(row:number, columns:number):number
    {
        var up:boolean = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.UP_8BIT);
        var left:boolean = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.LEFT_8BIT);
        var right:boolean = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.RIGHT_8BIT);
        var down:boolean = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.DOWN_8BIT);
        var upLeft:boolean = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.LEFT_UP_8BIT) && up && left;
        var upRight:boolean = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.RIGHT_UP_8BIT) && up && right;
        var downLeft:boolean = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.LEFT_DOWN_8BIT) && down && left;
        var downRight:boolean = this.hasTerrainBy8bitDir(row, columns, TileBitmasking.RIGHT_DOWN_8BIT) && down && right;

        var upVal:number = up ? 1 : 0;
        var leftVal:number = left ? 1 : 0;
        var rightVal:number = right ? 1 : 0;
        var downVal:number = down ? 1 : 0;
        var upLeftVal:number = upLeft ? 1 : 0;
        var upRightVal:number = upRight ? 1 : 0;
        var downLeftVal:number = downLeft ? 1 : 0;
        var downRightVal:number = downRight ? 1 : 0;

        var index:number = upLeftVal + 2*upVal +
                              4*upRightVal + 8*leftVal + 16*rightVal +
                              32*downLeftVal + 64*downVal + 128*downRightVal;
        var dirValue:number = this.dirValue8BitObj[index];
        return dirValue;
    }
}
