/**
 * 地形格子
 * @author Kanon
 * 格子基础数据类型
 * 包含方向 权值 索引
 */
class Tile
{
    //x坐标
    public row:number;
    //y坐标
    public column:number;
    //方向上的权重
    public dirValue:number;
    //是否是地形
    public isTerrain:boolean;
    //显示对象
    public userData:Object;
    public constructor(row:number, column:number)
	{
        this.row = row;
        this.column = column;
	}


}
